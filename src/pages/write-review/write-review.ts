import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-write-review',
    templateUrl: 'write-review.html'
})
export class WriteReviewPage {
    item: any;
    rating: any = 0;
    constructor(public navCtrl: NavController, navParams: NavParams) {
        this.item = navParams.get('item');
    }

}