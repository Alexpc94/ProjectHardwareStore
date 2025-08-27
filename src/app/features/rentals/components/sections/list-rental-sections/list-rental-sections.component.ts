import { Component, signal, effect, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularSvgIconModule } from 'angular-svg-icon';

import { section } from '../../../models/section.model';
import { sector } from '../../../models/sector.model';

import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { TableRowComponent } from '../table-row/table-row.component';
import { AddModSectionComponent } from '../add-mod-section/add-mod-section.component';

import { RentalService } from '../../../services/rentals.service';

@Component({
	selector: 'app-list-rental-sections',
	imports: [
		AngularSvgIconModule,
		TableFooterComponent,
		ToggleSwitchComponent,
		SortHeaderComponent,
		TableRowComponent,
		AddModSectionComponent,
		FormsModule,
	],
	templateUrl: './list-rental-sections.component.html',
	styleUrl: './list-rental-sections.component.css',
})
export class ListRentalSectionsComponent implements OnInit {
	private searchDebounceTimer?: any;
	sectorId?: number;
	sectors: sector[] = [];

	constructor(private _getRentalService: RentalService) {
		effect(() => {
			const id = this._getRentalService.selectedId();
			this.sectorId = id;
			//console.log('Cargando secciones del sector:', this.sectorId);
			this.loadSections();
		});
	}

	@ViewChild(AddModSectionComponent) sectionModal!: AddModSectionComponent;

	selectedID?: number | null;
	codsID?: number | null;
	selectedName?: string;
	sections = signal<section[]>([]);
	totalSections!: number;
	isActive = signal<boolean>(true);
	search = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(5);

	ngOnInit() {
		this.getSectors();
	}

	loadSections(): void {
		const id = this.sectorId ?? 0;
		const status = +this.isActive();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getRentalService.getSections(id, status, searchTerm, { page, size, sort }).subscribe((data) => {
			this.totalSections = data.totalElements;
			this.sections.set(data.content);
			//console.log('Sectors loaded:', this.sections());
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

	getSectors(): void {
		this._getRentalService.getListSectors().subscribe((data) => {
			this.sectors = data.content;
		});
	}

	onTypeChange(event: Event) {
		const select = event.target as HTMLSelectElement | null;
		if (!select) return;
		const newId = Number(select.value);
		this._getRentalService.setView('secciones', Number(newId));
	}

	addUpdateSection(sectionID?: number, name?: string, cods?: number) {
		console.log('Editando sección ID:', sectionID, 'Nombre:', name, 'Cods:', cods);
		this.selectedID = sectionID ?? null;
		this.selectedName = name ?? '';
		this.codsID = cods ?? null;
		this.sectionModal.open(this.selectedID, this.selectedName, this.codsID);
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
