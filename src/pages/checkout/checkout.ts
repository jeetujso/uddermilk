import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { AppUi } from '../../providers/app-ui';
import { AppAuth } from '../../providers/app-auth';
import { Config } from '../../providers/config';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-checkout',
    templateUrl: './checkout.html'
})
export class Checkout {

    private recurring: boolean = false;
    private comment: string = '';
    private pick_title: any = '';
    private pickupLocations: Array<any> = [
        {
            "Pickuplocation": {
                "id": "57",
                "title": "Astoria ",
                "address": "Astoria",
            }
        },
        {
            "Pickuplocation": {
                "id": "58",
                "title": "Park Slope / Bay ridge ( wedensday) ",
                "address": "Park slope , bay ridge ",
            }
        },
        {
            "Pickuplocation": {
                "id": "53",
                "title": "Jersy city pick up",
                "address": "Jersy city",
            }
        },
        {
            "Pickuplocation": {
                "id": "55",
                "title": "Prospect heights",
                "address": "Prospect Park",
            }
        },
        {
            "Pickuplocation": {
                "id": "59",
                "title": "Manhattan  Sunday  Pickup  and Delivery  (Upper Westside)",
                "address": "MANHATTAN SUNDAYS PICK UP AND DELIVERY\r\n12-1PM UPPER WESTSIDE RESIDENTS\r\n",
            }
        },
        {
            "Pickuplocation": {
                "id": "64",
                "title": "Melville , long island",
                "address": "Wedensday ",
            }
        },
        {
            "Pickuplocation": {
                "id": "62",
                "title": "Manhattan Tuesday delivery",
                "address": "Manhattan Tuesday Delivery",
            }
        },
        {
            "Pickuplocation": {
                "id": "67",
                "title": "",
                "address": "",
            }
        },
        {
            "Pickuplocation": {
                "id": "30",
                "title": "Williamsburg,  brooklyn",
                "address": "williamsburg",
            }
        }
    ];

    constructor(public appUi: AppUi, private navCtrl: NavController, private appAuth: AppAuth, private config: Config,
        private http: Http) {

        this.appUi.showLoading();
        this.http.get(this.config.uriApi+'pickuplocation').map(res => res.json()).subscribe(
            res => {
                console.log(res);
                this.pickupLocations = res.pickup_location;
                this.appUi.dismissLoading();
            },
            err => {
                console.log(err);
                this.appUi.dismissLoading();
            }
        );
    }

    proceedToPayment() {
        this.appUi.showLoading();
        console.log('Proceed to payment clicked');
        
        if(this.appAuth.isLoggedIn()){
            let data = {
                "cart": this.appAuth.cart,
                "user_id": this.appAuth.currentUser.userId,
                "token": this.appAuth.currentUser.authToken,
                "pick_title": this.pick_title,
                "recurring": this.recurring,
                "comment": this.comment,
            }

            this.appAuth.appHttp.sendRequest('post', this.config.uriApi+'placeorder', data, '', true).subscribe(
                (res) => {
                    console.log(res);
                    if(res.status == 'ok') {
                        this.appUi.dismissLoading();
                        this.appAuth.cart.empty();
                        this.appUi.showDialog('<p>'+res.msg+'</p><p>Your order number is '+res.order_id+'.</p>', 'Order Placed!', () => { this.navCtrl.setRoot(HomePage) });
                    }
                    else {
                        this.appUi.dismissLoading();
                        this.appUi.showDialog('Order failed. Please try again!', 'Error');
                    }
                },
                (err) => {
                    console.log(err);
                    this.appUi.dismissLoading();
                    this.appUi.showDialog('Order failed. Please try again!', 'Error');
                }
            );
        }
        else {
            this.navCtrl.push(LoginPage, {goBack: true});
        }
    }

}
