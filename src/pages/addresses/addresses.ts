import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavParams, Platform } from 'ionic-angular';
import { ValidatePassword } from '../../providers/app-validators';
import { AppAuth } from '../../providers/app-auth';
import { AppUi } from '../../providers/app-ui';

@Component({
    selector: 'page-addresses',
    templateUrl: './addresses.html'
})
export class Addresses {

    private shippingForm: any;
    private billingForm: any;

    constructor(fb: FormBuilder, public params: NavParams, public appUi: AppUi, public platform: Platform, public appAuth: AppAuth) {
        
        this.shippingForm = fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            line1: ['', Validators.required],
            line2: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            country: [this.appAuth.countries[0].id],
            zipcode: ['', Validators.required],
            phone: ['', Validators.required]
        });

        this.billingForm = fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            line1: ['', Validators.required],
            line2: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            country: [this.appAuth.countries[0].id],
            zipcode: ['', Validators.required],
            phone: ['', Validators.required]
        });

        this.appAuth.getAddresses().subscribe(
            res => {
                this.appUi.dismissLoading();
                if(res.success === true) {
                    this.billingForm.controls['firstName'].setValue(res.responseObject.billingAddress.first_name);
                    this.billingForm.controls['lastName'].setValue(res.responseObject.billingAddress.last_name);
                    this.billingForm.controls['line1'].setValue(res.responseObject.billingAddress.address_line1);
                    this.billingForm.controls['line2'].setValue(res.responseObject.billingAddress.address_line2);
                    this.billingForm.controls['city'].setValue(res.responseObject.billingAddress.city);
                    this.billingForm.controls['state'].setValue(res.responseObject.billingAddress.state);
                    this.billingForm.controls['country'].setValue(res.responseObject.billingAddress.country);
                    this.billingForm.controls['zipcode'].setValue(res.responseObject.billingAddress.zipcode);
                    this.billingForm.controls['phone'].setValue(res.responseObject.billingAddress.phone);

                    this.shippingForm.controls['firstName'].setValue(res.responseObject.shippingAddress.first_name);
                    this.shippingForm.controls['lastName'].setValue(res.responseObject.shippingAddress.last_name);
                    this.shippingForm.controls['line1'].setValue(res.responseObject.shippingAddress.address_line1);
                    this.shippingForm.controls['line2'].setValue(res.responseObject.shippingAddress.address_line2);
                    this.shippingForm.controls['city'].setValue(res.responseObject.shippingAddress.city);
                    this.shippingForm.controls['state'].setValue(res.responseObject.shippingAddress.state);
                    this.shippingForm.controls['country'].setValue(res.responseObject.shippingAddress.country);
                    this.shippingForm.controls['zipcode'].setValue(res.responseObject.shippingAddress.zipcode);
                    this.shippingForm.controls['phone'].setValue(res.responseObject.shippingAddress.phone);
                    
                }
                else {
                    if(res.responseObject.msg == 'no address'){
                        this.appUi.showToast('No address saved yet...');
                    }
                    else {
                        this.appUi.showDialog(res.responseObject.msg, res.responseObject.status);
                    }
                }
            },
            err => {
                this.appUi.dismissLoading();
                this.appUi.showDialog('Error fetching your address! Please try again!');
            }
        );
    }

    saveAddr(addrType) {
        this.appUi.showLoading();

        let firstName, lastName, line1, line2, city, state, country, zipcode, phone;

        if(addrType == 'billing') {
            firstName = this.billingForm.controls['firstName'].value;
            lastName = this.billingForm.controls['lastName'].value;
            line1 = this.billingForm.controls['line1'].value;
            line2 = this.billingForm.controls['line2'].value;
            city = this.billingForm.controls['city'].value;
            state = this.billingForm.controls['state'].value;
            country = this.billingForm.controls['country'].value;
            zipcode = this.billingForm.controls['zipcode'].value;
            phone = this.billingForm.controls['phone'].value;
        }
        else {
            firstName = this.shippingForm.controls['firstName'].value;
            lastName = this.shippingForm.controls['lastName'].value;
            line1 = this.shippingForm.controls['line1'].value;
            line2 = this.shippingForm.controls['line2'].value;
            city = this.shippingForm.controls['city'].value;
            state = this.shippingForm.controls['state'].value;
            country = this.shippingForm.controls['country'].value;
            zipcode = this.shippingForm.controls['zipcode'].value;
            phone = this.shippingForm.controls['phone'].value;
        }

        this.appAuth.updateBillingAddr(firstName, lastName, line1, line2, city, zipcode, state, country, phone, addrType).subscribe(
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
