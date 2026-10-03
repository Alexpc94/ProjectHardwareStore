import { Component, signal, effect, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxFlatpickrWrapperComponent } from 'ngx-flatpickr-wrapper';
import { DatePipe } from '@angular/common';
import { Spanish } from 'flatpickr/dist/l10n/es.js';

import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';

import { ViewContractLogComponent } from '../view-contract-log/view-contract-log.component';

import { ContractService } from '../../services/contract.service';

@Component({
	selector: 'app-contract-logs',
	imports: [
		DatePipe,
		AngularSvgIconModule,
		NgxFlatpickrWrapperComponent,
		TableFooterComponent,
		ViewContractLogComponent,
	],
	templateUrl: './contract-logs.component.html',
	styleUrl: './contract-logs.component.css',
})
export class ContractLogsComponent {
	private DebounceTimer?: any;
	constructor(private _getContractService: ContractService) {
		effect(() => {
			this.loadLogs();
		});
	}

	@ViewChild(ViewContractLogComponent) contractLogViewModal!: ViewContractLogComponent;

	totalLogs!: number;
	logs = signal<any[]>([]);
	fechaIni = signal<Date>(new Date());
	fechaFin = signal<Date>(new Date());
	search = signal<string>(' ');
	optionType = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(10);

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

	loadLogs(): void {
		const tipoOperacion = this.optionType();
		const fechaInicio = this.fechaIni();
		const fechaFinal = this.fechaFin();
		const searchTerm = this.search();
		const page = this.currentPage() - 1;
		const size = this.itemsPerPage();
		const sort = [`${this.sortBy()},${this.sortDirection()}`];

		this._getContractService
			.getLogs(tipoOperacion, searchTerm, { page, size, sort }, fechaInicio, fechaFinal)
			.subscribe((data) => {
				const logsFormateados = data.content.map((log: any) => ({
					...log,
					datos_anteriores_obj: this.parseLogData(log.datos_anteriores),
					datos_nuevos_obj: this.parseLogData(log.datos_nuevos),
				}));
				this.logs.set(logsFormateados);
				this.totalLogs = data.totalElements;
				//console.log(this.logs());
			});
	}

	handleDateChange(event: Event, setter: (d: Date) => void): void {
		const input = event.target as HTMLInputElement;
		clearTimeout(this.DebounceTimer);
		this.DebounceTimer = setTimeout(() => {
			const [year, month, day] = input.value.split('-').map(Number);
			const localDate = new Date(year, month - 1, day);
			setter(localDate);
			this.currentPage.set(1);
		}, 1200);
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

	onTypeChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		this.optionType.set(select.value);
		this.currentPage.set(1);
	}

	parseLogData(data: any): any {
		if (typeof data !== 'string') {
			return data ?? null;
		}
		try {
			return JSON.parse(data);
		} catch {
			return data;
		}
	}

	ListLogsH(id: number, type: 'previous' | 'current' | 'detail' | 'description' = 'detail') {
		const logEncontrado = this.logs().find((l) => l.id === id);
		if (!logEncontrado) {
			return;
		}
		this.contractLogViewModal.open(logEncontrado, type);
	}
}
