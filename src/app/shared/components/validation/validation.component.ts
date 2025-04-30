import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-validation',
	imports: [NgIf],
	templateUrl: './validation.component.html',
	styleUrl: './validation.component.css',
})
export class ValidationComponent {
	@Input() control!: AbstractControl | null;
	@Input() submitted = false;
}
