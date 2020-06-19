/******************************************************************************
config.ts 

Author: Akhilesh Shukla

Description: Configuration file for the application.
******************************************************************************/
import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public application = "UdderMilk";
	public uriApi = "https://uddermilk.com/webservices/";
	public categoryUri = "https://uddermilk.com/categories_image/";
	public animalUri = "https://uddermilk.com/animals_image/";
	public productUri = "https://uddermilk.com/upload/";
	public showSearch = false;
	public currency = { name: 'USD', sign: '$'};
	public orderStatus = ['', 'Open', 'Closed', 'Delivered'];

	public noImage = "https://uddermilk.com/img/image_not_found.jpg";

	public googleApiKey = 'AIzaSyDTmxMvkEek86BxtmldhSaJj-iG2TBlGWo';

    constructor() {
    }
}
