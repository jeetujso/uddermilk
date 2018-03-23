import { Component, Input } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Config } from '../../providers/config';
/*import { ProductListPage } from '../../pages/product-list/product-list';
import { SubCategoryPage } from '../../pages/sub-category/sub-category';*/

@Component({
  selector: 'category-tile',
  templateUrl: 'category-tile.html'
})
export class CategoryTileComponent {

  @Input() data: any;

  private animateItems = [];
  private animateClass: { 'zoom-in': true };

  constructor(public navCtrl: NavController, private config: Config, private platform: Platform) {
    this.platform.ready().then(this.initData);
  }

  initData = () => {
    console.log(this.data);
    let len = this.data.length;
    for (let i = 0; i < len; i++) {
      setTimeout(() => {
        this.animateItems.push(this.data[i]);
      }, 0 * i);
    }
  }

  openCategory(category) {
    if(category.hasSub > 0) {
      console.log('go to sub cat page');
      //this.navCtrl.push(SubCategoryPage, { category: category.id });
    }
    else {
      //this.navCtrl.push(ProductListPage, { category: category.name });
    }
  }

}
