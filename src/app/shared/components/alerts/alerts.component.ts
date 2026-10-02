import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSvgIconModule } from 'angular-svg-icon';
@Component({
	selector: 'app-alerts',
	standalone: true,
	imports: [CommonModule, AngularSvgIconModule],
	templateUrl: './alerts.component.html',
	styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnChanges {
	@Input() type: 'success' | 'error' | 'info' | '' = '';

	@Input() customMessage: string = '';

	message: string = '';

	iconPath: string = '';

	visible = false;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['type'] && this.type) {
			this.setMessageByType(this.type);
			this.visible = true;

			setTimeout(() => {
				this.visible = false;
			}, 3000);
		}
	}

	private setMessageByType(type: string): void {
		switch (type) {
			case 'success':
				this.message = this.customMessage || 'Operación realizada con éxito.';
				this.iconPath = 'assets/icons/usericons/check-circle-svgrepo-com.svg';
				break;

			case 'error':
				this.message = this.customMessage || 'Ha ocurrido un error inesperado.';
				this.iconPath = 'assets/icons/usericons/warning-circle-svgrepo-com.svg';
				break;

			case 'info':
				this.message = this.customMessage || 'Información general.';
				this.iconPath = 'assets/icons/heroicons/outline/information-circle.svg';
				break;

			default:
				this.message = '';
				this.iconPath = 'assets/icons/heroicons/outline/information-circle.svg';
				break;
		}
	}
}
