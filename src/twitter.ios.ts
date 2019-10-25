import { View } from 'tns-core-modules/ui/core/view';
import { fromObject } from 'tns-core-modules/data/observable';
import * as types from 'tns-core-modules/utils/types';

declare const NSJSONSerialization;

export class TNSTwitter {
    public static init(key: string, secret: string) {
    }

    public static getCurrentUserEmail(): Promise<any> {
        return new Promise((resolve, reject) => {
            const client = TWTRAPIClient.clientWithCurrentUser();
            client.requestEmailForCurrentUser((email: string, error) => {
                if (error) {
                    reject({message: error.localizedDescription});
                } else {
                    resolve(email);
                }
            });
        });
    }

    public static getCurrentUser(userID: string, token?: string, tokenSecret?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const client = TWTRAPIClient.clientWithCurrentUser();
            client.loadUserWithIDCompletion(userID, (user: TWTRUser, error) => {
                if (error) {
                    reject({message: error.localizedDescription});
                } else {
                    resolve({
                        formattedScreenName: user.formattedScreenName,
                        isProtected: user.isProtected,
                        isVerified: user.isVerified,
                        name: user.name,
                        profileImageLargeURL: user.profileImageLargeURL,
                        profileImageMiniURL: user.profileImageMiniURL,
                        profileImageURL: user.profileImageURL,
                        profileURL: user.profileURL,
                        screenName: user.screenName,
                        userID: user.userID,
                        token,
                        tokenSecret
                    })
                }
            });
        });
    }

    public static logIn(controller: any): Promise<any> {
        return new Promise((resolve, reject) => {
            TWTRTwitter.sharedInstance().logInWithViewControllerCompletion(controller, (session, error) => {
                if (error) {
                    reject({message: error.localizedDescription});
                } else {
                    TNSTwitter.getCurrentUser(session.userID, session.authToken, session.authTokenSecret).then(user => {
                        resolve(user);
                    }).catch(error => {
                        reject(error)
                    })
                }

            });
        });
    }
}

export class TNSTwitterButton extends View {
    get ios() {
        return this.nativeView;
    }

    public createNativeView() {
        return TWTRLogInButton.buttonWithLogInCompletion((session, error) => {
            if (error) {
                this.notify({
                    eventName: 'loginStatus',
                    object: fromObject({value: 'failed', message: error.localizedDescription})
                });
            } else {
                this.notify({
                    eventName: 'loginStatus',
                    object: fromObject({value: 'success', userName: session.userName, userID: session.userID})
                });
            }
        });
    }
}

export class CustomApiService {
    private _config;
    private _token;

    constructor() {
        const instance = TWTRTwitter.sharedInstance();
        this._config = instance.authConfig;
        this._token = instance.sessionStore.session();
    }

    makeRequest(url, method, options?): Promise<any> {
        return new Promise((resolve, reject) => {
            let nsError;
            const client: any = TWTRAPIClient.clientWithCurrentUser();
            const request = client.URLRequestWithMethodURLParametersError(method, url, null, nsError);
            if (request) {
                client.sendTwitterRequestCompletion(request, (res, data, error) => {
                    if (data) {
                        const json = NSJSONSerialization.JSONObjectWithDataOptionsError(data, 0);
                        resolve(this.toJsObject(json));
                    } else {
                        reject({message: error.localizedDescription})
                    }
                });
            } else {
                reject({message: nsError.localizedDescription})
            }
        });
    }


    toJsObject = function (objCObj) {
        if (objCObj === null || typeof objCObj != 'object') {
            return objCObj;
        }
        var node, key, i, l,
            oKeyArr = objCObj.allKeys;
        if (oKeyArr === undefined) {
            // array
            node = [];
            for (i = 0, l = objCObj.count; i < l; i++) {
                key = objCObj.objectAtIndex(i);
                node.push(this.toJsObject(key));
            }
        } else {
            // object
            node = {};
            for (i = 0, l = oKeyArr.count; i < l; i++) {
                key = oKeyArr.objectAtIndex(i);
                var val = objCObj.valueForKey(key);
                if (val) {
                    switch (types.getClass(val)) {
                        case 'NSArray':
                        case 'NSMutableArray':
                            node[key] = this.toJsObject(val);
                            break;
                        case 'NSDictionary':
                        case 'NSMutableDictionary':
                            node[key] = this.toJsObject(val);
                            break;
                        case 'String':
                            node[key] = String(val);
                            break;
                        case 'Boolean':
                            node[key] = Boolean(val);
                            break;
                        case 'Number':
                            node[key] = Number(String(val));
                            break;
                    }
                }

            }
        }
        return node;
    };
}
