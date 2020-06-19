/******************************************************************************
cart.ts

Author: Akhilesh Shukla

Description: Angular2 provider for cart maintenance.
******************************************************************************/
import { Injectable } from '@angular/core';

export class LineItem {
    pid: string|number;
    pkgId: string|number;
    image: string;
    name: string;
    itemPrice: number;
    qty: number;
    // price: Object;

    constructor(pid, pkgId, image, name, itemPrice, qty) {
        this.pid = pid;
        this.pkgId = pkgId;
        this.image = image;
        this.itemPrice = itemPrice;
        this.qty = qty;
        this.name = name;
        // this.price = {};
    }
}

@Injectable()
export class Cart {
    total: number;
    lineItems = {};

    constructor() {
        this.total = 0.00;
        this.lineItems = {};
    }

    init() {
        console.log('initializing');
        let cart = localStorage.getItem('cart');
        try {
            let ob = JSON.parse(cart);
            if(ob.total) this.total = ob.total;
            if(ob.lineItems) this.lineItems = ob.lineItems;
        }
        catch(e) {
            console.log(e);
            this.total = 0.00;
            this.lineItems = {};
        }
    }

    add(pid, pkgId, image, name, itemPrice, qty) {
        if(this.lineItems['p-'+pid+'-'+pkgId]) {
            this.lineItems['p-'+pid+'-'+pkgId].qty += qty;
            this.updatePrice(pid, pkgId, itemPrice, qty);
        }
        else {
            this.lineItems['p-'+pid+'-'+pkgId] = new LineItem(pid, pkgId, image, name, itemPrice, qty);
            // this.lineItems.length++;
            this.updatePrice(pid, pkgId, itemPrice, qty);
        }
        console.log(this.lineItems, this.total);
    }

    updatePrice(pid, pkgId, itemPrice, qty) {
        this.lineItems['p-'+pid+'-'+pkgId].price = itemPrice * this.lineItems['p-'+pid+'-'+pkgId].qty;
        this.total += itemPrice * qty;
        console.log(this.lineItems, this.total);
        this.saveCart();
    }

    increment(pid, pkgId) {
        console.log('ncre');
        this.lineItems['p-'+pid+'-'+pkgId].qty++;
        this.updatePrice(pid, pkgId, this.lineItems['p-'+pid+'-'+pkgId].itemPrice, 1);
    }

    decrement(pid, pkgId) {
        console.log('dcree');
        if(this.lineItems['p-'+pid+'-'+pkgId].qty == 1) {
            this.remove(pid, pkgId);
        }
        else if(this.lineItems['p-'+pid+'-'+pkgId].qty > 1) {
            this.lineItems['p-'+pid+'-'+pkgId].qty--;
            this.updatePrice(pid, pkgId, this.lineItems['p-'+pid+'-'+pkgId].itemPrice, -1);
        }
    }

    remove(pid, pkgId) {
        if(this.lineItems['p-'+pid+'-'+pkgId]) {
            this.updatePrice(pid, pkgId, this.lineItems['p-'+pid+'-'+pkgId].itemPrice, (-1 * this.lineItems['p-'+pid+'-'+pkgId].qty));
            delete this.lineItems['p-'+pid+'-'+pkgId];
            // this.lineItems.length--;
        }
    }

    empty() {
        this.lineItems = {};
        this.total = 0;
        localStorage.removeItem('cart');
        let x = localStorage.getItem('cart');
        console.log(x);
    }

    private saveCart(){
        let cart = {"lineItems": this.lineItems,"total": this.total};
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}