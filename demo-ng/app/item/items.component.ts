import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { TNSTwitter } from "nativescript-twitter";
import { Item } from "./item";
import { ItemService } from "./item.service";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {
    items: Item[];
    @ViewChild('twitter') twitter: ElementRef;
    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.items = this.itemService.getItems();
    }
    ngAfterViewInit() {
        this.twitter.nativeElement.on('loginStatus', (args) => {
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
    }
}
