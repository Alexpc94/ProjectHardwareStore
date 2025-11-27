import { Component, signal, effect, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DatePipe } from '@angular/common';

import { contract } from '../../models/contracts.model';

import { ContractService } from '../../services/contract.service';

@Component({
	selector: 'app-contract-logs',
	imports: [DatePipe, AngularSvgIconModule],
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

	showModal: boolean = false;
	logs = signal<any[]>([]);
	fechaIni = signal<Date>(new Date());
	fechaFin = signal<Date>(new Date());
	search = signal<string>(' ');
	optionType = signal<string>(' ');
	sortBy = signal<string>('id');
	sortDirection = signal<'ASC' | 'DESC'>('ASC');
	currentPage = signal<number>(1);
	itemsPerPage = signal<number>(5);

	open(): void {
		this.showModal = true;
	}

	close() {
		this.showModal = false;
	}

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
				this.logs.set(data.content);
				console.log(this.logs());
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

	onFechaInicioChange(event: Event): void {
		this.handleDateChange(event, this.fechaIni.set);
	}

	onFechaFinChange(event: Event): void {
		this.handleDateChange(event, this.fechaFin.set);
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
}
