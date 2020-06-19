import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { MyAccountPage } from '../pages/my-account/my-account';
import { CartPage } from '../pages/cart/cart';
import { Contact } from '../pages/contact/contact';
import { LoginPage } from '../pages/login/login';
import { AppLocalStorage } from '../providers/app-local-storage';
import { AppAuth } from '../providers/app-auth';
import { AppUi } from '../providers/app-ui';
import { StaticPage } from '../pages/static-page/static-page';
import { AppPush } from '../providers/app-push';

@Component({
    templateUrl: 'app.html'
})

export class MyApp {
    rootPage = HomePage;
    home: any;

    @ViewChild(Nav) nav: Nav;

    pages: any[] = [
        { title: 'Home', icon: 'md-home', component: HomePage },
        { title: 'Cart', icon: 'cart', component: CartPage },
        { title: 'My Orders', icon: 'md-basket', component: MyOrdersPage },
        // { title: 'My Wish List', icon: 'paper', component: MyWishlistPage },
        { title: 'My Account', icon: 'md-people', component: MyAccountPage },
        { title: 'Contact Us', icon: 'md-chatboxes', component: Contact },
        { title: 'About Us', icon: 'ios-bulb', component: 5 },
        { title: 'Privacy Policy', icon: 'information-circle', component: 6 },
        { title: 'Terms of Service', icon: 'paper', component: 7 },
        { title: 'FAQs', icon: 'help-circle', component: 10 },
        { title: 'Logout', icon: 'md-contact', component: undefined },
    ];

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: AppLocalStorage,
        private appAuth: AppAuth, private appUi: AppUi, public appPush: AppPush, public events: Events) {

        this.storage.init('uddermilkDB');

        platform.ready().then(() => {
            statusBar.styleDefault();
            statusBar.backgroundColorByHexString('#598c11');

            splashScreen.hide();
            
            this.appAuth.loadStoredUser().then((resp) => {
                this.appUi.showToast(`Welcome ${resp.fname}!`);
                this.appPush.makeInit();
            }, (err) => {
                console.log(err);
                this.appPush.makeInit();
            });

            // Hardware back button action on android
            platform.registerBackButtonAction(() => {
                if (this.nav.canGoBack()){ //Can we go back?
                    this.nav.pop();
                }
                else{
                    this.appUi.alertCtrl.create({
                        title: 'Exit App',
                        message: 'Continue to exit app?',
                        buttons: [
                            {
                                text: 'No',
                                role: 'cancel',
                                handler: () => {
                                    console.log('Cancel clicked');
                                }
                            },
                            {
                                text: 'Yes',
                                handler: () => {
                                    platform.exitApp(); //Exit from app
                                }
                            }
                        ]
                    }).present();
                }
            });

            this.events.subscribe("push:received", (notification) => {
                console.log(notification);
                console.log(JSON.stringify(notification));
                this.appUi.showDialog(notification.message, notification.title);
            });

        });
    }

    login() {
        this.nav.push(LoginPage);
    }

    logout() {
        this.appUi.alertCtrl.create({
            title: 'Confirm Logout',
            message: 'Are you sure you want to logout?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.appUi.showLoading();
                        this.appPush.updateUserForPush('0').then(() => {
                            this.appAuth.logout().then((resp) => {
                                console.log(resp);
                                this.appUi.dismissLoading();
                                this.nav.setRoot(HomePage);
                            }, (err) => {
                                console.log(err);
                                this.appUi.dismissLoading();
                                this.appUi.showDialog('Unexpected error occurred!');
                            })
                        })
                    }
                }
            ]
        }).present();
    }

    openPage(page) {
        if(page.title == 'Logout') {
            this.logout();
        }
        else if (page.title == 'About Us' || page.title == 'Privacy Policy' || page.title == 'Terms of Service' || page.title == 'FAQs') {
            this.nav.setRoot(StaticPage, {id: page.component, title: page.title});
        }
        else {
            this.nav.setRoot(page.component);
        }
    }

    showHideMenuItem(name: string) {
        if (name === 'My Orders' || name === 'My Wish List' || name === 'My Account' || name == 'Logout') {
            return !this.appAuth.isLoggedIn();
        }
        return false;
    }

}