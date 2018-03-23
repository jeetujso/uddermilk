import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavParams, Platform } from 'ionic-angular';
import { ValidatePassword } from '../../providers/app-validators';
import { AppAuth } from '../../providers/app-auth';
import { AppUi } from '../../providers/app-ui';

@Component({
    selector: 'page-profile',
    templateUrl: './profile.html',
    providers: [AppUi]
})
export class Profile {

    public passwordToggle: boolean = false;
    public passwordsMatch: boolean = false;
    public settingsForm: any;
    public passwordForm: any;
    public forceChangePassword: boolean = false;

    constructor(fb: FormBuilder, public params: NavParams, public appUi: AppUi, public platform: Platform, public appAuth: AppAuth) {
        this.forceChangePassword = <boolean>params.get("ForceChangePassword");

        if (params.data.formCh == 'password') {
            this.passwordToggle = true;
        }

        this.platform.ready().then(() => { 
            this.settingsForm.controls["fname"].setValue(this.appAuth.currentUser.fname);
        });

        if (this.forceChangePassword) {
            this.passwordToggle = true;
        }

        this.settingsForm = fb.group({
            fname: [this.appAuth.currentUser.fname, Validators.required],
            lname: [this.appAuth.currentUser.lname, Validators.required],
            email: [this.appAuth.currentUser.email],
            phone: [this.appAuth.currentUser.phone, Validators.required],
            sphone: [this.appAuth.currentUser.sphone]
        });

        this.passwordForm = fb.group({
            oldPassword: [<boolean>params.get("OldPassword"), Validators.required],
            passwordConfirm: ["", Validators.required],
            newPassword: ["", [Validators.required/* , ValidatePassword */]]
        });


        //subscribe to the changes event on the passwords to see of they match
        (<FormControl>this.passwordForm.controls['newPassword']).valueChanges.subscribe(password => {
            this.passwordsMatch = (password === this.passwordForm.value.passwordConfirm);
        });

        (<FormControl>this.passwordForm.controls['passwordConfirm']).valueChanges.subscribe(passConf => {
            this.passwordsMatch = (passConf === this.passwordForm.value.newPassword);
        });
    }

    changePasswordClick(e) {
        this.passwordToggle = !this.passwordToggle;
    }

    savePasswordClick(e) {
        this.appUi.showLoading();
        this.appAuth.changePassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword).subscribe(
            (res) => {
                this.appUi.dismissLoading();
                if (res.success == true) {
                    this.appUi.showToast(res.responseObject.msg);
                }
                else {
                    this.appUi.showDialog(res.responseObject.msg, res.responseObject.status);
                }
            },
            (err) => {
                this.appUi.dismissLoading();
                this.appUi.showDialog(err.message);
            }
        );
    }

    updateUser() {
        this.appUi.showLoading();

        this.appAuth.currentUser.fname = this.settingsForm.value.fname;
        this.appAuth.currentUser.phone = this.settingsForm.value.phone;

        this.appAuth.updateUser(this.settingsForm.value).subscribe(
            (res) => {
                this.appUi.dismissLoading();
                if (res.success == true) {
                    this.appUi.showToast(res.responseObject.msg);
                }
                else {
                    this.appUi.showDialog(res.responseObject.msg, res.responseObject.status);
                }
            },
            (err) => {
                this.appUi.dismissLoading();
                this.appUi.showDialog(err.message);
            }
        );
    }
}
