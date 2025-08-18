import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Pageable, PaginatedResponse } from '../models/pageable.model';
import { sector } from '../models/sector.model';

@Injectable({
	providedIn: 'root',
})
export class SectorService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);

	getSectors(status: number, buscar: string, pageable: Pageable): Observable<PaginatedResponse<sector>> {
		const url = `${this.apiURL}/api/sectores/dto/${status}/${buscar}`;
		const params = {
			page: pageable.page,
			size: pageable.size,
			sort: pageable.sort,
		};
		return this._http.get<PaginatedResponse<sector>>(url, { params });
	}

	modStatus(xid: number, xestadoactual: number): Observable<sector> {
		const url = `${this.apiURL}/api/sectores/${xestadoactual}/${xid}`;
		return this._http.delete<sector>(url);
	}

	addData(data: sector): Observable<sector> {
		const url = `${this.apiURL}/api/sectores`;
		return this._http.post<sector>(url, data);
	}

	modData(data: sector, cods: number): Observable<sector> {
		const url = `${this.apiURL}/api/sectores/${cods}`;
		return this._http.put<sector>(url, data);
	}
}
