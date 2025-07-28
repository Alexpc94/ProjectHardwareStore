import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
	static maxFileSizeValidator(maxSizeMB: number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const file = control.value;
			if (!file) return null;
			if (!(file instanceof File)) return { maxSizeExceeded: { actualSize: 0, maxSize: maxSizeMB } };
			const maxSizeBytes = maxSizeMB * 1024 * 1024;
			if (file.size > maxSizeBytes) {
				return {
					maxSizeExceeded: { maxSize: maxSizeMB },
				};
			}
			return null;
		};
	}

	static onlyImageFilesValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const file = control.value;
			if (!file) return null;
			if (!(file instanceof File)) return { invalidType: true };
			if (!file.type.startsWith('image/')) {
				return { invalidType: true };
			}
			return null;
		};
	}

	static validAgeDate(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const startDate = new Date(control.value);
			const today = new Date();
			const maxStartDate = new Date();
			maxStartDate.setFullYear(today.getFullYear() - 18);
			if (startDate && startDate > maxStartDate) {
				return { validAgeDate: true };
			}
			return null;
		};
	}
}
