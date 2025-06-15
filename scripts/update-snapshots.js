import fs from 'node:fs'
import path from 'node:path'

function main(snapshotsDir, resultsDir) {
  console.log('🔍 Searching for actual.png files in:', resultsDir)

  if (!fs.existsSync(resultsDir)) {
    console.error('❌ Results directory does not exist:', resultsDir)
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
        const testCase = testDir.split('-').slice(1, -1).join('-')
        const browser = testDir.includes('chromium') ? 'chromium' : 'firefox'

        const targetDirBase = `${testName}.spec.ts-snapshots`
        const targetDir = path.join(snapshotsDir, targetDirBase)
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
    processDirectory(resultsDir)

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

main(
  path.resolve('./e2e/local'),
  path.resolve('./e2e/local/test-results'),
)

main(
  path.resolve('./e2e/staging'),
  path.resolve('./e2e/staging/test-results'),
)
