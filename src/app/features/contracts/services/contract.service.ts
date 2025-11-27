import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
	getLogs(
		tipo_operacion: string,
		buscar: string,
		pageable: Pageable,
		fechaini: Date,
		fechafin: Date,
	): Observable<PaginatedResponse<any>> {
		const url = `${this.apiURL}/api/auditoria`;
		const params = {
			fechaini: this.formatDate(fechaini),
			fechafin: this.formatDate(fechafin),
			buscar,
			tipo_operacion,
			page: pageable.page,
			size: pageable.size,
			sort: pageable.sort,
		};
		return this._http.get<PaginatedResponse<any>>(url, { params });
	}

	getContractById(codcon: string): Observable<any> {
		const params = new HttpParams().set('codcon', codcon);
		const url = `${this.apiURL}/api/mcontratos/data`;
		return this._http.get<{ data: any }>(url, { params }).pipe(map((response) => response));
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

	stopContractrData(codcon: string, data: any): Observable<contract> {
		const params = new HttpParams().set('codcon', codcon);
		const url = `${this.apiURL}/api/mcontratos`;
		return this._http.put<contract>(url, data, { params });
	}

	modContractStatus(codcon: string, idresponsable: number): Observable<contract> {
		const params = new HttpParams().set('codcon', codcon).set('idresponsable', idresponsable);
		const url = `${this.apiURL}/api/mcontratos`;
		return this._http.delete<contract>(url, { params });
	}

	stopContract(codcon: string, data: any): Observable<contract> {
		const params = new HttpParams().set('codcon', codcon);
		const url = `${this.apiURL}/api/mcontratos/stop`;
		return this._http.put<contract>(url, data, { params });
	}
}
