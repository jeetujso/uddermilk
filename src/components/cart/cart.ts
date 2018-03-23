import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProductsProvider } from '../../providers/products-provider';
import { OneProduct } from '../../pages/one-product/one-product';

@Component({
  selector: 'cart',
  templateUrl: 'cart.html',
  providers: [ProductsProvider],
    animations: [

        trigger('flyAlternameSlow', [
            state("1", style({
                transform: 'translate3d(0,0,0)'
            })),
            state("2", style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('* => 1', [
                animate('1000ms ease-in', keyframes([
                    style({ transform: 'translate3d(500px,0,0', offset: 0 }),
                    style({ transform: 'translate3d(-10px,0,0)', offset: 0.5 }),
                    style({ transform: 'translate3d(0,0,0)', offset: 1 })
                ]))
            ]),
            transition('* => 2', [
                animate('1000ms ease-in', keyframes([
                    style({ transform: 'translate3d(-1000px,0,0', offset: 0 }),
                    style({ transform: 'translate3d(10px,0,0)', offset: 0.5 }),
                    style({ transform: 'translate3d(0,0,0)', offset: 1 })
                ]))
            ])
        ])

    ]
})
export class CartComponent {

    qty = 1;
    text: string;
    items = [];

    constructor(private productsProvider: ProductsProvider, private navCtrl: NavController) {
        this.text = 'Hello World';
    }

    add(){
        this.qty = this.qty + 1;
    }

    sub(){
        if(this.qty != 1)
            this.qty = this.qty - 1;
    } 

    ngAfterViewInit() {
        let that = this;
        var products = [2,4,9];
        that.productsProvider.filterProducts(products).subscribe(function(res){
            that.items = res;
        })
    }

    openProduct(item) {
        this.navCtrl.push(OneProduct, { item: item});
    }

}