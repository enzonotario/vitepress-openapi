import fs from 'node:fs'
import path from 'node:path'

const TEST_RESULTS_DIR = path.resolve('./e2e/test-results')
const SNAPSHOTS_DIR = path.resolve('./e2e')

function main() {
  console.log('🔍 Searching for actual.png files in:', TEST_RESULTS_DIR)

  if (!fs.existsSync(TEST_RESULTS_DIR)) {
    console.error('❌ Results directory does not exist:', TEST_RESULTS_DIR)
    return
  }

  let updatedFiles = 0

  function processDirectory(dirPath) {
    const items = (fs.readdirSync(dirPath))
      .filter(item => !item.match(/retry\d+$/))

    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      const stats = fs.statSync(itemPath)

      if (stats.isDirectory()) {
        processDirectory(itemPath)
      } else if (stats.isFile() && item.endsWith('-actual.png')) {
        console.log(`📄 Found: ${itemPath}`)

        const testDir = path.basename(path.dirname(itemPath))
        const testName = testDir.split('-')[0]
        const testCase = testDir.split('-')[1]
        const browser = testDir.includes('chromium') ? 'chromium' : 'firefox'

        const targetDirBase = `${testName}.spec.ts-snapshots`
        const targetDir = path.join(SNAPSHOTS_DIR, targetDirBase)
        const targetFile = `${testCase}-1-${browser}-linux.png`
        const targetPath = path.join(targetDir, targetFile)

        if (!fs.existsSync(targetDir)) {
          console.log(`📁 Creating directory: ${targetDir}`)
          fs.mkdirSync(targetDir, { recursive: true })
        }

        console.log(`📝 Copying ${itemPath} -> ${targetPath}`)
        fs.copyFileSync(itemPath, targetPath)
        updatedFiles++
      }
    }
  }

  try {
    processDirectory(TEST_RESULTS_DIR)

    console.log(`✅ ${updatedFiles} snapshot files were updated.`)

    if (updatedFiles > 0) {
      console.log('💡 Tip: Review the changes and commit the updated files.')
    } else {
      console.log('ℹ️ No files found to update.')
    }
  } catch (error) {
    console.error('❌ Error processing files:', error)
  }
}

main()
