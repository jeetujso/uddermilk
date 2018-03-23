/******************************************************************************
config.ts 

Author: Akhilesh Shukla

Description: Configuration file for the application.
******************************************************************************/
import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public application = "UdderMilk";
	public uriApi = "http://uddermilk.com/webservices/";
	public uri = "http://www.topflightinstant.com/app/api/";
	public categoryUri = "http://uddermilk.com/categories_image/";
	public animalUri = "http://uddermilk.com/animals_image/";
	public productUri = "http://uddermilk.com/upload/";
	public productUriAux = "http://www.topflightinstant.com/app/public/assets/products/auxilary-images/";
	public subCatUri = "http://www.topflightinstant.com/app/public/assets/subCategories/";
	public showSearch = false;
	public currency = { name: 'USD', sign: '$'};
	public orderStatus = ['Open', 'Closed', 'Delivered'];

	public noImage = "http://uddermilk.com/img/image_not_found.jpg";

	public googleApiKey = 'AIzaSyDTmxMvkEek86BxtmldhSaJj-iG2TBlGWo';

    constructor() {
    }
}
