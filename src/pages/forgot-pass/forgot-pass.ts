import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateEmail } from '../../providers/app-validators';
import { AppUi } from '../../providers/app-ui';
import { Config } from '../../providers/config';

@Component({
    selector: 'page-forgot-pass',
    templateUrl: 'forgot-pass.html'
})

export class ForgotPassPage {
    loginForm: FormGroup;

    constructor(private builder: FormBuilder, private nav: NavController, public appUi: AppUi,
        private config: Config, private http: Http) {
        
        this.loginForm = this.builder.group({
            email: ['', [Validators.required, ValidateEmail]],
        });
    }

    resetPassword() {
        this.appUi.showLoading();

        let url = this.config.uriApi + 'forgotpassword?email='+ this.loginForm.controls['email'].value;

        this.http.get(url).map(res => res.json()).subscribe(
            res => {
                console.log(res);
                this.appUi.dismissLoading();
                if(res.status == 'ok') {
                    this.appUi.showDialog(res.msg, 'Password Reset');
                    if(this.nav.canGoBack()) {
                        this.nav.pop();
                    }
                }
                else {
                    this.appUi.showDialog(res.msg);
                }
            },
            err => {
                console.log(err);
                this.appUi.dismissLoading();
                this.appUi.showDialog('Unexpected error occured...');
            }
        );
    }

}