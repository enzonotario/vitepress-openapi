import process from 'node:process'
import { runCli } from './node/cli'

runCli(process.argv.slice(2)).then((code) => {
  process.exitCode = code
})
