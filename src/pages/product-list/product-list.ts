import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-product-list',
    templateUrl: 'product-list.html'
})

export class ProductListPage {

    catId: any;
    catName = '';
    subCat:any;
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.catId = this.navParams.data.category;
        this.catName = this.navParams.data.catTitle;
        this.subCat = this.navParams.data.subCat;
    }

}
