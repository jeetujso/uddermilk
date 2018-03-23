import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Config } from '../../providers/config';
import { AppUi } from '../../providers/app-ui';
import { Http } from '@angular/http';

@Component({
    selector: 'page-static',
    templateUrl: 'static-page.html'
})

export class StaticPage {

    private htmlContent:string = '';
    private title:string = '';
    constructor(public navCtrl: NavController, private config: Config, private appUi: AppUi, navParams: NavParams,
        http: Http) {
        this.appUi.showLoading();
        let pageId = navParams.get('id');
        this.title = navParams.get('title');

        if(pageId) {
            http.get(this.config.uriApi + 'showcontent?id='+pageId).map(res => res.json()).subscribe(
                (res) => {
                    console.log(res);
                    this.htmlContent = res.data.Webcontent.content;
                    this.appUi.dismissLoading();
                },
                (err) => {
                    console.log(err);
                    this.appUi.showDialog('Unexpected error occurred! Please try again...');
                    this.appUi.dismissLoading();
                }
            );
        }
    }

    ngAfterViewInit() {
    }

}
