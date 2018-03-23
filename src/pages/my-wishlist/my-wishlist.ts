import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppAuth } from '../../providers/app-auth';
import { AppUi } from '../../providers/app-ui';
import { Config } from '../../providers/config';
import { OneProduct } from '../../pages/one-product/one-product';

@Component({
    selector: 'page-my-wishlist',
    templateUrl: 'my-wishlist.html',
    animations: [
        trigger('flyInTopSlow', [
            state("0", style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('* => 0', [
                animate('500ms ease-in', keyframes([
                    style({ transform: 'translate3d(0,-500px,0)', offset: 0 }),
                    style({ transform: 'translate3d(0,0,0)', offset: 1 })
                ]))
            ])
        ]),

        trigger('flyAlternameSlow', [
            state("1", style({
                transform: 'translate3d(0,0,0)'
            })),
            state("2", style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('* => 1', [
                animate('1000ms ease-in', keyframes([
                    style({ transform: 'translate3d(500px,0,0', offset: 0 }),
                    style({ transform: 'translate3d(-10px,0,0)', offset: 0.5 }),
                    style({ transform: 'translate3d(0,0,0)', offset: 1 })
                ]))
            ]),
            transition('* => 2', [
                animate('1000ms ease-in', keyframes([
                    style({ transform: 'translate3d(-1000px,0,0', offset: 0 }),
                    style({ transform: 'translate3d(10px,0,0)', offset: 0.5 }),
                    style({ transform: 'translate3d(0,0,0)', offset: 1 })
                ]))
            ])
        ])

    ]
})
export class MyWishlistPage {

    private items: Array<any> = [];

    constructor(public navCtrl: NavController, private appAuth: AppAuth, private appUi: AppUi, private config: Config) {
        this.appUi.showLoading();
        this.appAuth.getUserWishlist().then(
            (res) => {
                this.items = res;
                this.appUi.dismissLoading();
            },
            (err) => {
                console.log(err);
                this.appUi.dismissLoading();
            }
        );
    }

    openProduct(pid) {
        this.navCtrl.setRoot(OneProduct, { pid: pid });
    }
}
