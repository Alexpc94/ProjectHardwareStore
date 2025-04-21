import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-alerts',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './alerts.component.html',
	styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnChanges {
	@Input() type: 'success' | 'error' | 'login-error' | 'info' | '' = '';
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

	private setMessageByType(type: string) {
		switch (type) {
			case 'success':
				this.message = 'Operación realizada con éxito.';
				this.iconPath = 'assets/icons/usericons/check-circle-svgrepo-com-white.svg';
				break;
			case 'error':
				this.message = 'Ha ocurrido un error inesperado.';
				this.iconPath = 'assets/icons/usericons/warning-circle-svgrepo-com-white.svg';
				break;
			case 'login-error':
				this.message = 'Error al iniciar sesión. Verifica tus datos.';
				this.iconPath = 'assets/icons/usericons/warning-circle-svgrepo-com-white.svg';
				break;
			case 'info':
				this.message = 'Información general.';
				this.iconPath = 'assets/icons/info.svg';
				break;
			default:
				this.message = '';
				this.iconPath = 'assets/icons/alert.svg';
				break;
		}
	}
}
