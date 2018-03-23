import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OneProduct } from '../../pages/one-product/one-product';
import { ProductsProvider } from '../../providers/products-provider';
import { Config } from '../../providers/config';

@Component({
    selector: 'products-layout',
    templateUrl: 'products-layout.html',
    providers: [ProductsProvider]
})

export class ProductsLayoutComponent {

    @Input() catId: any;
    @Input() subCat: any;

    animateItems = [];
    animateClass: any;

    constructor(private productsProvider: ProductsProvider, private navCtrl: NavController, private config: Config) {
        this.animateClass = { 'zoom-in': true };
    }

    ngAfterViewInit() {
        this.productsProvider.fetchProducts(this.catId, 'false', this.subCat).subscribe((res) => {
            for (let i = 0; i < res.products.length; i++) {
                setTimeout(() => {
                    this.animateItems.push(res.products[i]);
                }, 200 * i);
            }
        });
    }

    openProduct(product) {
        this.navCtrl.push(OneProduct, { product: product });
    }
}
