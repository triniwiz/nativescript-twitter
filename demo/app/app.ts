/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import * as app from 'tns-core-modules/application';

if (app.android) {
    const TNSTwitter = require('nativescript-twitter').TNSTwitter;
    TNSTwitter.init('nMOzsRotT4uil8j2Y1hRmFzG6', 'DPhkK4lZiwC4hcByiczxswBAorwoUgJrCjpxwBIo3JX8BXNcKz');
} else if (app.ios) {
    app.ios.delegate = require('./custom-app-delegate').CustomAppDelegate;
}
app.run({moduleName: 'main-page'});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
