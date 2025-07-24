import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tenant } from '../models/tenant.model';
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
}
