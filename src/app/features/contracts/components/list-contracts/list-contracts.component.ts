import { Component, signal, effect, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DatePipe } from '@angular/common';

import { contract } from '../../models/contracts.model';

import { TableRowComponent } from '../table-row/table-row.component';
import { TableRowSonComponent } from '../table-row-son/table-row-son.component';
import { AddModContractComponent } from '../add-mod-contract/add-mod-contract.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { decinalFormat } from 'src/app/shared/utils/number-format';

import { ContractService } from '../../services/contract.service';
@Component({
	selector: 'app-list-contracts',
	imports: [
		DatePipe,
		ToggleSwitchComponent,
		TableFooterComponent,
		SortHeaderComponent,
		AngularSvgIconModule,
		TableRowComponent,
		TableRowSonComponent,
		AddModContractComponent,
	],
	templateUrl: './list-contracts.component.html',
	styleUrl: './list-contracts.component.css',
})
export class ListContractsComponent {
	private DebounceTimer?: any;
	constructor(private _getContractService: ContractService) {
		effect(() => {
			this.loadContracts();
		});
	}

	@ViewChild(AddModContractComponent) contractModal!: AddModContractComponent;

	selectedID: any = null;
	contracts = signal<contract[]>([]);
	contractDetail = signal<contract | null>(null);
	totalContracts!: number;
	isActive = signal<boolean>(true);
	fechaIni = signal<Date>(new Date());
	fechaFin = signal<Date>(new Date());
	search = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(5);
	decinalFormat = decinalFormat;
	loadContracts(): void {
		const status = +this.isActive();
		const fechaInicio = this.fechaIni();
		const fechaFinal = this.fechaFin();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getContractService
			.getContracts(status, searchTerm, { page, size, sort }, fechaInicio, fechaFinal)
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

	onFechaInicioChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (this.DebounceTimer) {
			clearTimeout(this.DebounceTimer);
		}
		this.DebounceTimer = setTimeout(() => {
			let newDate = new Date();
			if (input.value) {
				const parsedDate = new Date(input.value);
				if (!isNaN(parsedDate.getTime())) {
					newDate = parsedDate;
				}
			}

			this.fechaIni.set(newDate);
			this.currentPage.set(1);
		}, 1000);
	}

	onFechaFinChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (this.DebounceTimer) {
			clearTimeout(this.DebounceTimer);
		}
		this.DebounceTimer = setTimeout(() => {
			let newDate = new Date();
			if (input.value) {
				const parsedDate = new Date(input.value);
				if (!isNaN(parsedDate.getTime())) {
					newDate = parsedDate;
				}
			}
			this.fechaFin.set(newDate);
			this.currentPage.set(1);
		}, 1000);
	}

	onSearchChange(event: Event) {
		const inputValue = (event.target as HTMLInputElement).value?.toLowerCase().trim();
		const input = inputValue ? inputValue : ' ';
		if (this.DebounceTimer) {
			clearTimeout(this.DebounceTimer);
		}
		this.DebounceTimer = setTimeout(() => {
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

	dependencyListContract(contract: contract) {
		this.contractDetail.set(this.contractDetail()?.codcon === contract.codcon ? null : contract);
	}

	handleDataSave(res: any) {}

	addUpdateContract(codcon?: string) {
		console.log('llego', codcon);
		this.contractModal.open(codcon ?? '');
	}
}
