import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, Platform, MenuController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { AppUi } from '../../providers/app-ui';
import { Profile } from '../profile/profile';
import { Addresses } from '../addresses/addresses';
import { Http } from '@angular/http';
import { Config } from '../../providers/config';
import { AppAuth } from '../../providers/app-auth';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-my-account',
    templateUrl: 'my-account.html'
})
export class MyAccountPage {

    constructor(private nav: NavController, private appUi: AppUi, private http: Http, private config: Config,
        private appAuth: AppAuth) {
    }

    private gotoPage = (page) => {
        this.nav.push(Profile, { formCh: page });
    }

    private deactivateAccount = () => {
        let alert = this.appUi.alertCtrl.create({
            title: 'Deactivate Account',
            message: 'Are you sure you want to delete your account? This action cannot be undone!',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'OK',
                    handler: () => {
                        let url = this.config.uriApi+'/delete_account?token='+this.appAuth.currentUser.authToken+'&user_id='+this.appAuth.currentUser.userId;
                        this.http.get(url).map(res => res.json()).subscribe(
                            res => {
                                console.log(res);
                                this.appUi.showDialog('Account Deactivated', 'Success');
                                this.nav.setRoot(LoginPage);
                                this.appAuth.logout();
                            },
                            err => {
                                console.log(err);
                            }
                        );
                    }
                }
            ]
        });
        alert.present();
    }

    private manageAddresses = () => {
        console.log('manage address clicked');
        this.appUi.showLoading();
        this.nav.push(Addresses);
    }

}
