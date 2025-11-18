import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { contract } from '../models/contracts.model';
import { ApiResponse } from '../models/response.model';
import { Pageable, PaginatedResponse } from '../models/pageable.model';

@Injectable({
	providedIn: 'root',
})
export class ContractService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);

	getContracts(
		estado: number,
		stop: number,
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
			stop,
			buscar,
			page: pageable.page,
			size: pageable.size,
			sort: pageable.sort,
		};
		return this._http.get<PaginatedResponse<contract>>(url, { params });
	}

	getContractById(codcon: string): Observable<any> {
		const url = `${this.apiURL}/api/mcontratos/id/${codcon}`;
		return this._http.get<{ data: any }>(url).pipe(map((response) => response));
	}

	private formatDate(date: Date): string {
		if (!date || isNaN(date.getTime())) {
			return new Date().toISOString().split('T')[0];
		}
		return date.toISOString().split('T')[0];
	}

	addContractrData(data: contract): Observable<ApiResponse<contract>> {
		const url = `${this.apiURL}/api/mcontratos`;
		return this._http.post<ApiResponse<contract>>(url, data);
	}

	modContractStatus(codcon: string, idresponsable: number): Observable<contract> {
		const safeCodcon = encodeURIComponent(codcon);
		const url = `${this.apiURL}/api/mcontratos?codcon=${safeCodcon}&idresponsable=${idresponsable}`;
		return this._http.delete<contract>(url);
	}

	stopContract(codcon: string, data: any): Observable<contract> {
		const safeCodcon = encodeURIComponent(codcon);
		const url = `${this.apiURL}/api/mcontratos/stop/${safeCodcon}`;
		return this._http.put<contract>(url, data);
	}
}
