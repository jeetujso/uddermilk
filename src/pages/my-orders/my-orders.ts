import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController } from 'ionic-angular';
import { AppAuth } from '../../providers/app-auth';
import { AppUi } from '../../providers/app-ui';
import { Config } from '../../providers/config';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-my-orders',
    templateUrl: 'my-orders.html',

    animations: [
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
export class MyOrdersPage {
    item: any;

    constructor(public navCtrl: NavController, private appAuth: AppAuth, private config: Config, private appUi: AppUi,
        private http: Http) {
        this.fetchOrders();
    }

    fetchOrders() {
        this.appUi.showLoading();
        let url = this.config.uriApi+'myorder?token=' + this.appAuth.currentUser.authToken + '&user_id='+ this.appAuth.currentUser.userId;
        this.http.get(url).map(res => res.json()).subscribe(
            (res) => {
                console.log(res);
                if(res.status == 'ok') {
                    this.appUi.dismissLoading();
                    this.item = res.data;
                }
                else {
                    this.appUi.dismissLoading();
                    this.appUi.showDialog('Failed loading orders.. Please try again!', 'Error');
                }
            },
            (err) => {
                console.log(err);
                this.appUi.dismissLoading();
                this.appUi.showDialog('Unexpected error occured...', 'Error');
            }
        );
    }

    promptOrder(oid) {
        this.appUi.alertCtrl.create({
            title: 'Cancel Order',
            message: 'Are you sure you want to cancel this order?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.cancelOrder(oid); //Cancel Order
                    }
                }
            ]
        }).present();
    }

    cancelOrder(oid) {
        console.log('cancel order');
        this.appUi.showLoading();

        this.appAuth.appHttp.sendRequest('post', this.config.uri+'cancel-order', { order_id: oid }).subscribe(
            (res) => {
                console.log(res);
                if(res.status == 'ok') {
                    this.appUi.dismissLoading().then(() => {
                        this.fetchOrders();
                    });
                    this.appUi.showDialog(res.msg, 'Cancel Order');
                }
                else {
                    this.appUi.dismissLoading();
                    this.appUi.showDialog(res.msg, 'Error');
                }
            },
            (err) => {
                console.log(err);
                this.appUi.dismissLoading();
                this.appUi.showDialog('Unexpected error occured...', 'Error');
            }
        );
    }
}
