import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside.directive';
import { ViewStaffComponent } from 'src/app/features/sistem-data/components/staff/view-staff/view-staff.component';
import { UpdateImageComponent } from 'src/app/features/sistem-data/components/staff/update-image/update-image.component';
import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { AuthService } from 'src/app/core/services/auth.service';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
	selector: 'app-profile-menu',
	templateUrl: './profile-menu.component.html',
	styleUrls: ['./profile-menu.component.css'],
	imports: [
		ClickOutsideDirective,
		NgClass,
		AngularSvgIconModule,
		ViewStaffComponent,
		UpdateImageComponent,
		AlertsComponent,
	],
	animations: [
		trigger('openClose', [
			state(
				'open',
				style({
					opacity: 1,
					transform: 'translateY(0)',
					visibility: 'visible',
				}),
			),
			state(
				'closed',
				style({
					opacity: 0,
					transform: 'translateY(-20px)',
					visibility: 'hidden',
				}),
			),
			transition('open => closed', [animate('0.2s')]),
			transition('closed => open', [animate('0.2s')]),
		]),
	],
})
export class ProfileMenuComponent implements OnInit {
	_loginAccessService = inject(AuthService);
	_router = inject(Router);
	themeService = inject(ThemeService);

	@ViewChild(ViewStaffComponent) userViewModal!: ViewStaffComponent;
	@ViewChild(UpdateImageComponent) userImageModal!: UpdateImageComponent;

	public isOpen = false;
	public userData: any = {};

	alertType: any;
	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	public profileMenu = [
		{
			title: 'Mi Perfil',
			icon: './assets/icons/heroicons/outline/user-circle.svg',
			data: 'yourProfile',
		},
		{
			title: 'Cambiar Contraseña',
			icon: './assets/icons/heroicons/outline/shield-check.svg',
			data: 'ChangePassword',
		},
		{
			title: 'Cerrar Sesión',
			icon: './assets/icons/heroicons/outline/logout.svg',
			data: 'logOut',
		},
	];

	public themeColors = [
		{
			name: 'base',
			code: '#e11d48',
		},
		{
			name: 'green',
			code: '#22c55e',
		},
		{
			name: 'blue',
			code: '#3b82f6',
		},
		{
			name: 'orange',
			code: '#ea580c',
		},
		{
			name: 'red',
			code: '#cc0022',
		},
		{
			name: 'violet',
			code: '#6d28d9',
		},
	];

	public themeMode = ['Claro', 'Oscuro'];

	ngOnInit(): void {
		this.userData = this._loginAccessService.getCurrentSession('currentUser');
	}

	public toggleMenu(): void {
		this.isOpen = !this.isOpen;
	}

	toggleThemeMode() {
		this.themeService.theme.update((theme) => {
			const mode = !this.themeService.isDark ? 'dark' : 'light';
			return { ...theme, mode: mode };
		});
	}

	toggleThemeColor(color: string) {
		this.themeService.theme.update((theme) => {
			return { ...theme, color: color };
		});
	}

	UpdateProfileImage() {
		this.userImageModal.open(this.userData.otherParams.id);
	}
	ImageUpdated(res: any) {
		console.log('let me see:', res);
		if (!res.success) return this.showAlert('error');
		this.showAlert('success');
	}

	handleMenuAction(action: string) {
		switch (action) {
			case 'logOut':
				this._loginAccessService.deleteCurrentSession('currentUser');
				this._router.navigate(['/auth/sign-in']);
				break;
			case 'yourProfile':
				this.userViewModal.open(this.userData.otherParams.id);
				break;
			case 'ChangePassword':
				this._router.navigate(['/passUpdate']);
				break;

			default:
				console.warn('Acción no reconocida:', action);
				break;
		}
	}
}
