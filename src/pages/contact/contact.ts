import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidateEmail } from '../../providers/app-validators';
import { AppAuth } from '../../providers/app-auth';
import { AppUi } from '../../providers/app-ui';
import { Config } from '../../providers/config';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-contact',
    templateUrl: './contact.html'
})
export class Contact {

    private contactForm: any;

    constructor(fb: FormBuilder, public appUi: AppUi, public appAuth: AppAuth, private http: Http, private config: Config) {

        this.contactForm = fb.group({
            name: [this.appAuth.isLoggedIn() ? this.appAuth.currentUser.fname : '', Validators.required],
            email: [this.appAuth.isLoggedIn() ? this.appAuth.currentUser.email : '', [Validators.required, ValidateEmail]],
            // phone: [this.appAuth.isLoggedIn() ? this.appAuth.currentUser.phone : '', Validators.required],
            msg: ['', Validators.required]
        });

    }

    submitQuery() {
        this.appUi.showLoading();
        let formName    = this.contactForm.controls['name'].value;
        let formEmail   = this.contactForm.controls['email'].value;
        // let formPhone   = this.contactForm.controls['phone'].value;
        let formMsg     = this.contactForm.controls['msg'].value;
        console.log(formName, formEmail, formMsg);
        console.log('Contact Us submit action');

        // this.http.post(this.config.uri + 'user-query', {name: formName, email: formEmail, message: formMsg}).map(res => res.json()).subscribe(
        this.http.get(this.config.uriApi + 'contactus?name='+formName+'&email='+formEmail+'&comments='+formMsg).map(res => res.json()).subscribe(
            (res) => {
                console.log(res);
                this.appUi.showDialog('Thank you for contacting us! We will get back to you soon!!', 'Thank You!');
            },
            (err) => {
                console.log(err);
                this.appUi.showDialog('Unexpected error occurred! Please try again...');
            }
        );
    }
}
