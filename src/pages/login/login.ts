import { Component, Pipe, PipeTransform, Inject, forwardRef } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterPage } from '../../pages/register/register';
import { ForgotPassPage } from '../../pages/forgot-pass/forgot-pass';
import { HomePage } from '../../pages/home/home';
import { AppAuth } from '../../providers/app-auth';
import { AppUi } from '../../providers/app-ui';
import { ValidateEmail } from '../../providers/app-validators';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    loginForm: FormGroup;
    isNewRegistration: boolean;
    appAuth: AppAuth;
    formState: boolean = true;

    constructor(@Inject(forwardRef(() => AppAuth)) appAuth, private platform: Platform, private builder: FormBuilder, private nav: NavController,
        private appUi: AppUi, private navParams:NavParams) {
        this.appAuth = appAuth;

        this.loginForm = builder.group({
            email: ['', [Validators.required, ValidateEmail]],
            password: ['', Validators.required],
            rememberUsername: [true]
        });

        var username = navParams.get("userName");
        this.platform.ready().then(() => {
            setTimeout(() => { this.appUi.dismissLoading(); console.log('here') }, 5000);
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

        //console.log(email, password, rememberUser);

        this.appAuth.login(email, password, rememberUser).subscribe((resp) => {
            //console.log(resp);
            this.appUi.dismissLoading();
            if(resp.success === true) {
                this.appUi.showToast('Welcome ' + this.appAuth.currentUser.fname + '!');
                if (this.nav.canGoBack()){ //Can we go back? // if(this.nav.data.goBack)
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

    changeFormState() {
        this.formState = !this.formState;
    }

    /*verifyOtp() {
        console.log('verify account');

        this.appUi.showLoading();
        let email = this.loginForm.controls.email.value;
        let otp = this.loginForm.controls.password.value;

        //console.log(email, password, rememberUser);

        this.appAuth.verifyOtp(email, otp).subscribe((resp) => {
            //console.log(resp);
            this.appUi.dismissLoading();
            if(resp.success === true) {
                this.appUi.showDialog('Account verified successfully! Please login...', 'Verification Complete');
                this.formState = !this.formState;
            }
            else {
                this.appUi.showDialog(resp.responseObject.msg, resp.responseObject.status);
            }
        }, (err) => {
            //console.log(err);
            this.appUi.dismissLoading();
            this.appUi.showDialog(err.message);
        });
    }*/

}
