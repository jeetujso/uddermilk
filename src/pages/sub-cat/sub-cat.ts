import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductsProvider } from '../../providers/products-provider';
import { ProductListPage } from '../../pages/product-list/product-list';
import { AppUi } from '../../providers/app-ui';
import { Config } from '../../providers/config';
import { OneProduct } from '../one-product/one-product';

@Component({
    selector: 'page-sub-cat',
    templateUrl: 'sub-cat.html',
    providers: [ProductsProvider]
})

export class SubCatPage {

    catId: any;
    catName = '';
    subCats:Array<any> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private productsProvider: ProductsProvider, public appUi: AppUi, private config: Config) {
        this.catId = this.navParams.data.category;
        this.catName = this.navParams.data.catTitle;

        this.initSubCat();
    }

    initSubCat = () => {
        this.appUi.showLoading();
        this.productsProvider.fetchAnimalCats(this.catId).subscribe((res) => {
            console.log(res);
            this.subCats = res.animal_produce;
            this.appUi.dismissLoading();
        }, (err) => {
            console.log(err);
            this.appUi.dismissLoading();
        });
    }

    openProduct = (item) => {
        this.appUi.showLoading();
        this.productsProvider.fetchProducts(item.id, true).subscribe(
            (res) => {
                console.log(res.products);
                this.appUi.dismissLoading();
                this.navCtrl.push(OneProduct, { product: res.products[0], animal: true });
            },
            err => {
                console.log(err);
                this.appUi.dismissLoading();
            }
        );
    }
}
