/******************************************************************************
app-ui.ts 

Author: Akhilesh Shukla

Description: Reusable UI component.

******************************************************************************/
import { Injectable } from '@angular/core';
import { LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';

@Injectable()
export class AppUi {
    public loading: Loading;
    constructor(public alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    }

    showLoading(Content = "") {
        this.loading = this.loadingCtrl.create({
            content: Content === "" ? "Please wait..." : Content
        });
        this.loading.present();
    }

    showDialog(text: string, title = "", dialogHandler?) {
        setTimeout(() => {
            try {
                this.loading.dismiss().catch((err) => {
                    console.log(err);
                });
            }
            catch (e) {
                console.log('already dismissed');
            }
        });

        if(typeof dialogHandler != 'function') {
            dialogHandler = () => {}
        }

        let alert = this.alertCtrl.create({
            title: title === "" ? "Fail" : title,
            subTitle: text,
            buttons: [{
                text: 'Ok',
                handler: dialogHandler
            }]
        });
        return alert.present();
    }

    dismissLoading() {
        if (this.loading !== undefined) {
            return this.loading.dismiss();
        }
        else {
            console.log('loading undefined');
        }
    }

    /**
       * Show a toast message
       * @param message 
       * @param duration 
       * @param position 
       * @param cssClass 
       * @param showCloseButton 
       * @param closeButtonText 
       * @param dismissOnPageChange 
       * @return Promise <any>
       * @author Akhilesh Shukla
       */
    showToast(message, duration = 3000, position = "bottom", cssClass = "avcUi", showCloseButton = false, closeButtonText = "Close", dismissOnPageChange = false) {
        let toast = this.toastCtrl.create({
            "message": message,
            "duration": duration,
            "position": position,
            "cssClass": cssClass,
            "showCloseButton": showCloseButton,
            "dismissOnPageChange": dismissOnPageChange
        });

        return toast.present();
    }
}
