import { Component, signal, effect, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularSvgIconModule } from 'angular-svg-icon';

import { section } from '../../../models/section.model';
import { ownership } from '../../../models/ownership.model';

import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { TableRowComponent } from '../table-row/table-row.component';
import { AddModOwnershipsComponent } from '../add-mod-ownerships/add-mod-ownerships.component';

import { RentalService } from '../../../services/rentals.service';
@Component({
	selector: 'app-list-rental-ownerships',
	imports: [
		AngularSvgIconModule,
		TableFooterComponent,
		ToggleSwitchComponent,
		SortHeaderComponent,
		TableRowComponent,
		AddModOwnershipsComponent,
		FormsModule,
	],
	templateUrl: './list-rental-ownerships.component.html',
	styleUrl: './list-rental-ownerships.component.css',
})
export class ListRentalOwnershipsComponent {
	private searchDebounceTimer?: any;
	sectionId?: number;
	sections: section[] = [];

	constructor(private _getRentalService: RentalService) {
		effect(() => {
			const id = this._getRentalService.selectedId();
			this.sectionId = id;
			//console.log('Cargando predios de la seccion:', this.sectorId);
			this.loadOwnerships();
		});
	}

	@ViewChild(AddModOwnershipsComponent) sectionModal!: AddModOwnershipsComponent;

	selectedID?: string;
	codsecID?: number;
	ownerships = signal<ownership[]>([]);
	totalOwnerships!: number;
	isActive = signal<boolean>(true);
	search = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(5);

	ngOnInit() {
		this.getSections();
	}

	loadOwnerships(): void {
		const id = this.sectionId ?? 0;
		const status = +this.isActive();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getRentalService.getOwnerships(id, status, searchTerm, { page, size, sort }).subscribe((data) => {
			this.totalOwnerships = data.totalElements;
			this.ownerships.set(data.content);
			//console.log('Ownerships loaded:', this.ownerships());
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

	getSections(): void {
		this._getRentalService.getListSections().subscribe((data) => {
			this.sections = data.content;
		});
	}

	onTypeChange(event: Event) {
		const select = event.target as HTMLSelectElement | null;
		if (!select) return;
		const newId = Number(select.value);
		this._getRentalService.setView('predios', Number(newId));
	}

	addUpdateOwnership(codpreID?: string) {
		this.selectedID = codpreID ?? '';
		this.codsecID = this.sectionId ?? 0;
		this.sectionModal.open(this.selectedID, this.codsecID);
	}

	handleDataSave(res: any) {
		switch (res.action) {
			case 'add':
				this.loadOwnerships();
				break;
			case 'edit':
				this.ownerships.update((ownerships) =>
					ownerships.map((ownership) => (ownership.codpre === res.id ? { ...ownership, ...res.data } : ownership)),
				);
				break;
			case 'delete':
			case 'enable':
				const newStatus = res.action === 'enable' ? 1 : 0;
				this.ownerships.update((ownerships) =>
					ownerships.map((ownership) =>
						ownership.codpre === res.id ? { ...ownership, estado: newStatus } : ownership,
					),
				);
				break;
		}
	}
}
