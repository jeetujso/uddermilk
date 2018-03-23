/******************************************************************************
app-local-storage.js

Author: Akhilesh Shukla

Description: Angular2 provider for local storage.  This provides a consistent
interface for local storage in a web browser (during emulation) and native
encrypted storage when on a device.
******************************************************************************/
import { Injectable } from '@angular/core';
//Local Storage provided by the web view
import { Storage } from '@ionic/storage';
//Secure storage provided by native environment
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { Platform } from 'ionic-angular';

@Injectable()
export class AppLocalStorage {
	private storage: Storage;
	private secureStorage: SecureStorage;
	private secureStorageObj: SecureStorageObject;
	private useSecure: boolean = false;
	private initialized: boolean = false;

	constructor(public platform: Platform) {
		//console.log(this.platform);
		//this.useSecure = !this.platform.is('core');
		//hardcode to false for now, the above value keeps changing
		this.useSecure = false;
	}

	public init(name: string): Promise<boolean> {
		this.initialized = true;
		if (this.useSecure) {
			console.log("using native secured storage");
			this.secureStorage = new SecureStorage();
			this.secureStorage.create(name).then((stObj: SecureStorageObject) => {
				this.secureStorageObj = stObj;
				return Promise.resolve(true);
			}).catch((err) => {
				return Promise.reject(err);
			});
		} else {
			console.log("using web view local storage");
			this.storage = new Storage({});
			return Promise.resolve(true);
		}
	}

	public get(key: string): Promise<string> {
		if (this.useSecure) {
			if (!this.initialized) {
				return Promise.reject("Secure storage not initiaized.");
			}
			return this.secureStorageObj.get(key);
		} else {
			return this.storage.get(key);
		}
	}

	public set(key: string, value: string): Promise<boolean> {
		if (this.useSecure) {
			if (!this.initialized) {
				return Promise.reject("Secure storage not initiaized.");
			}
			return this.secureStorageObj.set(key, value);
		} else {
			return this.storage.set(key, value);
		}
	}

	public getObject(key: string): Promise<any> {
		if (this.useSecure) {
			if (!this.initialized) {
				return Promise.reject("Secure storage not initiaized.");
			}
			return this.secureStorageObj.get(key).then(
				function (r) {
					try {
						return JSON.parse(r);
					} catch (e) {
						return undefined;
					}
				}
			).catch(function (e) {
				return undefined;
			});
		} else {
			return this.storage.get(key).then(
				function (r) {
					try {
						return JSON.parse(r);
					} catch (e) {
						return undefined;
					}
				}
			).catch(function (e) {
				return undefined;
			});
		}
	}

	public setObject(key: string, value: any): Promise<boolean> {
		if (this.useSecure) {
			if (!this.initialized) {
				return Promise.reject("Secure storage not initiaized.");
			}
			return this.secureStorageObj.set(key, JSON.stringify(value))
				.then(function (r) {
					return true;
				})
				.catch(function (e) {
					return false;
				});
		} else {
			return this.storage.set(key, JSON.stringify(value)).then(
				function (r) {
					return true;
				}
			).catch(function (e) {
				return false;
			});
		}
	}

	public remove(key: string): Promise<boolean> {
		if (this.useSecure) {
			if (!this.initialized) {
				return Promise.reject("Secure storage not initiaized.");
			}
			return this.secureStorageObj.remove(key).then(
				function (r) {
					return true;
				}
			).catch(function (e) {
				return false;
			});
		} else {
			return this.storage.remove(key).then(
				function (r) {
					return true;
				}
			).catch(function (e) {
				return false;
			});
		}
	}

	public exists(key: string): Promise<boolean> {
		if (this.useSecure) {
			if (!this.initialized) {
				return Promise.reject("Secure storage not initiaized.");
			}
			return this.secureStorageObj.get(key).then(
				function (val) {
					if (val !== null && val !== undefined) {
						return true;
					} else {
						return false;
					}
				}
			).catch(function (e) {
				return false;
			})
		} else {
			return this.storage.get(key).then(
				function (val) {
					if (val !== null && val !== undefined) {
						return true;
					} else {
						return false;
					}
				}
			).catch(function (e) {
				return false;
			})
		}
	}
}
