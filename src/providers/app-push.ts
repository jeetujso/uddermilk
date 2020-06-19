/******************************************************************************
app-push.ts 

Author: Akhilesh Shukla
Description: Reusable Push component.
******************************************************************************/
import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Device } from '@ionic-native/device';
import { Config } from './config';
import { AppAuth } from './app-auth';

@Injectable()
export class AppPush {
    public pushObject: PushObject
    private pushFlag: boolean = false;

    constructor(public platform: Platform, public push: Push, public config: Config, public auth: AppAuth,
        public device: Device, public events: Events
    ) { }

    public makeInit() {
        this.platform.ready().then(() => {
            console.log(this.device.uuid);
            this.initPush();
        });
    }

    initPush = () => {
        const options: PushOptions = {
            android: {
                icon: 'pushpic',
                iconColor: '#099EFF'
            },
            ios: {
                "clearBadge": true,
                "alert": true,
                "badge": true,
                "sound": true
            }
        };
        this.pushObject = this.push.init(options);

        this.pushObject.clearAllNotifications();
        this.pushObject.setApplicationIconBadgeNumber(0);

        this.pushObject.on('notification').subscribe((notification: any) => {
            console.log('AvcPush: Received a notification', notification);
            setTimeout(() => {
                this.events.publish("push:received", notification);
            }, 500);
        });

        this.pushObject.on('registration').subscribe((registration: any) => {
            console.log(registration);
            console.log(registration.registrationId);
            console.log(this.pushFlag);
            if(this.pushFlag === false) {
                console.log('executing once');
                this.pushFlag = true;
                this.sendTokenToServer(registration.registrationId);
            }
        });
        
        this.pushObject.on('error').subscribe((error) => {
            console.log('Error with Push plugin' + error);
        });
    }

    private sendTokenToServer = (token: string) => {
        console.log("SEND!!!", this.device.uuid);
        
        let platform = this.platform.is('android') ? 'android' : "iOS";
        let url = this.config.uriApi+"push";
        let auth = this.auth.isLoggedIn();
        let data = {
            "token": "" + token,
            "device_id": this.device.uuid ? this.device.uuid : "",
            "user_id": auth ? this.auth.currentUser.userId : "",
            "platform": "" + platform
        };

        console.log(data);

        this.auth.appHttp.sendRequest("post", url, data, {}, !auth).subscribe(
            (res) => {
                if (res.status == 200) {
                    console.log(res);
                } else {
                    console.log(res);
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    public updateUserForPush = (user: string): Promise<any> => {
        return new Promise((resolve) => {
            if(this.device.uuid){
                let url = this.config.uriApi + "updatePush";
                let data = { "device_id": "" + this.device.uuid, "user_id": user };
                console.log(data);
                
                this.auth.appHttp.sendRequest("POST", url, data).subscribe(
                    (res) => {
                        if (res.status == 200) {
                            console.log(res);
                        } else {
                            console.log(res);
                        }
                        resolve();
                    },
                    (err) => {
                        console.log(err);
                        resolve();
                    }
                );
            }
            else {
                console.log("UUID undefined", this.device.uuid);
                resolve();
            }
        });
    }
}