import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/core/constants/menu';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';

import { RoleService } from 'src/app/core/services/role.service';
import { generateDynamicMenu } from 'src/app/core/constants/menuhelper';

@Injectable({
	providedIn: 'root',
})
export class MenuService implements OnDestroy {
	private _showSidebar = signal(true);
	private _showMobileMenu = signal(false);
	private _pagesMenu = signal<MenuItem[]>([]);
	private _subscription = new Subscription();

	constructor(private router: Router, private roleService: RoleService) {
		const rawUserData = sessionStorage.getItem('currentUser');
		let parsedData: any = null;
		parsedData = rawUserData ? JSON.parse(rawUserData) : null;
		const roleSub = this.roleService.role$.subscribe((roleStr) => {
			const currentRole = +roleStr;
			// console.log('Rol actualizado:', currentRole);
			if (parsedData?.data && currentRole) {
				const menu = generateDynamicMenu(parsedData.data, currentRole);
				this._pagesMenu.set(menu);
			}
		});
		this._subscription.add(roleSub);

		// Manejar expansión de menús basado en ruta activa
		const sub = this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this._pagesMenu().forEach((menu) => {
					let activeGroup = false;
					menu.items.forEach((subMenu) => {
						const active = this.isActive(subMenu.route);
						subMenu.expanded = active;
						subMenu.active = active;
						if (active) activeGroup = true;
						if (subMenu.children) {
							this.expand(subMenu.children);
						}
					});
					menu.active = activeGroup;
				});
			}
		});
		this._subscription.add(sub);
	}

	get showSideBar() {
		return this._showSidebar();
	}
	get showMobileMenu() {
		return this._showMobileMenu();
	}
	get pagesMenu() {
		return this._pagesMenu();
	}

	set showSideBar(value: boolean) {
		this._showSidebar.set(value);
	}
	set showMobileMenu(value: boolean) {
		this._showMobileMenu.set(value);
	}

	public toggleSidebar() {
		this._showSidebar.set(!this._showSidebar());
	}

	public toggleMenu(menu: any) {
		this.showSideBar = true;
		menu.expanded = !menu.expanded;
	}

	public toggleSubMenu(submenu: SubMenuItem) {
		submenu.expanded = !submenu.expanded;
	}

	private expand(items: Array<any>) {
		items.forEach((item) => {
			item.expanded = this.isActive(item.route);
			if (item.children) this.expand(item.children);
		});
	}

	public isActive(instruction: any): boolean {
		return this.router.isActive(this.router.createUrlTree([instruction]), {
			paths: 'subset',
			queryParams: 'subset',
			fragment: 'ignored',
			matrixParams: 'ignored',
		});
	}

	ngOnDestroy(): void {
		this._subscription.unsubscribe();
	}
}
