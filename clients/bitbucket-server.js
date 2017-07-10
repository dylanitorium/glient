import Client from './base';

/**
 * BitBucket Client
 */
export default class BitBucketServer extends Client {
  /**
   *
   * @param opts
   */
  constructor(opts) {
    super(opts);
    this.user = opts.user;
    this.password = opts.password;
    this._initProjects();
    this._initDashboard();
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
        return self._request(self._getUri('projects', key));
      },
      post(data) {
        return self._request(self._getUri('projects'), 'post', data);
      },
    };
    this.project = key => (
      {
        repos: {
          get(slug) {
            return self._request(self._getUri('projects', key, 'repos', slug));
          },
          post(data) {
            return self._request(self._getUri('projects', key, 'repos'), 'post', data);
          },
        },
        repo(slug) {
          return {
            commits: {
              get() {
                return self._request(self._getUri('projects', key, 'repos', slug, 'commits'));
              },
            },
            branches: {
              get(query) {
                return self._request(self._getUri('projects', key, 'repos', slug, 'branches'), 'get', {}, {}, query);
              },
              post(data) {
                return self._request(self._getUri('projects', key, 'repos', slug, 'branches'), 'post', data);
              },
            },
          };
        },
      }
    );
  }

  /**
   *
   * @returns {*}
   * @private
   */
  _initDashboard() {
    const self = this;
    this.dashboard = {
      pullRequestSuggestions: {
        get(query) {
          return self._request(self._getUri('projects', 'pull-request-suggestions'), 'get', {}, {}, query);
        },
      },
      pullRequests: {
        get(query) {
          return self._request(self._getUri('projects', 'pull-requests'), 'get', {}, {}, query);
        },
      },
    };
  }
}

/*
 http://example.com/rest/api/1.0//inbox
 http://example.com/rest/api/1.0//inbox/pull-requests [GET]
 http://example.com/rest/api/1.0//inbox/pull-requests/count [GET]

 http://example.com/rest/api/1.0/admin
 http://example.com/rest/api/1.0/admin/groups [POST, GET, DELETE]
 http://example.com/rest/api/1.0/admin/groups/add-user [POST]
 http://example.com/rest/api/1.0/admin/groups/add-users [POST]
 http://example.com/rest/api/1.0/admin/groups/more-members [GET]
 http://example.com/rest/api/1.0/admin/groups/more-non-members [GET]
 http://example.com/rest/api/1.0/admin/groups/remove-user [POST]
 http://example.com/rest/api/1.0/admin/users [POST, DELETE, PUT, GET]
 http://example.com/rest/api/1.0/admin/users/add-group [POST]
 http://example.com/rest/api/1.0/admin/users/add-groups [POST]
 http://example.com/rest/api/1.0/admin/users/captcha [DELETE]
 http://example.com/rest/api/1.0/admin/users/credentials [PUT]
 http://example.com/rest/api/1.0/admin/users/more-members [GET]
 http://example.com/rest/api/1.0/admin/users/more-non-members [GET]
 http://example.com/rest/api/1.0/admin/users/remove-group [POST]
 http://example.com/rest/api/1.0/admin/users/rename [POST]

 http://example.com/rest/api/1.0/admin/cluster [GET]

 http://example.com/rest/api/1.0/admin/license [GET, POST]

 http://example.com/rest/api/1.0/admin/mail-server [DELETE, GET, PUT]
 http://example.com/rest/api/1.0/admin/mail-server/sender-address [DELETE, GET, PUT]

 http://example.com/rest/api/1.0/admin/permissions
 http://example.com/rest/api/1.0/admin/permissions/groups [DELETE, GET, PUT]
 http://example.com/rest/api/1.0/admin/permissions/groups/none [GET]
 http://example.com/rest/api/1.0/admin/permissions/users [PUT, DELETE, GET]
 http://example.com/rest/api/1.0/admin/permissions/users/none [GET]

 http://example.com/rest/api/1.0/admin/pull-requests/{scmId} [GET, POST]

 http://example.com/rest/api/1.0/application-properties [GET]

 http://example.com/rest/api/1.0/groups [GET]

 http://example.com/rest/api/1.0/hooks
 http://example.com/rest/api/1.0/hooks/{hookKey}/avatar [GET]

 http://example.com/rest/api/1.0/logs
 http://example.com/rest/api/1.0/logs/logger/{loggerName} [GET]
 http://example.com/rest/api/1.0/logs/logger/{loggerName}/{levelName} [PUT]
 http://example.com/rest/api/1.0/logs/rootLogger [GET]
 http://example.com/rest/api/1.0/logs/rootLogger/{levelName} [PUT]

 http://example.com/rest/api/1.0/markup
 http://example.com/rest/api/1.0/markup/preview [POST]

 http://example.com/rest/api/1.0/profile/recent/repos [GET]

 http://example.com/rest/api/1.0/projects [GET, POST]
 http://example.com/rest/api/1.0/projects/{projectKey} [DELETE, PUT, GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/avatar.png [GET, POST]

 http://example.com/rest/api/1.0/projects/{projectKey}/permissions
 http://example.com/rest/api/1.0/projects/{projectKey}/permissions/groups [DELETE, GET, PUT]
 http://example.com/rest/api/1.0/projects/{projectKey}/permissions/groups/none [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/permissions/users [PUT, DELETE, GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/permissions/users/none [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/permissions/{permission}/all [GET, POST]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos [GET, POST]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug} [DELETE, POST, GET, PUT]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/forks [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/recreate [POST]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/related [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/archive [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/branches/default [PUT, GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/browse [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/browse/{path:.*} [PUT, GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/changes [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/commits [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId} [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/changes [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments [POST, GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments/{commentId} [DELETE, PUT, GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/diff [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/diff/{path:.*} [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/watch [DELETE, POST]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/compare
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/compare/changes [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/compare/commits [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/compare/diff{path:.*} [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/diff [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/diff/{path:.*} [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/files [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/files/{path:.*} [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/last-modified [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/last-modified/{path:.*} [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/participants [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/permissions
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/permissions/groups [PUT, DELETE, GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/permissions/groups/none [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/permissions/users [PUT, DELETE, GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/permissions/users/none [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests [GET, POST]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId} [GET, PUT, DELETE]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/activities [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/decline [POST]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge [GET, POST]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/reopen [POST]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/approve [POST, DELETE]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/changes [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments [POST, GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments/{commentId} [DELETE, PUT, GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/commits [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/diff [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/diff/{path:.*} [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants [DELETE, GET, POST]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants/{userSlug} [DELETE, PUT]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/tasks [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/tasks/count [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/watch [DELETE, POST]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests [POST, GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/hooks [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey} [GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/enabled [PUT, DELETE]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/settings [PUT, GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/tags [POST, GET]
 http://example.com/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/tags/{name:.*} [GET]

 http://example.com/rest/api/1.0/projects/{projectKey}/settings
 http://example.com/rest/api/1.0/projects/{projectKey}/settings/pull-requests/{scmId} [POST, GET]

 http://example.com/rest/api/1.0/repos [GET]

 http://example.com/rest/api/1.0/tasks [POST]
 http://example.com/rest/api/1.0/tasks/{taskId} [DELETE, PUT, GET]

 http://example.com/rest/api/1.0/users [PUT, GET]
 http://example.com/rest/api/1.0/users/credentials [PUT]
 http://example.com/rest/api/1.0/users/{userSlug} [GET]
 http://example.com/rest/api/1.0/users/{userSlug}/avatar.png [POST, DELETE]

 http://example.com/rest/api/1.0/users/{userSlug}/settings [POST, GET]
 */
