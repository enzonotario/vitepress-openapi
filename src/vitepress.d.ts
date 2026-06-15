import 'vitepress'

declare module 'vitepress' {
  export namespace DefaultTheme {
    interface Config {
      /**
       * Optional sidebar configuration used by `OASpecPlayground`.
       * Supports the same array/object forms as `themeConfig.sidebar`.
       */
      playgroundSidebar?: Sidebar
    }
  }
}
