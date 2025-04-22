import { Component, OnInit, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgFor } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { AuthService } from 'src/app/core/services/auth.service';

import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
	imports: [AngularSvgIconModule, NavbarMenuComponent, ProfileMenuComponent, NavbarMobileComponent, NgFor],
})
export class NavbarComponent implements OnInit {
	private _loginAccessService = inject(AuthService);
	private menuService = inject(MenuService);
	public userData: any = {};

	ngOnInit(): void {
		this.userData = this._loginAccessService.getCurrentSession('currentUser');
	}

	public toggleMobileMenu(): void {
		this.menuService.showMobileMenu = true;
	}
}
