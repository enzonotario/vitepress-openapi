export class OARequest {
  constructor(
    public url: string = '',
    public method: string = 'GET',
    public headers: Record<string, string> = {},
    public body: any = null,
    public query: Record<string, string> = {},
  ) {}
}
