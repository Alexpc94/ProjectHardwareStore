import { Component, OnDestroy, inject } from '@angular/core';

import { roles } from '../../../models/roles.model';
import { menus } from '../../../models/menus.model';

import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { RolesService } from '../../../services/roles.service';
import { Subscription, finalize, forkJoin } from 'rxjs';

@Component({
	selector: 'app-menu-assignment',
	imports: [AlertsComponent],
	templateUrl: './menu-assignment.component.html',
	styleUrl: './menu-assignment.component.css',
})
export class MenuAssignmentComponent implements OnDestroy {
	private _getRolesService = inject(RolesService);
	private _menuRequest?: Subscription;
	showModal: boolean = false;
	selectedData!: roles;
	selectedMenuData: menus[] = [];
	listMenus: menus[] = [];
	isAssigningMenu: boolean = false;
	alertType: 'success' | 'error' | 'info' | '' = '';

	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	open(role: roles) {
		this.close();
		this._menuRequest = forkJoin({
			assignedMenus: this._getRolesService.getAssignedMenus(role.id_role),
			unassignedMenus: this._getRolesService.getUnassignedMenus(role.id_role),
		}).subscribe({
			next: ({ assignedMenus, unassignedMenus }) => {
				this.selectedData = role;
				this.selectedMenuData = assignedMenus || [];
				this.listMenus = unassignedMenus || [];
				this.showModal = true;
			},
			error: () => this.showAlert('error'),
		});
	}

	assignMenu(id_menu: number, action: boolean) {
		if (!this.showModal || !this.selectedData || this.isAssigningMenu) return;

		const data = {
			id_role: this.selectedData.id_role,
			id_menu: id_menu,
		};
		this.isAssigningMenu = true;

		if (action) {
			this._menuRequest = this._getRolesService
				.assignMenu(data)
				.pipe(finalize(() => (this.isAssigningMenu = false)))
				.subscribe({
					next: () => {
						const assignedMenu = this.listMenus.find((menu) => menu.id_menu === id_menu);
						if (assignedMenu) {
							this.selectedMenuData.push(assignedMenu);
							this.listMenus = this.listMenus.filter((menu) => menu.id_menu !== id_menu);
							this.showAlert('success');
						}
					},
					error: () => this.showAlert('error'),
				});
		} else {
			this._menuRequest = this._getRolesService
				.deleteMenu(this.selectedData.id_role, id_menu)
				.pipe(finalize(() => (this.isAssigningMenu = false)))
				.subscribe({
					next: () => {
						const removedMenu = this.selectedMenuData.find((menu) => menu.id_menu === id_menu);
						if (removedMenu) {
							this.selectedMenuData = this.selectedMenuData.filter((menu) => menu.id_menu !== id_menu);
							this.listMenus.push(removedMenu);
							this.showAlert('success');
						}
					},
					error: () => this.showAlert('error'),
				});
		}
	}

	close() {
		this._menuRequest?.unsubscribe();
		this.showModal = false;
		this.selectedMenuData = [];
		this.listMenus = [];
	}

	ngOnDestroy() {
		this.close();
	}
}
