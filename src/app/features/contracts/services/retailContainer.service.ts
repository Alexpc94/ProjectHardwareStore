import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { reatailContainer } from '../models/retailContainer.model';
import { ApiResponse } from '../models/response.model';
import { Pageable, PaginatedResponse } from '../models/pageable.model';

@Injectable({
	providedIn: 'root',
})
export class retailContainerService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);

	private formatDate(date: Date): string {
		if (!date || isNaN(date.getTime())) {
			return new Date().toISOString().split('T')[0];
		}
		return date.toISOString().split('T')[0];
	}

	getRetailContainers(
		estado: number,
		stop: number,
		buscar: string,
		pageable: Pageable,
		fechaini: Date,
		fechafin: Date,
	): Observable<PaginatedResponse<reatailContainer>> {
		const url = `${this.apiURL}/api/macoplados`;
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
		return this._http.get<PaginatedResponse<reatailContainer>>(url, { params });
	}

	modContractStatus(coda: string, idresponsable: number): Observable<reatailContainer> {
		const params = new HttpParams().set('coda', coda).set('idresponsable', idresponsable);
		const url = `${this.apiURL}/api/macoplados`;
		return this._http.delete<reatailContainer>(url, { params });
	}

	stopContainerContract(coda: string, data: any): Observable<reatailContainer> {
		const params = new HttpParams().set('coda', coda);
		const url = `${this.apiURL}/api/macoplados/stop`;
		return this._http.put<reatailContainer>(url, data, { params });
	}
}
