declare var TWTRTwitter;

export class CustomAppDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];
    applicationDidFinishLaunchingWithOptions(application, launchOptions) {
        TWTRTwitter.sharedInstance().startWithConsumerKeyConsumerSecret("8YwpqLe7sWfbJG5ymDxZNtgN4", "Uwxd1q4UFJp2IjINsUcVYMpmQWy5DR2ZSiE6Y6dji96WpDYOuA");
        return true;
    }
    applicationOpenURLOptions(application, url, options) {
        return TWTRTwitter.sharedInstance().applicationOpenURLOptions(application, url, options);
    }
}
