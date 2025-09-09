import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BSector } from '../models/BSectort.model';
import { ApiResponse } from '../models/response.model';
import { Pageable, PaginatedResponse } from '../models/pageable.model';

@Injectable({
	providedIn: 'root',
})
export class BusinessSectorsService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);

	getBusinessSectors(status: number, buscar: string, pageable: Pageable): Observable<PaginatedResponse<BSector>> {
		const url = `${this.apiURL}/api/rubros/${status}/${buscar}`;
		const params = {
			page: pageable.page,
			size: pageable.size,
			sort: pageable.sort,
		};
		return this._http.get<PaginatedResponse<BSector>>(url, { params });
	}

	getBusinessSectorsSon(status: number, codpadre: string): Observable<PaginatedResponse<BSector>> {
		const buscar = ' ';
		const url = `${this.apiURL}/api/rubros/${codpadre}/${status}/${buscar}`;
		const params = {
			sort: ['codc,ASC'],
		};
		return this._http.get<PaginatedResponse<BSector>>(url, { params });
	}

	modStatus(xid: string): Observable<ApiResponse<BSector>> {
		const url = `${this.apiURL}/api/rubros/${xid}`;
		return this._http.delete<ApiResponse<BSector>>(url);
	}

	addBsectorData(data: BSector): Observable<ApiResponse<BSector>> {
		const url = `${this.apiURL}/api/rubros`;
		return this._http.post<ApiResponse<BSector>>(url, data);
	}

	modBsectorData(data: BSector, codc?: string): Observable<BSector> {
		const url = `${this.apiURL}/api/rubros/${codc}`;
		return this._http.put<BSector>(url, data);
	}

	getBusinessSectorById(codc: string): Observable<any> {
		const url = `${this.apiURL}/api/rubros/${codc}`;
		return this._http.get<{ data: any }>(url).pipe(map((response) => response));
	}

	getListBsectors(): Observable<BSector[]> {
		const url = `${this.apiURL}/api/padres/rubros`;
		return this._http.get<{ data: BSector[] }>(url).pipe(map((response) => response.data));
	}
}
