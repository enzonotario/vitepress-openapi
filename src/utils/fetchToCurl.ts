export const generateMethod = (options: any): string => {
  const method = options.method;
  if (!method) return '';
  const type: { [key: string]: string } = {
    GET: '-X GET',
    POST: '-X POST',
    PUT: '-X PUT',
    PATCH: '-X PATCH',
    DELETE: '-X DELETE',
    HEAD: '-X HEAD',
    OPTIONS: '-X OPTIONS'
  };
  return type[method.toUpperCase()] || '';
}

export const isInstanceOfHeaders = (val: any): boolean => {
  if (typeof Headers !== "function"){
    /**
     * Environment does not support the Headers constructor
     * old internet explorer?
     */
    return false;
  }
  return val instanceof Headers;
}

interface HeaderParams {
  isEncode: boolean;
  params: string;
}

const getHeaderString = (name: string, val: any): string => ` -H "${name}: ${`${val}`.replace(/(\\|")/g, '\\$1')}"`;

export const generateHeader = (options: { headers?: any } = {}): HeaderParams => {
  const { headers } = options;
  let isEncode = false;
  let headerParam = '';
  if (isInstanceOfHeaders(headers)){
    headers.forEach((val: any, name: string) => {
      if (name.toLocaleLowerCase() !== 'content-length') {
        headerParam += getHeaderString(name, val);
      }
      if (name.toLocaleLowerCase() === 'accept-encoding'){
        isEncode = true;
      }
    })
  } else if (headers){
    Object.keys(headers).map(name => {
      if (name.toLocaleLowerCase() !== 'content-length') {
        headerParam += getHeaderString(name, headers[name]);
      }
      if (name.toLocaleLowerCase() === 'accept-encoding') {
        isEncode = true;
      }
    });
  }
  return {
    params: headerParam,
    isEncode,
  };
}

export function escapeBody(body: any): string {
  if (typeof body !== 'string') return body;
  return body.replace(/'/g, `'\\''`);
}

export function generateBody(body: any): string {
  if (!body) return '';
  if (typeof body === "object"){
    return ` --data '${escapeBody(JSON.stringify(body))}'`;
  }
  return ` --data '${escapeBody(body)}'`;
}

export function generateCompress(isEncode: boolean): string {
  return isEncode ? ' --compressed' : '';
}

export const fetchToCurl = (requestInfo: string | { url?: string }, requestInit: object = {}): string => {
  let url: string | undefined, options: any;
  /**
   * initialization with an empty object is done here to
   * keep everything backwards compatible to 0.4.0 and below
   */
  if (typeof requestInfo === "string" || requestInfo instanceof URL) {
    url = requestInfo.toString();
    options = requestInit || {};
  } else {
    url = (requestInfo || {}).url;
    options = requestInfo || {};
  }
  const { body } = options;
  const headers = generateHeader(options);

  let output = `curl ${generateMethod(options)} '${url}'`

  if (headers.params) {
    output += ` \\\n${headers.params}`
  }

  if (body) {
    output += ` \\\n${generateBody(body)}`
  }

  if (headers.isEncode) {
    output += ` \\\n${generateCompress(headers.isEncode)}`
  }

  return output;
}

export default fetchToCurl;
