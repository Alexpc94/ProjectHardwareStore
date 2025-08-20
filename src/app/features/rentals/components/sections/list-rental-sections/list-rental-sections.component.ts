import { Component, signal, effect, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { section } from '../../../models/section.model';

import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { TableRowComponent } from '../table-row/table-row.component';

import { RentalService } from '../../../services/rentals.service';

@Component({
	selector: 'app-list-rental-sections',
	imports: [AngularSvgIconModule, TableFooterComponent, ToggleSwitchComponent, SortHeaderComponent, TableRowComponent],
	templateUrl: './list-rental-sections.component.html',
	styleUrl: './list-rental-sections.component.css',
})
export class ListRentalSectionsComponent {
	private searchDebounceTimer?: any;
	sectorId?: number | null;

	constructor(private _getRentalService: RentalService) {
		effect(() => {
			const id = this._getRentalService.selectedId();
			this.sectorId = id;
			console.log('Cargando secciones del sector:', this.sectorId);
		});
		effect(() => {
			this.loadSections();
		});
	}

	@ViewChild(TableRowComponent) childComponent!: TableRowComponent;

	sections = signal<section[]>([]);
	totalSections!: number;
	isActive = signal<boolean>(true);
	search = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(5);

	loadSections(): void {
		const id = this.sectorId;
		const status = +this.isActive();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getRentalService.getSections(status, searchTerm, { page, size, sort }).subscribe((data) => {
			this.totalSections = data.totalElements;
			this.sections.set(data.content);
			console.log('Sectors loaded:', this.sections());
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

	addData(): void {
		//this.childComponent.addUpdateSection();
	}

	handleDataSave(res: any) {
		switch (res.action) {
			case 'add':
				this.loadSections();
				break;
			case 'edit':
				this.sections.update((sections) =>
					sections.map((section) => (section.codsec === res.id ? { ...section, ...res.data } : section)),
				);
				break;
			case 'delete':
			case 'enable':
				const newStatus = res.action === 'enable' ? 1 : 0;
				this.sections.update((sections) =>
					sections.map((section) => (section.codsec === res.id ? { ...section, estado: newStatus } : section)),
				);
				break;
		}
	}
}
