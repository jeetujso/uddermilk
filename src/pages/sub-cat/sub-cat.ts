import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductsProvider } from '../../providers/products-provider';
import { ProductListPage } from '../../pages/product-list/product-list';
import { AppUi } from '../../providers/app-ui';
import { Config } from '../../providers/config';

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
        this.productsProvider.fetchProducts(this.catId, true, false).subscribe((res) => {
            this.subCats = res;
            this.appUi.dismissLoading();
        }, (err) => {
            console.log(err);
            this.appUi.dismissLoading();
        });
    }

    listProducts = (item) => {
        this.navCtrl.push(ProductListPage, { category: item.id, catTitle: item.sub_category_name, subCat: true });
    }
}
