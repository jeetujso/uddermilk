import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CartPage } from '../../pages/cart/cart';
import { ProductListPage } from '../../pages/product-list/product-list';
import { SubCatPage } from '../../pages/sub-cat/sub-cat';
import { OneProduct } from '../../pages/one-product/one-product';
import { CategoryProvider } from '../../providers/category-provider';
import { ProductsProvider } from '../../providers/products-provider';
import { Config } from '../../providers/config';
import { AppUi } from '../../providers/app-ui';

@Component({
    selector: 'page-cat',
    templateUrl: 'cat.html',
    providers: [CategoryProvider, ProductsProvider]
})

export class CatPage {

    public categories:Array<any> = [];
    public featured:Array<any> = [];
    private animals:Array<any> = [];
    private animateItems = [];
    private animateClass: { 'zoom-in': true };
    private selectedTab = 'category';
    catId: any;
    catName: string = '';
    public hasSubCat: any;

    constructor(public navCtrl: NavController, private categoryProvider: CategoryProvider, 
        private productsProvider: ProductsProvider, private config: Config, private appUi: AppUi,
        public navParams: NavParams) {
        this.catId = this.navParams.data.category;
        this.catName = this.navParams.data.catTitle;
        this.hasSubCat = this.navParams.data.hasSubcategory;
    }

    ngOnInit() {
        this.appUi.showLoading();
        this.productsProvider.fetchSubCat(this.catId).subscribe((res)=> {
            this.categories = res.categories;
            let len = this.categories.length;
            for (let i = 0; i < len; i++) {
                setTimeout(() => {
                    this.animateItems.push(this.categories[i]);
                }, 0 * i);
            }
            this.appUi.dismissLoading();
        }, (err) => {
            console.log(err);
            this.appUi.dismissLoading();
        });
    }

    openCategory(category) {
        if(this.selectedTab == 'animal') {
            console.log('go to sub cat page');
            // Animal
            this.navCtrl.push(SubCatPage, {
                category: category.Animal.id,
                catTitle: category.Animal.animalname
            });
        }
        else {
            if(category.Category.hasSubcategories == 0 || category.Category.hasSubcategories == "0") {
                this.navCtrl.push(ProductListPage, { 
                    category: category.Category.id,
                    catTitle: category.Category.categoryname,
                    hasSubcategory: category.Category.hasSubcategories
                });
            }
            else {
                this.navCtrl.push(CatPage, { 
                    category: category.Category.id,
                    catTitle: category.Category.categoryname,
                    hasSubcategory: category.Category.hasSubcategories
                });
            }
        }
    }
}
