import process from 'node:process'
import { defineStandaloneTests } from '../standalone.tests'

// Built into the docs site at /standalone/ (see docs/.vitepress/config.mts).
defineStandaloneTests(`${process.env.PLAYWRIGHT_BASE_URL ?? ''}/standalone`)
