import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { ItemService } from "./item/item.service";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";



import * as app from 'application';
import * as utils from "utils/utils";
if (app.android) {
    const TNSTwitter = require("nativescript-twitter").TNSTwitter;
    TNSTwitter.init("nMOzsRotT4uil8j2Y1hRmFzG6", "DPhkK4lZiwC4hcByiczxswBAorwoUgJrCjpxwBIo3JX8BXNcKz");
} else if (app.ios) {
    app.ios.delegate = require('./custom-app-delegate').CustomAppDelegate;
}

import { registerElement } from "nativescript-angular/element-registry";
registerElement("TNSTwitterButton", () => require("nativescript-twitter").TNSTwitterButton);

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        ItemDetailComponent
    ],
    providers: [
        ItemService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
