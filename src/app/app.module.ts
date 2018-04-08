import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { ProductListPage } from '../pages/product-list/product-list';
import { OneProduct } from '../pages/one-product/one-product';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { MyWishlistPage } from '../pages/my-wishlist/my-wishlist';
import { MyAccountPage } from '../pages/my-account/my-account';
import { CartPage } from '../pages/cart/cart';
import { Contact } from '../pages/contact/contact';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgotPassPage } from '../pages/forgot-pass/forgot-pass';
import { Profile } from '../pages/profile/profile';
import { Addresses } from '../pages/addresses/addresses';
import { Checkout } from '../pages/checkout/checkout';
import { SubCatPage } from '../pages/sub-cat/sub-cat';

import { AppUi } from '../providers/app-ui';
import { AppLocalStorage } from '../providers/app-local-storage';
import { AppHttp } from '../providers/app-http';
import { AppAuth } from '../providers/app-auth';
import { Config } from '../providers/config';

//Components
import { CarouselComponent } from '../components/carousel/carousel';
// import { CartComponent } from '../components/cart/cart';
import { CategoryTileComponent } from '../components/category-tile/category-tile';

import { StaticPage } from '../pages/static-page/static-page';



let pages = [
    MyApp,
    HomePage,
    ProductListPage,
    OneProduct,
    MyOrdersPage,
    MyWishlistPage,
    MyAccountPage,
    CartPage,
    Contact,
    LoginPage,
    RegisterPage,
    ForgotPassPage,
    Profile,
    Addresses,
    Checkout,
    SubCatPage,
    StaticPage
];

export function declarations() {
  return [pages,CarouselComponent,CategoryTileComponent];
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    // Keep this to enable Ionic's runtime error handling during development
    StatusBar,SplashScreen,AppUi,InAppBrowser,Config,AppLocalStorage,AppHttp,AppAuth,{ provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicModule.forRoot(MyApp),BrowserModule,HttpModule,BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
