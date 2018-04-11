import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController, AlertController } from 'ionic-angular';
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
        private http: Http, private alertCtrl: AlertController) {
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

    promptOrder(oid, pid) {
        this.appUi.alertCtrl.create({
            title: 'Cancel Order',
            message: 'Are you sure you want to cancel this item?',
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
                        this.cancelOrder(oid, pid); //Cancel Order
                    }
                }
            ]
        }).present();
    }

    cancelOrder(oid, pid) {
        console.log('cancel order');
        this.appUi.showLoading();
        let url = this.config.uriApi+'removeCustomerproduct?user_id='+this.appAuth.currentUser.userId;
        url = url + '&token='+this.appAuth.currentUser.authToken+'&id='+oid+'&pid='+pid;

        this.http.request(url).map(res => res.json()).subscribe(
            res => {
                console.log(res);
                this.appUi.dismissLoading().then(() => {
                    this.fetchOrders();
                });
                this.appUi.showDialog(res.msg, 'Cancel Order');
            },
            err=> {
                console.log(err);
                this.appUi.dismissLoading();
                this.appUi.showDialog('Unexpected error occured...', 'Error');
            }
        );
    }

    editOrder(lineitem, ordermaster) {
        console.log('edit order', lineitem);
        // this.updateOrder(lineitem);
        let alert = this.alertCtrl.create({
            title: 'Update Order',
            subTitle: lineitem.packagename,
            message: 'Please enter new product quantity',
            inputs: [
                {
                    name: 'qty',
                    placeholder: 'New Quantity',
                    type: 'number',
                    value: lineitem.quantity
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Update',
                    handler: data => {
                        console.log(data, data.qty);
                        this.updateOrder(ordermaster, lineitem, data.qty);
                    }
                }
            ]
        });
        alert.present();
    }

    updateOrder(ordermaster, lineitem, newQty) {
        console.log(ordermaster, lineitem, newQty);
        this.appUi.showLoading();

        let url = this.config.uriApi + 'editproduct?token='+ this.appAuth.currentUser.authToken;
        url += '&user_id='+this.appAuth.currentUser.userId+'&id='+lineitem.id+'&quantity='+newQty;
        this.http.get(url).map(res => res.json()).subscribe(
            res => {
                console.log(res);
                this.appUi.dismissLoading();
                if(res.status == 'ok') {
                    ordermaster.totalamount = res.grandtotal;
                    lineitem.quantity = newQty;
                    this.appUi.showToast(res.msg);
                }
                else{
                    this.appUi.showToast('Error Occurred! Please try again...');
                }
            },
            err => {
                console.log(err);
                this.appUi.dismissLoading();
                this.appUi.showToast('Unexpected Error Occurred! Please try again...');
            }
        );
    }
}
