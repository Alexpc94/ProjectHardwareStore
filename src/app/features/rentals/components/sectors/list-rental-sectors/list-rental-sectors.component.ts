import { Component, signal, effect, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { sector } from '../../../models/sector.model';

import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { TableRowComponent } from '../table-row/table-row.component';
import { AddModSectorComponent } from '../add-mod-sector/add-mod-sector.component';

import { RentalService } from '../../../services/rentals.service';

@Component({
	selector: 'app-list-rental-sectors',
	imports: [
		AngularSvgIconModule,
		TableFooterComponent,
		ToggleSwitchComponent,
		SortHeaderComponent,
		TableRowComponent,
		AddModSectorComponent,
	],
	templateUrl: './list-rental-sectors.component.html',
	styleUrl: './list-rental-sectors.component.css',
})
export class ListRentalSectorsComponent {
	private searchDebounceTimer?: any;
	constructor(private _getRentalService: RentalService) {
		effect(() => {
			this.loadSectors();
		});
	}

	@ViewChild(AddModSectorComponent) sectorModal!: AddModSectorComponent;

	selectedID: any = null;
	selectedName?: string;
	sectors = signal<sector[]>([]);
	totalSectors!: number;
	isActive = signal<boolean>(true);
	search = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(5);

	loadSectors(): void {
		const status = +this.isActive();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getRentalService.getSectors(status, searchTerm, { page, size, sort }).subscribe((data) => {
			this.totalSectors = data.totalElements;
			this.sectors.set(data.content);
		});
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

	addUpdateSector(sectorID?: number, sectorName?: string) {
		this.selectedID = sectorID ?? null;
		this.selectedName = sectorName ?? '';
		this.sectorModal.open(this.selectedID, this.selectedName);
	}

	handleDataSave(res: any) {
		switch (res.action) {
			case 'add':
				this.loadSectors();
				break;
			case 'edit':
				this.sectors.update((sectors) =>
					sectors.map((sector) => (sector.cods === res.id ? { ...sector, ...res.data } : sector)),
				);
				break;
			case 'delete':
			case 'enable':
				const newStatus = res.action === 'enable' ? 1 : 0;
				this.sectors.update((sectors) =>
					sectors.map((sector) => (sector.cods === res.id ? { ...sector, estado: newStatus } : sector)),
				);
				break;
		}
	}
}
