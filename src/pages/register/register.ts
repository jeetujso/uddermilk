import { Component, Inject, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ValidateEmail, ValidateWhiteSpace, ValidatePassword } from '../../providers/app-validators';
import { LoginPage } from '../login/login';
import { AppAuth, User } from '../../providers/app-auth';
import { AppUi } from '../../providers/app-ui';
import { Http } from '@angular/http';
import { Config } from '../../providers/config';
import { map } from 'rxjs/operators';

declare var google;

@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {

    @ViewChild('map') mapElement: ElementRef;
    
    registerForm: FormGroup;
    addressForm: FormGroup;
    map: any = undefined;
    infowindow: any;
    
    public passwordsMatch: boolean;
    
    private appAuth: AppAuth;
    private newUser: User;
    private step: Number = 1;
    private locData: any = { address: ''};

    constructor(@Inject(forwardRef(() => AppAuth)) appAuth, private builder: FormBuilder, private nav: NavController,
        private appUi: AppUi, private http: Http, private config: Config, private iab: InAppBrowser) {
        this.appAuth = appAuth;

        this.registerForm = builder.group({
            fname: ["", [Validators.required, ValidateWhiteSpace]],
            lname: ["", [Validators.required, ValidateWhiteSpace]],
            email: ["", [Validators.required, ValidateEmail]],
            phone: ['', [Validators.required, ValidateWhiteSpace]],
            sphone: ['', [Validators.required, ValidateWhiteSpace]],
            password: ['', [Validators.required, ValidatePassword]],
            passwordConfirm: ['', Validators.required]
        });

        this.addressForm = builder.group({
            street: ["", [Validators.required, ValidateWhiteSpace]],
            apartment: ["", [Validators.required, ValidateWhiteSpace]],
            address: ["", [Validators.required, ValidateWhiteSpace]],
        });
    }

    ionViewDidLoad() {
        //subscribe to the changes event on the passwords to see of they match
        this.registerForm.controls['password'].valueChanges.subscribe(password => {
            this.passwordsMatch = (password === this.registerForm.value.passwordConfirm);
        });

        this.registerForm.controls['passwordConfirm'].valueChanges.subscribe(passConf => {
            this.passwordsMatch = (passConf === this.registerForm.value.password);
        });
    }

    private step1submit() {
        this.appUi.showLoading();
        // validate input
        let formEmail = this.registerForm.value.email.trim();
        let formPassword = this.registerForm.value.password.trim();
        let fname = this.registerForm.value.fname.trim();
        let lname = this.registerForm.value.lname.trim();
        let phone = this.registerForm.value.phone.trim();
        let sphone = this.registerForm.value.sphone.trim();

        this.newUser = new User(undefined, undefined, formEmail, fname, lname, formPassword, phone, sphone);

        this.step = 2;
        this.appUi.dismissLoading();
    }

    private showOnMap() {
        this.appUi.showLoading();
        this.locData.street = this.addressForm.value.street.trim();
        this.locData.apartment = this.addressForm.value.apartment.trim();
        this.locData.address = this.addressForm.value.address.trim();
        let url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(this.locData.address)+'&key='+this.config.googleApiKey;

        this.http.get(url).pipe(
            map(res => res.json())
        ).subscribe(
            (res: any) => {
                if(res.status == 'OK'){
                    let lat, lng;
                    let bounds = new google.maps.LatLngBounds();
                    this.selectAddr(res.results[0]);

                    for(let result of res.results) {
                        lat = result.geometry.location.lat;
                        lng = result.geometry.location.lng

                        let latLng = new google.maps.LatLng(lat, lng);

                        if(this.map == undefined) {
                            this.map = new google.maps.Map(this.mapElement.nativeElement, {
                                center: latLng,
                                zoom: 15,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            });
                            this.infowindow = new google.maps.InfoWindow();
                        }

                        let marker = new google.maps.Marker({position: latLng, map: this.map});
                        
                        google.maps.event.addListener(marker, 'click', ((marker) => {
                            return () => {
                                this.selectAddr(result, marker);
                            }
                        })(marker));

                        bounds.extend(marker.getPosition());
                        this.map.fitBounds(bounds);
                    }
 
                } else {
                    document.getElementById('map').innerHTML = '<p style="text-align : center; font-style : italic">Unable to locate address </p>';
                }
            },
            (err) => {
                console.log(err);
            }
        );

        this.step = 3;

        this.appUi.dismissLoading();
    }

    private selectAddr(result, marker?) {
        if(marker){
            this.infowindow.setContent(result.formatted_address);
            this.infowindow.open(this.map, marker);
        }

        this.appUi.showToast('Selected address: '+result.formatted_address);

        result.formatted_address.match(/\s*([^,]*),\s*([^,]*),\s*(\w*)\s(\d*),.*/g);
        this.locData.streetAddr = RegExp.$1;
        this.locData.city = RegExp.$2;
        this.locData.state = RegExp.$3;
        this.locData.zipcode = RegExp.$4;
        this.locData.address = result.formatted_address;
        this.locData.lat = result.geometry.location.lat;
        this.locData.lng = result.geometry.location.lng;
    }

    private register() {

        console.log(this.locData, this.newUser);

        this.appAuth.register(this.newUser, this.locData).subscribe(resp => {
            console.log(resp);
            if (resp.success) {
                setTimeout(() => {
                    this.appUi.dismissLoading();
                    this.appUi.showToast(resp.responseObject.msg, 5000);
                    //this.nav.setRoot(LoginPage, { userName: this.newUser.email });
                    this.showAgreement(resp.responseObject.user_id);
                });
            }
            else {
                this.appUi.dismissLoading();
                let sms = '';//resp.responseObject.msg;
                for(let ob in resp.responseObject.msg) {
                    // console.log(ob, resp.responseObject.msg[ob][0]);
                    sms += `<p><span>${ob}</span> : ${resp.responseObject.msg[ob][0]}</p>`;
                }
                this.appUi.showDialog(sms == '' ? resp.responseObject.msg : sms, resp.responseObject.status);
            }
        },
        err => {
            this.appUi.dismissLoading();
            this.appUi.showDialog(err.message);
        });
    }

    private showAgreement(userid: any) {
        let browser = this.iab.create('http://uddermilk.com/customers/agreement/'+userid, '_blank', {location: 'no'});

        browser.on('loadstop').subscribe(
            (res) => {
                console.log(res);
                if(res.url == 'http://uddermilk.com/'){
                    browser.close();
                    this.appUi.showDialog('Thank you for completing the registration process! Your ID will be reviewed and activated by admin.', 'Success!');
                    this.nav.setRoot(LoginPage, { userName: this.newUser.email });
                }
            }, (err) =>{
                console.log(err);
            }
        );
        
        browser.on('exit').subscribe(
            (res) => {
                console.log(res);
                this.http.get('http://uddermilk.com/webservices/checkAgrement?user_id='+userid).pipe(
                    map(r => r.json())
                ).subscribe(
                    (r) => {
                        console.log(r);
                        if(r.agreement != "true"){
                            this.showAgreement(userid);
                        }
                    }, (e) => {
                        console.log(e);
                    }
                );
            }
        );
    }

}