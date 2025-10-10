import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tenant, TenantResponse } from '../models/tenant.model';
import { Pageable, PaginatedResponse } from '../models/pageable.model';

@Injectable({
	providedIn: 'root',
})
export class TenantService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);

	getTenants(status: boolean, buscar: string, pageable: Pageable): Observable<PaginatedResponse<tenant>> {
		const url = `${this.apiURL}/api/inquilinos/${status}/${buscar}`;
		const params = {
			page: pageable.page,
			size: pageable.size,
			sort: pageable.sort,
		};
		return this._http.get<PaginatedResponse<tenant>>(url, { params });
	}

	getAllTenants(): Observable<TenantResponse> {
		const url = `${this.apiURL}/api/inquilinos/true`;
		return this._http.get<TenantResponse>(url);
	}

	getTenantById(id: number): Observable<any> {
		const url = `${this.apiURL}/api/inquilinos/id/${id}`;
		return this._http.get<{ data: any }>(url).pipe(map((response) => response));
	}

	modStatus(xid: number): Observable<any> {
		const url = `${this.apiURL}/api/inquilinos/${xid}`;
		return this._http.delete<tenant>(url);
	}

	addData(data: FormData): Observable<tenant> {
		const url = `${this.apiURL}/api/inquilinos`;
		return this._http.post<tenant>(url, data);
	}

	modData(data: FormData, id: number): Observable<tenant> {
		const url = `${this.apiURL}/api/inquilinos/${id}`;
		return this._http.put<tenant>(url, data);
	}
	updateLocationData(data: FormData, id: number): Observable<tenant> {
		const url = `${this.apiURL}/api/inquilinos/gps8/${id}`;
		return this._http.put<tenant>(url, data);
	}
}
