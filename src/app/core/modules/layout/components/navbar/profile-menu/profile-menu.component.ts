import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from 'src/app/core/services/theme.service';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside.directive';

import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-profile-menu',
	templateUrl: './profile-menu.component.html',
	styleUrls: ['./profile-menu.component.css'],
	imports: [ClickOutsideDirective, NgClass, AngularSvgIconModule],
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
	public isOpen = false;
	public userData: any = {};
	public profileMenu = [
		{
			title: 'Mi Perfil',
			icon: './assets/icons/heroicons/outline/user-circle.svg',
			data: 'yourProfile',
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

	public themeMode = ['light', 'dark'];
	public themeDirection = ['ltr', 'rtl'];

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

	handleMenuAction(action: string) {
		switch (action) {
			case 'logOut':
				this._loginAccessService.deleteCurrentSession('currentUser');
				this._router.navigate(['/auth/sign-in']);
				break;
			case 'yourProfile':
				this._router.navigate(['/profile']);
				break;

			default:
				console.warn('Acción no reconocida:', action);
				break;
		}
	}
}
