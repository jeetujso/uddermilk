import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OneProduct } from '../../pages/one-product/one-product';
import { ProductsProvider } from '../../providers/products-provider';
import { Config } from '../../providers/config';
import { AppUi } from '../../providers/app-ui';

@Component({
    selector: 'page-product-list',
    templateUrl: 'product-list.html',
    providers: [ProductsProvider]
})

export class ProductListPage {

    catId: any;
    catName: string = '';
    animateItems: Array<any> = [];
    animateClass: any = { 'zoom-in': true };
    public hasSubCat: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public config: Config,
        private productsProvider: ProductsProvider, public appUi: AppUi) {
        this.catId = this.navParams.data.category;
        this.catName = this.navParams.data.catTitle;
        this.hasSubCat = this.navParams.data.hasSubcategory;
    }

    ngOnInit() {
        this.appUi.showLoading();
        this.productsProvider.fetchProducts(this.catId).subscribe((res) => {
            for (let i = 0; i < res.products.length; i++) {
                setTimeout(() => {
                    this.animateItems.push(res.products[i]);
                }, 200 * i);
            }
            this.appUi.dismissLoading();
        }, (err) => {
            console.log(err);
            this.appUi.dismissLoading();
        });
    }

    openProduct(product) {
        this.navCtrl.push(OneProduct, { product: product });
    }
}
