/******************************************************************************
app-validators.ts 

Author: Akhilesh Shukla

Description: Angular2 custom validators for use with forms.

******************************************************************************/
import { FormControl } from '@angular/forms';

export function ValidateIsTrue(c: FormControl) {

	return c.value === true ? null : {
		validateIsTrue: { valid: false }
	};
}

export function ValidateEmail(c: FormControl) {

	let reg = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

	return reg.test(c.value) ? null : {
		validateEmail: { valid: false }
	};
}


export function ValidateNumber(c: FormControl) {

	return !isNaN(Number(c.value)) ? null : {
		validateNumber: { valid: false }
	};
}

export function ValidateWhiteSpace(c: FormControl) {

    return c.value.trim().length > 0 ? null : {
        ValidateWhiteSpace: { valid: false }
    };
}

export function ValidatePassword(c: FormControl) {

	let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*`?&-=|#+;~^></\\(){}\[\]])[A-Za-z\d$@$!%*`?&-=|#+;~^&gt;&lt;/\\(){}\[\]]{8,}/;

	return reg.test(c.value) ? null : { invalidPassword: true };
}