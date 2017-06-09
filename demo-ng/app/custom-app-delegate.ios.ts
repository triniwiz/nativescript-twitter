import * as utils from "utils/utils";
declare const UIResponder, UIApplicationDelegate, Twitter;
export class CustomAppDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];
    applicationDidFinishLaunchingWithOptions(application, launchOptions) {
        utils.ios.getter(Twitter,Twitter.sharedInstance).startWithConsumerKeyConsumerSecret("nMOzsRotT4uil8j2Y1hRmFzG6", "DPhkK4lZiwC4hcByiczxswBAorwoUgJrCjpxwBIo3JX8BXNcKz");
        return true;
    }
    applicationOpenURLOptions(application, url, options) {
        return utils.ios.getter(Twitter,Twitter.sharedInstance).applicationOpenURLOptions(application, url, options);
    }
}