import type { GenerateMarkdownOptions } from './generate'
import { parseArgs } from 'node:util'
import { generateMarkdown } from './generate'

const HELP = `Usage: vitepress-openapi generate <spec> --out <dir> [options]

Generate plain Markdown (and llms.txt) from an OpenAPI 3.x document.

Arguments:
  <spec>                    Path or URL to a JSON/YAML OpenAPI document

Options:
  -o, --out <dir>           Output directory (required)
  --group-by <mode>         "operation" (default) or "tag"
  --link-prefix <prefix>    Prefix of the links in llms.txt (default "/")
  --openapi-url <url>       URL of the OpenAPI document, linked from every page
  --code-samples <langs>    Comma-separated languages: curl, javascript, php, python (default "curl")
  --no-code-samples         Do not include code samples
  --base-url <url>          Base URL used in code samples (default: first server)
  --no-llms                 Do not generate llms.txt and llms-full.txt
  --no-frontmatter          Do not add VitePress frontmatter
  --clean                   Remove the output directory before writing
  -h, --help                Show this help
`

/**
 * Runs the CLI with the given arguments (without the node/binary path).
 * Returns the process exit code.
 */
export async function runCli(args: string[]): Promise<number> {
  let parsed
  try {
    parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        'out': { type: 'string', short: 'o' },
        'group-by': { type: 'string' },
        'link-prefix': { type: 'string' },
        'openapi-url': { type: 'string' },
        'code-samples': { type: 'string' },
        'no-code-samples': { type: 'boolean' },
        'base-url': { type: 'string' },
        'no-llms': { type: 'boolean' },
        'no-frontmatter': { type: 'boolean' },
        'clean': { type: 'boolean' },
        'help': { type: 'boolean', short: 'h' },
      },
    })
  }
  catch (error) {
    console.error((error as Error).message)
    console.error(HELP)
    return 1
  }

  const { values, positionals } = parsed
  const [command, spec] = positionals

  if (values.help || !command) {
    console.log(HELP)
    return values.help ? 0 : 1
  }

  if (command !== 'generate') {
    console.error(`Unknown command "${command}".\n`)
    console.error(HELP)
    return 1
  }

  if (!spec || !values.out) {
    console.error('Missing <spec> or --out.\n')
    console.error(HELP)
    return 1
  }

  const groupBy = values['group-by'] ?? 'operation'
  if (groupBy !== 'operation' && groupBy !== 'tag') {
    console.error(`Invalid --group-by "${groupBy}": use "operation" or "tag".`)
    return 1
  }

  const options: GenerateMarkdownOptions = {
    ...(/^https?:\/\//i.test(spec) ? { specUrl: spec } : { specPath: spec }),
    outDir: values.out,
    groupBy,
    linkPrefix: values['link-prefix'],
    openapiUrl: values['openapi-url'],
    baseUrl: values['base-url'],
    codeSamples: values['no-code-samples']
      ? false
      : values['code-samples']?.split(',').map(lang => lang.trim()).filter(Boolean),
    llms: !values['no-llms'],
    frontmatter: !values['no-frontmatter'],
    clean: values.clean ?? false,
  }

  try {
    const written = await generateMarkdown(options)
    console.log(`Generated ${written.length} files in ${options.outDir}`)
    return 0
  }
  catch (error) {
    console.error((error as Error).message)
    return 1
  }
}
