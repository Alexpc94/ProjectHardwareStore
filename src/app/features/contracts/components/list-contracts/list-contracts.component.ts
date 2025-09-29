import { Component, signal, effect, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { contract } from '../../models/contracts.model';

//import { TableRowComponent } from '../table-row/table-row.component';
//import { AddModTenantComponent } from '../add-mod-tenant/add-mod-tenant.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';

import { ContractService } from '../../services/contract.service';
@Component({
	selector: 'app-list-contracts',
	imports: [ToggleSwitchComponent, TableFooterComponent, SortHeaderComponent, AngularSvgIconModule],
	templateUrl: './list-contracts.component.html',
	styleUrl: './list-contracts.component.css',
})
export class ListContractsComponent {
	private searchDebounceTimer?: any;
	constructor(private _getContractService: ContractService) {
		effect(() => {
			this.loadContracts();
		});
	}

	// @ViewChild(AddModTenantComponent) tenantModal!: AddModTenantComponent;

	selectedID: any = null;
	contracts = signal<contract[]>([]);
	totalContracts!: number;
	isActive = signal<boolean>(true);
	search = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(5);

	loadContracts(): void {
		const status = +this.isActive();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getContractService
			.getContracts(status, searchTerm, { page, size, sort }, new Date('01/01/2020'), new Date('01/01/2026'))
			.subscribe((data) => {
				this.totalContracts = data.totalElements;
				this.contracts.set(data.content);
				console.log(this.contracts());
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
}
