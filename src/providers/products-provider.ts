import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from './config';

@Injectable()
export class ProductsProvider {

  constructor(public http: Http, private config: Config) {}

    filterProducts(products){
        return this.http.get('assets/data/products.json')
        .map(x => x.json().filter(c => (products.filter(id => id == c.id).length > 0)))
    }

    getCategory(category) {
        return this.http.get('assets/data//products.json')
        .map(x => x.json().filter(c => c.category == category))
    }

    fetchProducts(catId, subCat, fromSubCat) {
        if(fromSubCat) {
            return this.http.get(`${this.config.uri}subcat-products?sub_cat_id=${catId}`).map(res => res.json());
        }
        else {
            // http://uddermilk.com/webservices/productdetails?cat_id=3
            return this.http.get(`${this.config.uriApi}productdetails?cat_id=${catId}`).map(res => res.json());
        }
    }

    getFeatured(limit = 5) {
        return this.http.get(`${this.config.uri}featured-products?limit=${limit}`).map((res) => res.json());
    }

}
