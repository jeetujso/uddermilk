import { Component, Inject, forwardRef } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterPage } from '../../pages/register/register';
import { ForgotPassPage } from '../../pages/forgot-pass/forgot-pass';
import { HomePage } from '../../pages/home/home';
import { AppAuth } from '../../providers/app-auth';
import { AppUi } from '../../providers/app-ui';
import { ValidateEmail } from '../../providers/app-validators';
import { AppPush } from '../../providers/app-push';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    loginForm: FormGroup;
    isNewRegistration: boolean;
    appAuth: AppAuth;

    constructor(@Inject(forwardRef(() => AppAuth)) appAuth, private platform: Platform, private builder: FormBuilder, private nav: NavController,
        private appUi: AppUi, private navParams: NavParams, public appPush: AppPush) {
        this.appAuth = appAuth;

        this.loginForm = this.builder.group({
            email: ['', [Validators.required, ValidateEmail]],
            password: ['', Validators.required],
            rememberUsername: [true]
        });

        
        this.platform.ready().then(() => {
            this.appUi.dismissLoading();
            let username = this.navParams.get("userName");
            
            if (typeof username != 'undefined' && username != '') {
                this.loginForm.controls['email'].setValue(username);
                this.isNewRegistration = true;
            }
            else {
                this.isNewRegistration = false;
                this.appAuth.getLastLoggedInUsername().then((res) => {
                    this.loginForm.controls['email'].setValue(res);
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    }

    register(){
        this.nav.push(RegisterPage) //navigate to RegisterPage
    }

    forgotpass(){
        this.nav.push(ForgotPassPage) //navigate to ForgetPassPage
    }

    login(){
        this.appUi.showLoading();
        let email = this.loginForm.controls.email.value;
        let password = this.loginForm.controls.password.value;
        let rememberUser = this.loginForm.controls.rememberUsername.value;

        this.appAuth.login(email, password, rememberUser).subscribe((resp) => {
            this.appUi.dismissLoading();
            if(resp.success === true) {
                this.appUi.showToast('Welcome ' + this.appAuth.currentUser.fname + '!');
                
                this.appPush.updateUserForPush(this.appAuth.currentUser.userId).catch((err)=> {
                    console.log(err);
                }); 
                
                if (this.nav.canGoBack()){ //Can we go back?
                    this.nav.pop();
                }
                else {
                    this.nav.setRoot(HomePage) //navigate to HomePage
                }
            }
            else {
                this.appUi.showDialog(resp.responseObject.msg, resp.responseObject.status);
            }
        }, (err) => {
            //console.log(err);
            this.appUi.dismissLoading();
            this.appUi.showDialog(err.message);
        });
    }

}
