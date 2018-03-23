/******************************************************************************
app-auth.ts

Author: Akhilesh Shukla

Description: Angular2 provider for authentication to web services.
******************************************************************************/
import { Injectable, Inject, forwardRef } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AppLocalStorage } from './app-local-storage';
import { Config } from './config';
import { AppHttp } from './app-http';
import { Cart, LineItem } from './cart';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

export class User {
    userId: string;
    authToken: string;
    email: string;
    fname: string;
    lname: string;
    password: string;
    phone: string;
    sphone: string;

    constructor(userId: string, authToken: string, email: string, fname: string, lname: string, password: string, phone: string, sphone: string) {
        this.userId = userId;
        this.authToken = authToken;
        this.email = email;
        this.fname = fname;
        this.lname = lname;
        this.password = password;
        this.phone = phone;
        this.sphone = sphone;
    }
}

export class AuthenticationResponse {
    success: boolean;
    message: string;
    responseObject: any;

    constructor(success: boolean, message: string, responseObject: any) {
        this.message = message;
        this.responseObject = responseObject;
        this.success = success;
    }
}

@Injectable()
export class AppAuth {

    public currentUser: User;
    public appHttp: AppHttp;
    public countries = [];
    public cart: Cart;
    
    constructor(@Inject(forwardRef(() => AppHttp)) appHttp, public config: Config, public storage: AppLocalStorage,
        private http: Http) {
        this.appHttp = appHttp;
        this.cart = new Cart();
        this.cart.init();
    }

    public verifyOtp(username: string, password: string): Observable<AuthenticationResponse> {
        if (username === undefined || password === undefined) {
            return Observable.throw("Please provide credentials");
        } else {
            return Observable.create(observer => {

                let data = { "email": username, "otp": password };
                let url = `${this.config.uri}verify-otp`;

                this.appHttp.sendRequest('post', url, data, '' , true).subscribe(
                    body => {
                        observer.next(new AuthenticationResponse(true, "", body));
                        observer.complete();
                    },
                    err => {
                        try {
                            let errorObject = err.json();
                            observer.next(new AuthenticationResponse(false, '', errorObject));
                        }
                        catch(e) {
                            console.log("Non-json response found!");
                            observer.error(new AuthenticationResponse(false, 'Unexpected error occurred! Please try again...', err));
                        }

                        observer.complete();
                    }
                );
            });
        }
    }

    public login(username: string, password: string, rememberUsername = false): Observable<AuthenticationResponse> {
        if (username === undefined || password === undefined) {
            return Observable.throw("Please provide credentials");
        } else {
            return Observable.create(observer => {
                if(rememberUsername === true) {
                    // Save username for login form autofill after logout
                    this.storage.set(`usernameAutofill_${this.config.application}`, username).catch((err) => {
                        console.log(err);
                    });
                }
                else {
                    // if rememberUsername is false, remove saved username, if any
                    this.removeLastLoggedInUsername();
                }

                let data = { "email": username, "password": password };
                let url = `${this.config.uriApi}apiUserLogin`;

                this.appHttp.sendRequest('post', url, data, '' , true).subscribe(
                    body => {
                        if(body.status == 'error') {
                            observer.next(new AuthenticationResponse(false, body.msg, body));
                        }
                        else{
                            this.currentUser = new User(body.user.Customer.id, body.token, body.user.Customer.email, body.user.Customer.name, body.user.Customer.lastname , "", body.user.Customer.phone, body.user.Customer.phone2);
                            
                            observer.next(new AuthenticationResponse(true, "", body));
                            observer.complete();

                            this.saveUserContext();
                        }
                    },
                    err => {
                        this.currentUser = undefined;
                        
                        try {
                            let errorObject = err.json();
                            observer.next(new AuthenticationResponse(false, '', errorObject));
                        }
                        catch(e) {
                            console.log("Non-json response found!");
                            observer.error(new AuthenticationResponse(false, 'Unexpected error occurred! Please try again...', err));
                        }

                        observer.complete();
                    }
                );
            });
        }
    }

    private saveUserContext():void {
        this.storage.setObject(`user_${this.config.application}`, this.currentUser).then(
            (resp) => { console.log('save username to localstorage'); },
            (err) => { console.log('error saving username to localstorage'); }
        );
    }

    public register(user: User, addr: any): Observable<AuthenticationResponse> {
        if (user === undefined) {
            return Observable.throw("Please provide user object");
        } else {
            return Observable.create(observer => {
                let url = `${this.config.uriApi}apiSignup`;
                let data = {
                    name: user.fname,
                    lastname: user.lname,
                    signupemail: user.email,
                    passwordsignup: user.password,
                    phone1: user.phone,
                    phone2: user.sphone,
                    street_address: addr.streetAddr,
                    homenumber: addr.street,
                    apartment: addr.apartment,
                    city: addr.city,
                    state: addr.state,
                    zip: addr.zipcode,
                    lat: addr.lat,
                    lng: addr.lng
                }

                this.appHttp.sendRequest('post', url, data, '' , true).subscribe(
                    data => {
                        console.log(data);
                        observer.next(new AuthenticationResponse(true, "", data));
                        observer.complete();
                    },
                    err => {
                        try {
                            let errorObject = err.json();
                            observer.next(new AuthenticationResponse(false, '', errorObject));
                        }
                        catch(e) {
                            console.log("Non-json response found!");
                            observer.error(new AuthenticationResponse(false, 'Unexpected error occurred! Please try again...', err));
                        }

                        observer.complete();
                    }
                );
            });
        }
    }

    public loadStoredUser(): Promise<User> {
        return this.storage.exists(`user_${this.config.application}`).then((exists: boolean) => {
            if (exists) {
                return this.storage.getObject(`user_${this.config.application}`).then((user: User) => {
                    this.currentUser = new User(user.userId, user.authToken, user.email, user.fname, user.lname, user.password, user.phone, user.sphone);
                    return this.currentUser;
                });
            } else {
                return Promise.reject(false);
            }
        })
    }

    public isLoggedIn(): boolean {
        return this.currentUser != undefined;
    }

    public logout(): Promise<boolean> {
        return this.storage.remove(`user_${this.config.application}`).then((resp) => {
            this.currentUser = undefined;
            return true;
        }).catch(function (e) {
            return false;
        });
    }

    public getLastLoggedInUsername(): Promise<string> {
        return this.storage.exists(`usernameAutofill_${this.config.application}`).then((res: boolean) => {
            if (res) {
                return this.storage.get(`usernameAutofill_${this.config.application}`).then((val) => {
                    return Promise.resolve(val);
                }).catch(function (e) {
                    return Promise.reject(e);
                });
            }
            else {
                return Promise.reject('no username saved');
            }
        },
        (err)=>{
            return Promise.reject(err);
        });
    }

    public removeLastLoggedInUsername(): Promise<boolean> {
        return this.storage.exists(`usernameAutofill_${this.config.application}`).then((res: boolean) => {
            if (res) {
                return this.storage.remove(`usernameAutofill_${this.config.application}`);
            }
            else {
                return Promise.reject(false);
            }
        },
        (err)=>{
            return Promise.reject(false);
        });
    }

    public getAddresses(): Observable<AuthenticationResponse> {
        return Observable.create(observer => {
            let url = `${this.config.uri}address`;
            let data = '';

            let response = this.appHttp.sendRequest('get', url, data).subscribe(
                data => {
                    console.log(data);
                    observer.next(new AuthenticationResponse(true, "", data));
                    observer.complete();
                },
                err => {
                    console.log(err);
                    try {
                        let errorObject = err.json();
                        observer.next(new AuthenticationResponse(false, '', errorObject));
                    }
                    catch(e) {
                        console.log("Non-json response found!");
                        observer.error(new AuthenticationResponse(false, 'Unexpected error occurred! Please try again...', err));
                    }

                    observer.complete();
                }
            );
        });
    }

    public updateBillingAddr(first_name='', last_name='', address_line1='', address_line2='', city='', zipcode='',
        state='', country='', phone='', addrType='billing'): Observable<AuthenticationResponse> {
        return Observable.create(observer => {
            let url = `${this.config.uri}${addrType}-address`;
            let data = {
                "first_name": first_name,
                "last_name": last_name,
                "address_line1": address_line1,
                "address_line2": address_line2,
                "city": city,
                "zipcode": zipcode,
                "state": state,
                "country": country,
                "phone": phone
            };

            let response = this.appHttp.sendRequest('post', url, data).subscribe(
                data => {
                    console.log(data);
                    observer.next(new AuthenticationResponse(true, "", data));
                    observer.complete();
                },
                err => {
                    console.log(err);
                    try {
                        let errorObject = err.json();
                        observer.next(new AuthenticationResponse(false, '', errorObject));
                    }
                    catch(e) {
                        console.log("Non-json response found!");
                        observer.error(new AuthenticationResponse(false, 'Unexpected error occurred! Please try again...', err));
                    }

                    observer.complete();
                }
            );
        });
    }

    public changePassword(oldPassword, newPassword): Observable<AuthenticationResponse> {
        return Observable.create(observer => {
            let url = `${this.config.uriApi}changepassword`;
            let data = {
                "password_old": oldPassword,
                "password_new": newPassword,
                "token": this.currentUser.authToken,
                "user_id": this.currentUser.userId
            };

            let response = this.http.post(url, data).map(res => res.json()).subscribe(
                data => {
                    console.log(data);
                    observer.next(new AuthenticationResponse(true, "", data));
                    observer.complete();
                },
                err => {
                    console.log(err);
                    try {
                        let errorObject = err.json();
                        observer.next(new AuthenticationResponse(false, '', errorObject));
                    }
                    catch(e) {
                        console.log("Non-json response found!");
                        observer.error(new AuthenticationResponse(false, 'Unexpected error occurred! Please try again...', err));
                    }

                    observer.complete();
                }
            );
        });
    }

    public updateUser(user: User): Observable<AuthenticationResponse> {
        if (user === undefined) {
            return Observable.throw("Please provide user object");
        } else {
            return Observable.create(observer => {
                let url = `${this.config.uriApi}updateprofile`;
                let data = { 
                    first_name: user.fname,
                    last_name: user.lname,
                    phone1: user.phone,
                    phone2: user.sphone,
                    token: this.currentUser.authToken,
                    user_id: this.currentUser.userId
                };

                let response = this.http.post(url, data).subscribe(
                    data => {
                        observer.next(new AuthenticationResponse(true, "", data));
                        observer.complete();
                        this.currentUser.fname = user.fname;
                        this.currentUser.lname = user.lname;
                        this.currentUser.phone = user.phone;
                        this.currentUser.sphone = user.sphone;
                        this.saveUserContext();
                    },
                    err => {
                        try {
                            let errorObject = err.json();
                            observer.next(new AuthenticationResponse(false, '', errorObject));
                        }
                        catch(e) {
                            console.log("Non-json response found!");
                            observer.error(new AuthenticationResponse(false, 'Unexpected error occurred! Please try again...', err));
                        }

                        observer.complete();
                    }
                );
            });
        }
    }

    public getUserWishlist (): Promise<any> {
        return new Promise((resolve, reject) => {
            this.appHttp.sendRequest('get', `${this.config.uri}my-wishlists`).subscribe(
                (data: any) => {
                    if(data.status == 'ok') {
                        return resolve(data.wishlists);
                    }
                    else {
                        return reject(data.msg);
                    }
                },
                err => {
                    console.log(err);
                    return reject('Failed to fetch wishlists...');
                }
            );
        });
	}

}