import unirest from 'unirest';

/**
 * Gitlab Client
 */
export default class Client {
  /**
   *
   * @param opts
   */
  constructor(opts) {
    this.host = opts.host;
    this.base = opts.base;
  }

  /**
   *
   * @param resource
   * @returns {string}
   */
  _getUri() {
    return `${this.host}/${this.base}/${Array.from(arguments).join('/')}`;
  }

  /**
   *
   * @param headers
   * @returns {*}
   * @private
   */
  _getHeaders(headers) {
    return headers;
  }

  /**
   *
   * @private
   */
  _getAuth() {

  }

  _request(uri, method = 'get', data = {}, headers = {}, query = {}, responseHeaders = false) {
    const request = unirest[method](uri)
      .headers(Object.assign({}, this._getHeaders(headers), {
        'Content-Type': 'application/json',
      }))
      .query(query)
      .send(data);

    const auth = this._getAuth();
    if(auth) {
      request.auth(auth);
    }

    return new Promise((resolve, reject) => {
      request.end((response) => {
        const error = response.error || response.body.errors;
        if (error) {
          reject(error)
        }

        if (responseHeaders) {
          resolve({
            headers: response.headers,
            body: response.body,
          })
        }

        resolve(response.body);
      })
    })
  }
}
