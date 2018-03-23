import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Checkout } from '../checkout/checkout';
import { LoginPage } from '../login/login';
import { Config } from '../../providers/config';
import { AppUi } from '../../providers/app-ui';
import { AppAuth } from '../../providers/app-auth';

@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html',
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
export class CartPage {

    constructor(private navCtrl: NavController, private config: Config, private appUi: AppUi, private appAuth: AppAuth) {
        console.log(this.appAuth.cart);
    }

    checkout() {
        if(this.appAuth.cart.total && this.appAuth.cart.total > 0) {
            if(this.appAuth.isLoggedIn()) {
                this.navCtrl.push(Checkout);
            }
            else {
                this.appUi.showDialog('Kindly login first!', 'Info')
                this.navCtrl.push(LoginPage, {goBack: true});
            }
        }
    }

    keys(obj) : Array<string> {
        return Object.keys(obj);
    }

}