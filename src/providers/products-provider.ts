import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from './config';

@Injectable()
export class ProductsProvider {

  constructor(public http: Http, private config: Config) {}

    fetchProducts(catId, animal=false) {
        // http://uddermilk.com/webservices/productdetails?cat_id=3
        let url = `${this.config.uriApi}productdetails?cat_id=${catId}`;
        
        if(animal===true) {
            url += '&param=animal';
        }
        
        return this.http.get(url).map(res => res.json());
    }

    fetchAnimalCats(animalId) {
        // http://uddermilk.com/webservices/allAnimals?animal_id=16
        return this.http.get(`${this.config.uriApi}allAnimals?animal_id=${animalId}`).map(res => res.json());
    }

    getFeatured(limit = 5) {
        return this.http.get(`${this.config.uri}featured-products?limit=${limit}`).map((res) => res.json());
    }

}
