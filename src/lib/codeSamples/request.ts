export interface IOARequest {
  url: string
  method: string
  headers: Record<string, string>
  body: any
  query: Record<string, string>
}

export class OARequest {
  constructor(
    public url: string = '',
    public method: string = 'GET',
    public headers?: Record<string, string>,
    public body?: any,
    public query?: Record<string, string>,
  ) {
    if (!headers) {
      this.headers = {}
    }

    if (!query) {
      this.query = {}
    }
  }
}
