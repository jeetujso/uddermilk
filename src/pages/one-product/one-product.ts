import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ReviewsRatingsPage } from '../../pages/reviews-ratings/reviews-ratings';
import { Config } from '../../providers/config';
import { AppUi } from '../../providers/app-ui';
import { AppHttp } from '../../providers/app-http';
import { AppAuth } from '../../providers/app-auth';
import { CartPage } from '../../pages/cart/cart';

@Component({
    selector: 'page-one-product',
    templateUrl: 'one-product.html',
    animations: [
        trigger('flyInTopSlow', [
            state("0", style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('* => 0', [
                animate('500ms ease-in', keyframes([
                    style({ transform: 'translate3d(0,-500px,0)', offset: 0 }),
                    style({ transform: 'translate3d(0,0,0)', offset: 1 })
                ]))
            ])
        ])
    ]
})
export class OneProduct {
    image: any;
    item: any;
    qty: number = 1;

    constructor(private appHttp: AppHttp, public nav: NavController, navParams: NavParams, private config: Config, 
        private appUi: AppUi, private appAuth: AppAuth) {
        
        this.item = navParams.get('product');
        //to show bydefault image while opening single product
        this.image = this.item.Product.product_image.length > 0 ? this.config.productUri + this.item.Product.product_image : this.config.noImage;

        for(let pkg of this.item.Package){
            pkg.qty = 1;
        }
    }

    //change the image for particular product
    /* changeImage(image) {
        this.image = this.config.productUriAux + image;
    }

    resetImage() {
        this.image = this.item.Product.product_image.length > 0 ? this.config.productUri + this.item.Product.product_image : this.config.noImage;
    } */

    buyNow() {
        //this.addToCart();
        this.nav.push(CartPage);
    }

    increment(pkg) {
        pkg.qty++;
    }

    decrement(pkg) {
        if (pkg.qty > 1)
        pkg.qty--;
    }

    addToCart(pkg) {
        if(isNaN(pkg.price)) {
            this.appUi.showDialog('Error Adding to cart. Price not valid!');
        }
        else {
            this.appAuth.cart.add(this.item.Product.id, pkg.id, this.item.Product.product_image, pkg.unitname, pkg.price, pkg.qty);
            this.appUi.showToast('Product added to cart!');
        }
    }

}