import { defineStandaloneTests } from '../standalone.tests'

// Served by the second webServer in playwright.config.ts.
defineStandaloneTests('http://localhost:4174')
