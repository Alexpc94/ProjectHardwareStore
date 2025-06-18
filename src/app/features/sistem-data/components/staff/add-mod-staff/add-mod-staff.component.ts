import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild,
	inject,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import {
	AbstractControl,
	ReactiveFormsModule,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { staff } from '../../../models/staff.model';
@Component({
	selector: 'app-add-mod-staff',
	imports: [ReactiveFormsModule, ValidationComponent],
	providers: [DatePipe],
	templateUrl: './add-mod-staff.component.html',
	styleUrl: './add-mod-staff.component.css',
})
export class AddModStaffComponent implements OnInit {
	@Input() selectedData!: staff;
	@Output() save = new EventEmitter<any>();
	@ViewChild('userDialog') userDialog!: ElementRef<HTMLDialogElement>;
	_formBuilder = inject(FormBuilder);
	_datePipe = inject(DatePipe);
	form!: FormGroup;
	get f() {
		return this.form.controls;
	}
	submitted: boolean = false;
	ngOnInit() {
		this.buildForm();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['selectedData']) {
			if (!this.form) this.buildForm(); // asegurar que el form ya exista
			if (this.selectedData) {
				this.patchForm();
			}
		}
	}

	buildForm(): void {
		this.form = this._formBuilder.group({
			name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			firstName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			secondName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
			cedula: new FormControl('', [
				Validators.required,
				Validators.maxLength(15),
				Validators.minLength(4),
				Validators.pattern('^[0-9]*$'),
			]),
			datebirth: new FormControl('', [Validators.required, this.ValidAgeDate()]),
			gender: new FormControl('', [Validators.required]),
			telephone: new FormControl('', [Validators.pattern('^[0-9]*$')]),
			email: new FormControl('', [Validators.email]),
			photo: new FormControl('', [this.onlyImageFilesValidator(), this.maxFileSizeValidator(3)]),
		});
	}

	patchForm(): void {
		console.log(this.selectedData);
		if (this.selectedData) {
			//const birdthDate = new Date(this.selectedData.datebirth);
			// const formattedBirdthDate = this._datePipe.transform(birdthDate, 'yyyy-MM-dd', 'UTC');
			//const formattedBirdthDate = this._datePipe.transform(birdthDate, 'dd-MM-yyyy', 'UTC');
			//console.log('Fecha formateada:', formattedBirdthDate);
			this.form.patchValue({
				cedula: this.selectedData.cedula,
				name: this.selectedData.name,
				firstName: this.selectedData.firstName,
				secondName: this.selectedData.secondName,
				gender: this.selectedData.gender,
				email: this.selectedData.email,
				telephone: this.selectedData.telephone,
				datebirth: this.selectedData.datebirth,
			});
		}
	}

	ValidAgeDate(): ValidatorFn {
		// Función to define if people are 18 years old o more
		return (control: AbstractControl): { [key: string]: any } | null => {
			const startDate = new Date(control.value);
			const today = new Date();
			const maxStartDate = new Date();
			maxStartDate.setFullYear(today.getFullYear() - 18);
			if (startDate && startDate > maxStartDate) {
				return { ValidAgeDate: true };
			}
			return null;
		};
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			this.form.get('photo')?.setValue(file);
			this.form.get('photo')?.updateValueAndValidity();
		}
	}

	maxFileSizeValidator(maxSizeMB: number): ValidatorFn {
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

	onlyImageFilesValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const file = control.value;
			if (!file) return null; // No validar si está vacío
			if (!(file instanceof File)) return { invalidType: true };
			if (!file.type.startsWith('image/')) {
				return { invalidType: true };
			}
			return null;
		};
	}

	open() {
		this.userDialog.nativeElement.showModal();
	}

	close() {
		this.form.reset();
		this.submitted = false;
		this.userDialog.nativeElement.close();
	}

	saveUser(): void {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		console.log(this.form.value);
		this.save.emit(this.selectedData);
		this.close();
	}
}
