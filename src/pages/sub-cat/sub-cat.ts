import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductsProvider } from '../../providers/products-provider';
import { AppUi } from '../../providers/app-ui';
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
    public hasSubCat: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private productsProvider: ProductsProvider, public appUi: AppUi) {
        this.catId = this.navParams.data.category;
        this.catName = this.navParams.data.catTitle;
        this.hasSubCat = this.navParams.data.hasSubcategories;

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
                if(res.products.length > 0) 
                    this.navCtrl.push(OneProduct, { product: res.products[0], animal: true });
                else 
                    this.appUi.showDialog("No products found for this category!", "Error");
            },
            err => {
                console.log(err);
                this.appUi.dismissLoading();
            }
        );
    }
}
