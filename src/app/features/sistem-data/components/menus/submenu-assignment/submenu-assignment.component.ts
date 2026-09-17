import { Component, OnDestroy, inject } from '@angular/core';

import { menus } from '../../../models/menus.model';
import { assignedSubmenus, submenus } from '../../../models/submenus.model';

import { AlertsComponent } from 'src/app/shared/components/alerts/alerts.component';

import { MenusService } from '../../../services/menus.service';
import { Subscription, finalize, forkJoin, switchMap } from 'rxjs';

@Component({
	selector: 'app-submenu-assignment',
	imports: [AlertsComponent],
	templateUrl: './submenu-assignment.component.html',
	styleUrl: './submenu-assignment.component.css',
})
export class SubmenuAssignmentComponent implements OnDestroy {
	private _getMenusService = inject(MenusService);
	private _submenuRequest?: Subscription;
	showModal: boolean = false;
	selectedData!: menus;
	selectedSubmenuData: assignedSubmenus[] = [];
	listSubmenus: submenus[] = [];
	isAssigningSubmenu: boolean = false;
	alertType: 'success' | 'error' | 'info' | '' = '';

	showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	}

	open(menu: menus) {
		this.close();
		this._submenuRequest = this.loadSubmenus(menu.id_menu).subscribe({
			next: ({ assignedSubmenus, unassignedSubmenus }) => {
				this.selectedData = menu;
				this.selectedSubmenuData = assignedSubmenus || [];
				this.listSubmenus = unassignedSubmenus || [];
				this.showModal = true;
			},
			error: () => this.showAlert('error'),
		});
	}

	assignSubmenu(id: number, action: boolean) {
		if (!this.showModal || !this.selectedData || this.isAssigningSubmenu) return;

		const submenu = action
			? this.listSubmenus.find((submenu) => submenu.id_subm === id)
			: this.selectedSubmenuData.find((submenu) => submenu.id_mesub === id);
		if (!Number.isInteger(id) || id <= 0 || !submenu) {
			this.showAlert('error');
			return;
		}

		const idMenu = this.selectedData.id_menu;
		const data = {
			id_menu: idMenu,
			id_submenu: submenu.id_subm,
		};
		this.isAssigningSubmenu = true;

		const request = action
			? this._getMenusService.assignSubmenu(data)
			: this._getMenusService.deleteSubmenu(id);

		this._submenuRequest = request
			.pipe(
				// Recargar obtiene el id_mesub generado al asignar, necesario para quitar la relación.
				switchMap(() => this.loadSubmenus(idMenu)),
				finalize(() => (this.isAssigningSubmenu = false)),
			)
			.subscribe({
				next: ({ assignedSubmenus, unassignedSubmenus }) => {
					this.selectedSubmenuData = assignedSubmenus || [];
					this.listSubmenus = unassignedSubmenus || [];
					this.showAlert('success');
				},
				error: () => this.showAlert('error'),
			});
	}

	private loadSubmenus(idMenu: number) {
		return forkJoin({
			assignedSubmenus: this._getMenusService.getAssignedSubmenus(idMenu),
			unassignedSubmenus: this._getMenusService.getUnassignedSubmenus(idMenu),
		});
	}

	close() {
		this._submenuRequest?.unsubscribe();
		this.showModal = false;
		this.selectedSubmenuData = [];
		this.listSubmenus = [];
	}

	ngOnDestroy() {
		this.close();
	}
}
