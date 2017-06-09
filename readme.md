# Nativescript Twitter

NativeScript implementation of Twitter SDK (Some Features)

[![npm](https://img.shields.io/npm/v/nativescript-twitter.svg)](https://www.npmjs.com/package/nativescript-twitter)
[![npm](https://img.shields.io/npm/dt/nativescript-twitter.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-twitter)

#### NS 3.0+
`tns plugin add nativescript-twitter`

#### NS < 3.0
`npm install nativescript-twitter@"^1.x"`

## Example Implementation

### Android

```ts 
//app.ts or main.ts
import * as app from "application";
if (app.android) {
    const TNSTwitter = require("nativescript-twitter").TNSTwitter;
    TNSTwitter.init("key", "secret");
}
```


### IOS 

*Note*
Twitter Kit looks for a URL scheme in the format `twitterkit-<consumerKey>,` where consumerKey is your application’s Twitter API key, e.g. twitterkit-dwLf79lNQfsJ. 

In your app’s Info.plist, add URL Schemes by adding code below after `<dict>`
[Source](https://dev.twitter.com/twitterkit/ios/installation)



```plist
// Info.plist
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>twitterkit-<consumerKey></string>
    </array>
  </dict>
</array>
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>twitter</string>
    <string>twitterauth</string>
</array
```

```ts
//custom-app-delegate.ts
import * as utils from "utils/utils";
declare const UIResponder, UIApplicationDelegate, Twitter;
export class CustomAppDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];
    applicationDidFinishLaunchingWithOptions(application, launchOptions) {
        utils.ios.getter(Twitter,Twitter.sharedInstance).startWithConsumerKeyConsumerSecret("key" ,"secret");
        return true;
    }
    applicationOpenURLOptions(application, url, options) {
        return utils.ios.getter(Twitter,Twitter.sharedInstance).applicationOpenURLOptions(application, url, options);
    }
}
```

```ts
//app.ts or main.ts
import * as app from "application";
if (app.ios) {
    app.ios.delegate = require('./custom-app-delegate').CustomAppDelegate;
}
```


IMPORTANT: Make sure you include xmlns:twitter="nativescript-twitter" on the Page tag

```xml
<twitter:TNSTwitterButton id="twitter"/>
```
Listen when user auth is successful or fails

```ts
import * as frame from "ui/frame";
 frame.topmost().getViewById('twitter').on('loginStatus', (args) => {
        if (args.object.get("value") === 'failed') {
            console.log(args.object.get("message"))
        } else {
            TNSTwitter.getCurrentUser(args.object.get("userID")).then(
                (user) => {
                    console.dump(user)
                }, err => {
                    console.dump(err)
                })
        }

    });
```


Send api request
```ts
import { CustomApiService } from "nativescript-twitter"
const api = new CustomApiService();
    api.makeRequest("https://api.twitter.com/1.1/account/verify_credentials.json", "get")
        .then(
        data => {
            console.log(data)
        }, err => {
            console.log(err.message)
        });
```


### Angular

```ts
import { registerElement } from "nativescript-angular/element-registry";
registerElement("TNSTwitterButton", () => require("nativescript-twitter").TNSTwitterButton);
```

```html
<TNSTwitterButton id="twitter"/>
```