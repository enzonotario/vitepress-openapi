const availableLanguages = [
  {
    lang: 'curl',
    label: 'cURL',
    highlighter: 'bash',
  },
  {
    lang: 'javascript',
    label: 'JavaScript',
    highlighter: 'javascript',
  },
  {
    lang: 'php',
    label: 'PHP',
    highlighter: 'php',
  },
  {
    lang: 'python',
    label: 'Python',
    highlighter: 'python',
  },
]

export function useCodeSamples() {
  return {
    availableLanguages,
  }
}
