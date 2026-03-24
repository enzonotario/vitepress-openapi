# plan

- chunking - make use of dynamic imports and components
- import cost - external packages - shall replace with lightweight alternatives 
- refactor - improving the parsing and rendering of the spec

# issues
- parseSpec is async but used for tranformSync & parseSync in parseOpenapi.ts
    ```sh
    import { parseSpec } from '../utils/parseSpec'
    ```