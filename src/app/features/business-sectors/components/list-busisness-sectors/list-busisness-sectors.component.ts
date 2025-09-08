import { Component, signal, effect, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { BSector } from '../../models/BSectort.model';

import { TableRowComponent } from '../table-row/table-row.component';
import { TabeRowSonComponent } from '../table-row-son/table-row-son.component';
import { AddModBusinessSectorComponent } from '../add-mod-business-sector/add-mod-business-sector.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';

import { BusinessSectorsService } from '../../services/businessSectors.service';

@Component({
	selector: 'app-list-busisness-sectors',
	imports: [
		ToggleSwitchComponent,
		TableFooterComponent,
		SortHeaderComponent,
		AngularSvgIconModule,
		TableRowComponent,
		TabeRowSonComponent,
		AddModBusinessSectorComponent,
	],
	templateUrl: './list-busisness-sectors.component.html',
	styleUrl: './list-busisness-sectors.component.css',
})
export class ListBusisnessSectorsComponent {
	private searchDebounceTimer?: any;
	constructor(private _getBusinessSectorsService: BusinessSectorsService) {
		effect(() => {
			this.loadBusinessSectors();
		});
		effect(() => {
			this.loadBusinessSectorsSon();
		});
	}
	@ViewChild(AddModBusinessSectorComponent) tenantModal!: AddModBusinessSectorComponent;
	selectedID: any = null;
	businessSectors = signal<BSector[]>([]);
	totalBusinessSectors!: number;
	isActive = signal<boolean>(true);
	search = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(5);

	businessSectorsSon = signal<BSector[]>([]);
	isActiveS = signal<boolean>(true);
	codpadreId = signal<string>(' ');

	loadBusinessSectors(): void {
		const status = this.isActive();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getBusinessSectorsService.getBusinessSectors(+status, searchTerm, { page, size, sort }).subscribe((data) => {
			console.log(data.content);
			this.totalBusinessSectors = data.totalElements;
			this.businessSectors.set(data.content);
		});
	}

	loadBusinessSectorsSon(): void {
		const status = this.isActiveS();
		const codpadre = this.codpadreId();
		if (!codpadre) return;
		this._getBusinessSectorsService.getBusinessSectorsSon(+status, codpadre).subscribe((data) => {
			console.log(data.content);
			this.businessSectorsSon.set(data.content);
		});
	}

	onToggleChangeSon(status: boolean) {
		this.isActiveS.set(status);
	}

	onToggleChange(status: boolean) {
		this.isActive.set(status);
		this.currentPage.set(1);
	}

	onSearchChange(event: Event) {
		const inputValue = (event.target as HTMLInputElement).value?.toLowerCase().trim();
		const input = inputValue ? inputValue : ' ';
		if (this.searchDebounceTimer) {
			clearTimeout(this.searchDebounceTimer);
		}
		this.searchDebounceTimer = setTimeout(() => {
			this.search.set(input);
			this.currentPage.set(1);
		}, 500);
		this.currentPage.set(1);
	}

	handlePageChange(page: number) {
		this.currentPage.set(page);
	}

	handleItemsPerPageChange(count: number) {
		this.itemsPerPage.set(count);
		this.currentPage.set(1);
	}

	onSortChange(column: string) {
		if (this.sortBy() === column) {
			this.sortDirection.set(this.sortDirection() === 'ASC' ? 'DESC' : 'ASC');
		} else {
			this.sortBy.set(column);
			this.sortDirection.set('ASC');
		}
		this.currentPage.set(1);
	}

	addUpdateBSector(businessSectorID?: string, codpadreId?: string) {
		this.selectedID = businessSectorID ?? '';
		//console.log(this.selectedID, 'el id de padre es', codpadreId ?? '');
		this.tenantModal.open(this.selectedID, codpadreId ?? '');
	}

	dependencyListBSector(businessSectorID: string) {
		const cleanID = String(businessSectorID).trim();
		this.codpadreId.set(this.codpadreId() === cleanID ? '' : cleanID);
	}

	handleDataSave(res: any) {
		switch (res.action) {
			case 'add':
				this.loadBusinessSectors();
				break;
			case 'edit':
				this.businessSectors.update((businessSectors) =>
					businessSectors.map((bSectors) => (bSectors.codc === res.id ? { ...bSectors, ...res.data } : bSectors)),
				);
				break;
			case 'delete':
			case 'enable':
				const newStatus = res.action === 'enable' ? 1 : 0;
				this.businessSectors.update((businessSectors) =>
					businessSectors.map((bSectors) => (bSectors.codc === res.id ? { ...bSectors, estado: newStatus } : bSectors)),
				);
				break;
		}
	}
	handleDataSonSave(res: any) {
		switch (res.action) {
			case 'add':
				this.loadBusinessSectorsSon();
				break;
			case 'edit':
				this.businessSectorsSon.update((businessSectorsSon) =>
					businessSectorsSon.map((bSectorsSon) =>
						bSectorsSon.codc === res.id ? { ...bSectorsSon, ...res.data } : bSectorsSon,
					),
				);
				break;
			case 'delete':
			case 'enable':
				const newStatus = res.action === 'enable' ? 1 : 0;
				this.businessSectorsSon.update((businessSectorsSon) =>
					businessSectorsSon.map((bSectorsSon) =>
						bSectorsSon.codc === res.id ? { ...bSectorsSon, estado: newStatus } : bSectorsSon,
					),
				);
				break;
		}
	}
}
