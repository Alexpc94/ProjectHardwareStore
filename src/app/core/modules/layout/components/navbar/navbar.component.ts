import { Component, OnInit, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgFor } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { RoleService } from 'src/app/core/services/role.service';

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
	private roleService = inject(RoleService);
	selectedRole: string = '';
	public userData: any = {};

	ngOnInit(): void {
		this.userData = this._loginAccessService.getCurrentSession('currentUser');
		this.selectedRole = this.userData.data2[0].id_role;
		this.roleService.setRole(this.selectedRole);
	}

	public toggleMobileMenu(): void {
		this.menuService.showMobileMenu = true;
	}

	onRoleChange(event: Event): void {
		const select = event.target as HTMLSelectElement;
		this.selectedRole = select.value;
		this.roleService.setRole(this.selectedRole);
	}
}
