import MarkdownIt from 'markdown-it'
import { beforeEach, describe, expect, it } from 'vitest'
import { useOpenapi } from '../../../src/composables/useOpenapi'
import { operationLink } from '../../../src/lib/markdown/operationLink'
import { spec } from '../../testsConstants'

describe('operationsLinkPlugin', () => {
  let md: MarkdownIt

  beforeEach(() => {
    useOpenapi({
      spec,
    })

    md = new MarkdownIt()

    operationLink(md, {
      linkPrefix: '/operations/',
    })
  })

  it('transforms operation links correctly', () => {
    const input = '[Get Users](/operations/getUsers)'
    const output = md.render(input)

    expect(output).toContain(`<p><a href="/operations/getUsers" class="OAOperationLink group/oaSidebarItem"><span class="OAOperationLink-badge OAMethodBadge--get">GET</span><span>Get Users</span></a></p>
`)
  })

  it('uses operation summary when no link text is provided', () => {
    const input = '[](/operations/getUserPets)'
    const output = md.render(input)

    expect(output).toContain(`<p><a href="/operations/getUserPets" class="OAOperationLink group/oaSidebarItem"><span class="OAOperationLink-badge OAMethodBadge--get">GET</span><span>Get a list of pets for a user</span></a></p>`)
  })

  it('uses operationId when no link text or summary is provided', () => {
    const input = '[](/operations/getUser)'
    const output = md.render(input)

    expect(output).toContain(`<p><a href="/operations/getUser" class="OAOperationLink group/oaSidebarItem"><span class="OAOperationLink-badge OAMethodBadge--get">GET</span><span>GET /users/{id}</span></a></p>
`)
  })

  it('leaves non-operation links unchanged', () => {
    const input = '[Regular Link](https://example.com)'
    const output = md.render(input)

    expect(output).toContain('<p><a href="https://example.com">Regular Link</a></p>')
    expect(output).not.toContain('OAOperationLink')
  })

  it('handles invalid operation IDs gracefully', () => {
    const input = '[Invalid Operation](/operations/nonExistentOperation)'
    const output = md.render(input)

    expect(output).toContain('<p><a href="/operations/nonExistentOperation">Invalid Operation</a></p>')
    expect(output).not.toContain('OAOperationLink')
  })

  it('respects custom linkPrefix', () => {
    const customMd = new MarkdownIt()

    operationLink(customMd, {
      linkPrefix: '/api/',
    })

    const input = '[Get Users](/api/getUsers)'
    const output = customMd.render(input)

    expect(output).toContain(`<p><a href="/api/getUsers" class="OAOperationLink group/oaSidebarItem"><span class="OAOperationLink-badge OAMethodBadge--get">GET</span><span>Get Users</span></a></p>
`)
  })

  it('applies transformHref function when provided', () => {
    const customMd = new MarkdownIt()

    operationLink(customMd, {
      linkPrefix: '/operations/',
      transformHref: href => href.replace('/operations/', '/api/'),
    })

    const input = '[Get Users](/operations/getUsers)'
    const output = customMd.render(input)

    expect(output).toContain(`<p><a href="/api/getUsers" class="OAOperationLink group/oaSidebarItem"><span class="OAOperationLink-badge OAMethodBadge--get">GET</span><span>Get Users</span></a></p>
`)
  })

  it('uses custom createOperationLinkHtml function when provided', () => {
    const customMd = new MarkdownIt()

    operationLink(customMd, {
      linkPrefix: '/operations/',
      createOperationLinkHtml: (href, method, title) => {
        return `<a href="${href}" class="custom-link"><span class="custom-badge custom-${method.toLowerCase()}">${method.toUpperCase()}</span><span class="custom-title">${title}</span></a>`
      },
    })

    const input = '[Get Users](/operations/getUsers)'
    const output = customMd.render(input)

    expect(output).toContain(`<p><a href="/operations/getUsers" class="custom-link"><span class="custom-badge custom-get">GET</span><span class="custom-title">Get Users</span></a></p>`)
  })

  it('combines transformHref and custom createOperationLinkHtml when both provided', () => {
    const customMd = new MarkdownIt()

    operationLink(customMd, {
      linkPrefix: '/operations/',
      transformHref: href => href.replace('/operations/', '/api/'),
      createOperationLinkHtml: (href, method, title) => {
        return `<a href="${href}" class="custom-link"><span class="custom-badge custom-${method.toLowerCase()}">${method.toUpperCase()}</span><span class="custom-title">${title}</span></a>`
      },
    })

    const input = '[Get Users](/operations/getUsers)'
    const output = customMd.render(input)

    expect(output).toContain(`<p><a href="/api/getUsers" class="custom-link"><span class="custom-badge custom-get">GET</span><span class="custom-title">Get Users</span></a></p>`)
  })
})
