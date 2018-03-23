import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from './config';

@Injectable()
export class CategoryProvider {
    constructor (private http: Http, private config: Config) {
    }

    getCategories() {
        return this.http.get(this.config.uriApi + 'allCategory').map(res => res.json());
    }

}

