/******************************************************************************
app-http.ts

Author: Akhilesh Shukla

Description: This library provides HTTP Ajax helper functions.
******************************************************************************/
import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Platform, App  } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { Config } from './config';
import { AppAuth } from './app-auth';
import { LoginPage } from '../pages/login/login';

@Injectable()
export class AppHttp {

    public appAuth: AppAuth;
    private handler = "users/refresh";

    constructor(public injector: Injector, public platform: Platform, public config: Config, public http: Http, private app: App) {
        this.platform.ready().then(() => {
            this.appAuth = injector.get(AppAuth)
        });
    }


    /*
        method - GET, PUT, POST etc.
        headers - Object containing any headers to be sent
        url - Full url to acccess
        data - payload to send (if not a string, it is coverted to JSON)
        returns a {Observable}
    */
    public sendRequest(method: string, url: string, data: any = "", headers?: any, anonymous: boolean = false): Observable<any> {
        var currentObj = this;

        return new Observable(observer => {

            method = method.toUpperCase();
            headers = headers || {};

            if (typeof data === "string") {
                data = data || "";
            }
            else {
                data = JSON.stringify(data);
            }

            // Setup Request
            let options = new RequestOptions({
                method: method,
                headers: new Headers(),
                body: data,
            });

            // Add any requested headers
            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    options.headers.append(key, headers[key]);
                }
            }

            // Add our headers (Content & (optional Bearer token))
            options.headers.append('Content-Type', 'application/json');
            if (!anonymous) {
                options.headers.append('Authorization', `Bearer ${currentObj.appAuth.currentUser.authToken}`);
            }

            // Make the Request
            this.http.request(url, options).subscribe(
                body => {
                    if (body.status >= 200 && body.status < 300) {
                        observer.next(body.json());
                        observer.complete();
                    }
                    else if (body.status == 401) {
                        currentObj.app.getActiveNav().push(LoginPage);
                        observer.complete();
                    }
                    else {
                        observer.error(body);
                    }
                },
                err=> {
                    if (err.status == 401) {
                        currentObj.app.getActiveNav().push(LoginPage);
                        observer.complete();
                    }
                    else {
                        observer.error(err);
                    }
                }
            );
        });
    }

}