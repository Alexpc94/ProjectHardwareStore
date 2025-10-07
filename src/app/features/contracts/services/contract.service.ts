import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { contract } from '../models/contracts.model';
import { Pageable, PaginatedResponse } from '../models/pageable.model';

@Injectable({
	providedIn: 'root',
})
export class ContractService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);

	getContracts(
		estado: number,
		buscar: string,
		pageable: Pageable,
		fechaini: Date,
		fechafin: Date,
	): Observable<PaginatedResponse<contract>> {
		const url = `${this.apiURL}/api/mcontratos`;
		const params = {
			fechaini: this.formatDate(fechaini),
			fechafin: this.formatDate(fechafin),
			estado,
			buscar,
			page: pageable.page,
			size: pageable.size,
			sort: pageable.sort,
		};
		return this._http.get<PaginatedResponse<contract>>(url, { params });
	}

	private formatDate(date: Date): string {
		if (!date || isNaN(date.getTime())) {
			return new Date().toISOString().split('T')[0];
		}
		return date.toISOString().split('T')[0];
	}
}
