import { Component, signal, effect, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxFlatpickrWrapperComponent } from 'ngx-flatpickr-wrapper';

import { DatePipe } from '@angular/common';

import { contract } from '../../../models/contracts.model';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

import { TableRowComponent } from '../table-row/table-row.component';
import { TableRowSonComponent } from '../table-row-son/table-row-son.component';
import { AddModContractComponent } from '../add-mod-contract/add-mod-contract.component';
import { UpdateContractComponent } from '../update-contract/update-contract.component';

import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { decinalFormat } from 'src/app/shared/utils/number-format';

import { ContractService } from '../../../services/contract.service';
@Component({
	selector: 'app-list-contracts',
	imports: [
		DatePipe,
		NgxFlatpickrWrapperComponent,
		ToggleSwitchComponent,
		TableFooterComponent,
		SortHeaderComponent,
		AngularSvgIconModule,
		TableRowComponent,
		TableRowSonComponent,
		AddModContractComponent,
		UpdateContractComponent,
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
	@ViewChild(UpdateContractComponent) contractUpdateModal!: UpdateContractComponent;

	contracts = signal<contract[]>([]);
	contractDetail = signal<contract | null>(null);
	totalContracts!: number;
	isActive = signal<boolean>(true);
	isStop = signal<number>(0);
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
		const stop = +this.isStop();
		const fechaInicio = this.fechaIni();
		const fechaFinal = this.fechaFin();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getContractService
			.getContracts(status, stop, searchTerm, { page, size, sort }, fechaInicio, fechaFinal)
			.subscribe((data) => {
				this.totalContracts = data.totalElements;
				this.contracts.set(data.content);
				console.log(this.contracts());
			});
	}

	configS = {
		dateFormat: 'd/m/Y',
		defaultDate: this.fechaIni(),
		locale: Spanish,
		allowInput: true,
		onChange: (selectedDates: Date[]) => {
			if (selectedDates.length) {
				const date = selectedDates[0];
				this.fechaIni.set(date);
				this.currentPage.set(1);
			}
		},
	};
	configF = {
		dateFormat: 'd/m/Y',
		defaultDate: this.fechaFin(),
		locale: Spanish,
		allowInput: true,
		onChange: (selectedDates: Date[]) => {
			if (selectedDates.length) {
				const date = selectedDates[0];
				this.fechaFin.set(date);
				this.currentPage.set(1);
			}
		},
	};

	onToggleChange(status: boolean) {
		this.isActive.set(status);
		this.currentPage.set(1);
	}

	onChangeStop(event: Event) {
		const value = Number((event.target as HTMLInputElement).value);
		this.isStop.set(value);
		this.currentPage.set(1);
	}

	onSearchChange(event: Event) {
		const inputValue = (event.target as HTMLInputElement).value?.toLowerCase().trim();
		const input = inputValue ? inputValue : ' ';
		clearTimeout(this.DebounceTimer);
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

	handleDataSave(res: any) {
		switch (res.action) {
			case 'add':
				this.loadContracts();
				break;
			case 'stop':
				this.contracts.update((contracts) =>
					contracts.map((contract) => (contract.codcon === res.id ? { ...contract, stop: 1 } : contract)),
				);
				break;
			case 'edit':
				this.contracts.update((contracts) =>
					contracts.map((contract) => (contract.codcon === res.id ? { ...contract, ...res.data } : contract)),
				);
				break;
			case 'delete':
			case 'enable':
				const newStatus = res.action === 'enable' ? 1 : 0;
				this.contracts.update((contracts) =>
					contracts.map((contract) => (contract.codcon === res.id ? { ...contract, estado: newStatus } : contract)),
				);
				break;
		}
	}

	addUpdateContract(codcon?: string) {
		codcon ? this.contractUpdateModal.open(codcon) : this.contractModal.open();
	}
}
