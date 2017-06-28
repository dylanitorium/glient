import Client from './base';

/**
 * Gitlab Client
 */
export default class Gitlab extends Client {
  /**
   *
   * @param opts
   */
  constructor(opts) {
    super(opts);

    this.token = opts.token;

    this._initProjects();
  }

  /**
   *
   * @returns {*}
   * @private
   */
  _initProjects() {
    const self = this;
    this.projects = {
      get(id, query) {
        return self._request(self._getUri('projects', id), 'get', {}, {}, query)
      },
      pages(per_page = 20) {
        return self._request(self._getUri('projects'), 'get', {}, {}, { per_page }, true)
          .then((response) => {
            return response.headers['x-total-pages'];
          })
      },
    }
  }

  /**
   *
   * @param headers
   * @returns {*}
   * @private
   */
  _getHeaders(headers) {
    return Object.assign({}, headers, {
      'PRIVATE-TOKEN': this.token,
    })
  }
}
