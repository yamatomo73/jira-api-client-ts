/**
 * 
 */
class JiraApiClient {

    private readonly hostname: string;
    private readonly email: string;
    private readonly api_token: string;
    private static readonly BASE_API_PATH: string = 'rest/api/3';

    constructor(hostname: string, email: string, api_token: string) {
        this.hostname = hostname;
        this.email = email;
        this.api_token = api_token;
    }

    private createApiUrl(resource_name: string): string {
        return Utilities.formatString('https://%s.atlassian.net/%s/%s', this.hostname, JiraApiClient.BASE_API_PATH, resource_name);
    }

    /**
     * 全てのプロジェクトを取得する
     * @link https://developer.atlassian.com/cloud/jira/platform/rest/v3/?utm_source=%2Fcloud%2Fjira%2Fplatform%2Frest&utm_medium=302#api-rest-api-3-project-get
     */
    public getAllProjects(): Object {
        const url: string = this.createApiUrl('project');
        return this.requestGitHubApi(url, 'get');
    }

    /**
     * ユーザーが1つ以上のプロジェクトに対するプロジェクトの参照プロジェクト権限を持っている場合、ユーザーが参照する権限を持つプロジェクトに関連付けられている課題タイプが返されます。
     * @link https://developer.atlassian.com/cloud/jira/platform/rest/v3/?utm_source=%2Fcloud%2Fjira%2Fplatform%2Frest&utm_medium=302#api-rest-api-3-issuetype-get
     */
    public getAllIssueTypesForUser(): Object {
        const url: string = this.createApiUrl('issuetype');
        return this.requestGitHubApi(url, 'get');
    }

    /**
     * チケットを参照する
     * @link https://developer.atlassian.com/cloud/jira/platform/rest/v3/?utm_source=%2Fcloud%2Fjira%2Fplatform%2Frest&utm_medium=302#api-rest-api-3-issue-issueIdOrKey-get
     * 
     * @param issueIdOrKey 
     * @param fields 
     */
    public getIssueByissueIdOrKey(issueIdOrKey: string, fields?: Array<string>): Object {
        const url: string = this.createApiUrl(Utilities.formatString('issue/%s', issueIdOrKey));
        return this.requestGitHubApi(url, 'get');
    }

    /**
     * チケットを作成する
     * @link https://developer.atlassian.com/cloud/jira/platform/rest/v3/?utm_source=%2Fcloud%2Fjira%2Fplatform%2Frest&utm_medium=302#api-rest-api-3-issue-post
     *
     * @param project_id 
     * @param issueType 
     * @param reporter 
     */
    public createIssue(projectId: string, issueType: string, priority: string, reporter: string, summary: string, labels: Array<string>): Object {
        const url: string = this.createApiUrl('issue');
        return this.requestGitHubApi(url, 'post',
            {
                'update': {},
                'fields': {
                    'project': projectId,
                    'issuetype': issueType,
                    'priority': priority,
                    'reporter': reporter,
                    'summary': summary,
                    'description': 'チケット説明',
                },
            }
        );
    }

    /**
    * @returns object
    */
    private requestGitHubApi(url: string, method: 'get' | 'delete' | 'patch' | 'post' | 'put', payload?: Object): Object {
        const header: Object = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': Utilities.formatString('Basic %s', Utilities.base64Encode(this.email + ":" + this.api_token)),
        };
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            'method': method,
            'headers': header,
            //, 'muteHttpExceptions': true
        };
        if (payload) {
            options.payload = JSON.stringify(payload);
        }

        var response = UrlFetchApp.fetch(url, options);
        var response_body = response.getContentText();
        return JSON.parse(response_body);
    }
}

class CreateIssueRequest {
    constructor() {
    }

}