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

    public getIssueByissueIdOrKey(issueIdOrKey: string, fields?: Array<string>): Object {
        return this.requestGitHubApi(Utilities.formatString('https://%s.atlassian.net/%s/issue/%s', this.hostname, JiraApiClient.BASE_API_PATH, issueIdOrKey), 'get');
    }

    /**
    * @returns object
    */
    private requestGitHubApi(url: string, method: 'get' | 'delete' | 'patch' | 'post' | 'put', payload?: Object): Object {
        const header: Object = {
            'Content-Type': 'application/json',
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
