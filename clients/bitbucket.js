import Client from './base';
import _ from 'lodash';

/**
 * BitBucket Client
 */
export default class BitBucket extends Client {
  /**
   *
   * @param opts
   */
  constructor(opts) {
    super(opts);
    this.user = opts.user;
    this.password = opts.password
    this._initProjects();
  }

  /**
   *
   * @returns {{user: (*|String|Object), pass: (String|*)}}
   * @private
   */
  _getAuth() {
    return {
      user: this.user,
      pass: this.password,
    }
  }

  /**
   *
   * @returns {*}
   * @private
   */
  _initProjects() {
    const self = this;
    this.projects = {
      get(key) {
        return self._request(self._getUri('projects', key))
      },
      post(data) {
        return self._request(self._getUri('projects'), 'post', data)
      },
    };
    this.project = (key) => {
      return {
        repos: {
          get(slug) {
            return self._request(self._getUri('projects', key, 'repos', slug))
          },
          post(data) {
            return self._request(self._getUri('projects', key, 'repos'), 'post', data)
          },
        },
        repo(slug) {
          return {
            commits: {
              get() {
                return self._request(self._getUri('projects', key, 'repos', slug, 'commits'));
              }
            },
            branches: {
              get(query) {
                return self._request(self._getUri('projects', key, 'repos', slug, 'branches'), 'get', {}, {}, query);
              },
              post(data) {
                return self._request(self._getUri('projects', key, 'repos', slug, 'branches'), 'post', data)
              },
            }
          }
        }
      }
    };
  }
}
