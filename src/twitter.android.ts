import * as utils from 'tns-core-modules/utils/utils';
import * as app from 'tns-core-modules/application';
import { View } from 'tns-core-modules/ui/core/view';
import { fromObject } from 'tns-core-modules/data/observable';
import * as http from 'tns-core-modules/http';

//declare const com: any, java;
export class TNSTwitter {
    public static init(key: string, secret: string) {
        const config = new com.twitter.sdk.android.core.TwitterConfig.Builder(utils.ad.getApplicationContext())
            .twitterAuthConfig(new com.twitter.sdk.android.core.TwitterAuthConfig(key, secret))
            .build();
        com.twitter.sdk.android.core.Twitter.initialize(config);
    }

    public static getCurrentUserEmail(): Promise<any> {
        return new Promise((resolve, reject) => {
            const session = com.twitter.sdk.android.core.TwitterCore.getInstance().getSessionManager().getActiveSession();
            const client = new com.twitter.sdk.android.core.identity.TwitterAuthClient();
            const cb = (com as any).twitter.sdk.android.core.Callback.extend(
                {
                    success(result) {
                        if (result.data && result.data.length > 0) {
                            resolve(result.data);
                        } else {
                            reject({'message': 'This user does not have an email address.'})
                        }
                    }, failure(exception) {
                        reject({message: exception.getMessage()})
                    }
                }
            );
            client.requestEmail(session, new cb());
        });
    }

    public static getCurrentUser(userID: string, token?: string, tokenSecret?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const api = new CustomApiService();
            api.makeRequest('https://api.twitter.com/1.1/account/verify_credentials.json', 'get')
                .then(
                    data => {
                        const user = data.content.toJSON();
                        resolve({
                            formattedScreenName: user.screen_name,
                            isProtected: user.protected,
                            isVerified: user.verified,
                            name: user.name,
                            profileImageLargeURL: user.profile_image_url_https.replace('_normal', '_bigger'),
                            profileImageMiniURL: user.profile_image_url_https.replace('_normal', '_mini'),
                            profileImageURL: user.profile_image_url_https,
                            profileURL: user.url,
                            screenName: user.screen_name,
                            userID: user.id,
                            token,
                            tokenSecret
                        })
                    }, err => {
                        reject({message: err.message});
                    });

        });
    }

    public static logIn(controller: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const activity = app.android.startActivity || app.android.foregroundActivity;
            const client = new com.twitter.sdk.android.core.identity.TwitterAuthClient();
            const cb = (com as any).twitter.sdk.android.core.Callback.extend({
                success(result: com.twitter.sdk.android.core.Result<any>) {
                    const data = result.data;
                    const auth = result.data.getAuthToken();
                    TNSTwitter.getCurrentUser(data.getUserId(), auth.token, auth.secret)
                        .then(user => {
                            resolve(user);
                        }).catch(error => {
                        reject(error);
                    })
                },
                failure(exception) {
                    reject({
                        message: exception.getMessage()
                    })
                }
            });

            client.authorize(activity, new cb);
            const callback = function (args: app.AndroidActivityResultEventData) {
                if (args.requestCode === client.getRequestCode()) {
                    client.onActivityResult(args.requestCode, args.resultCode, args.intent);
                    app.android.off(app.AndroidApplication.activityResultEvent, callback);
                }
            };
            app.android.on(app.AndroidApplication.activityResultEvent, callback);

        });
    }

    public static getNativeConfig() {
        return com.twitter.sdk.android.core.TwitterCore.getInstance().getAuthConfig();
    }

    public static getNativeToken() {
        return com.twitter.sdk.android.core.TwitterCore.getInstance().getSessionManager().getActiveSession() ? com.twitter.sdk.android.core.TwitterCore.getInstance().getSessionManager().getActiveSession().getAuthToken() : null;
    }
}

export class TNSTwitterButton extends View {
    get android() {
        return this.nativeView;
    }

    public createNativeView() {
        return new com.twitter.sdk.android.core.identity.TwitterLoginButton(this._context)
    }

    public initNativeView() {
        const that = new WeakRef<TNSTwitterButton>(this);
        const _cb = (com as any).twitter.sdk.android.core.Callback.extend({
            success(result) {
                const owner = that.get();
                if (owner) {
                    owner.notify({
                        eventName: 'loginStatus',
                        object: fromObject({
                            value: 'success',
                            userName: result.data.getUserName(),
                            userID: result.data.getUserId()
                        })
                    });
                }
            },
            failure(exception) {
                const owner = that.get();
                if (owner) {
                    owner.notify({
                        eventName: 'loginStatus',
                        object: fromObject({value: 'failed', message: exception.getMessage()})
                    });
                }
            }
        });
        this.nativeView.setCallback(new _cb());
        app.android.on(app.AndroidApplication.activityResultEvent, (args: app.AndroidActivityResultEventData) => {
            this.nativeView.onActivityResult(args.requestCode, args.resultCode, args.intent);
        })
    }

}

export class CustomApiService {
    private _config;
    private _token;

    constructor() {
        this._config = TNSTwitter.getNativeConfig();
        this._token = TNSTwitter.getNativeToken();
    }

    makeRequest(url, method, options?): Promise<any> {
        if (this._config && this._token) {
            try {
                const oauth = new com.twitter.sdk.android.core.OAuthSigning(this._config, this._token);
                const auth = oauth.getAuthorizationHeader(method, url, options ? this.buildOptions(options) : null);
                return http.request({
                    url: url,
                    method: method,
                    headers: {
                        'Authorization': auth
                    }
                })
            } catch (ex) {
                return new Promise((resolve, reject) => {
                    reject(ex);
                });
            }

        } else {
            return new Promise((resolve, reject) => {
                reject('User is not logged in');
            });
        }
    }


    private buildOptions(value) {
        let store = new java.util.HashMap();
        Object.keys(value).forEach((item, key) => {
            switch (typeof value[item]) {
                case 'string':
                    store.put(item, value[item]);
                    break;
                case 'boolean':
                    store.put(item, `${value[item]}`);
                    break;
                case 'number':
                    store.put(item, value[item]);
                    break;
            }
        });
        return store;
    }

}
