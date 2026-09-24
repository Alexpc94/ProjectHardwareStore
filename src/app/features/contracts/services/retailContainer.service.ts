import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { retailContainer } from '../models/retailContainer.model';
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
	): Observable<PaginatedResponse<retailContainer>> {
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
		return this._http.get<PaginatedResponse<retailContainer>>(url, { params });
	}

	getRContainersById(coda: string): Observable<any> {
		const params = new HttpParams().set('coda', coda);
		const url = `${this.apiURL}/api/macoplados/data`;
		return this._http.get<{ data: any }>(url, { params }).pipe(map((response) => response));
	}

	addRContainerData(data: retailContainer): Observable<ApiResponse<retailContainer>> {
		const url = `${this.apiURL}/api/macoplados`;
		return this._http.post<ApiResponse<retailContainer>>(url, data);
	}

	modContractStatus(coda: string, idresponsable: number): Observable<retailContainer> {
		const params = new HttpParams().set('coda', coda).set('idresponsable', idresponsable);
		const url = `${this.apiURL}/api/macoplados`;
		return this._http.delete<retailContainer>(url, { params });
	}

	stopContainerContract(coda: string, data: any): Observable<retailContainer> {
		const params = new HttpParams().set('coda', coda);
		const url = `${this.apiURL}/api/macoplados/stop`;
		return this._http.put<retailContainer>(url, data, { params });
	}

	stopRContainerData(coda: string, data: any): Observable<retailContainer> {
		const params = new HttpParams().set('coda', coda);
		const url = `${this.apiURL}/api/macoplados`;
		return this._http.put<retailContainer>(url, data, { params });
	}
}
