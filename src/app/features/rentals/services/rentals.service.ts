import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Pageable, PaginatedResponse } from '../models/pageable.model';
import { sector } from '../models/sector.model';
import { section } from '../models/section.model';
import { ownership } from '../models/ownership.model';

@Injectable({
	providedIn: 'root',
})
export class RentalService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);
	selectedId = signal<number>(0);
	view = signal<'all' | 'sectores' | 'secciones' | 'predios'>('all');

	getSectors(status: number, buscar: string, pageable: Pageable): Observable<PaginatedResponse<sector>> {
		const url = `${this.apiURL}/api/sectores/dto/${status}/${buscar}`;
		const params = {
			page: pageable.page,
			size: pageable.size,
			sort: pageable.sort,
		};
		return this._http.get<PaginatedResponse<sector>>(url, { params });
	}

	getListSectors(): Observable<PaginatedResponse<sector>> {
		const buscar = ' ';
		const url = `${this.apiURL}/api/sectores/dto/1/${buscar}`;
		const params = {
			sort: ['cods,ASC'],
		};
		return this._http.get<PaginatedResponse<sector>>(url, { params });
	}

	modStatus(xid: number, xestadoactual: number): Observable<sector> {
		const url = `${this.apiURL}/api/sectores/${xestadoactual}/${xid}`;
		return this._http.delete<sector>(url);
	}

	addSectorData(data: sector): Observable<sector> {
		const url = `${this.apiURL}/api/sectores`;
		return this._http.post<sector>(url, data);
	}

	modSectorData(data: sector, cods: number): Observable<sector> {
		const url = `${this.apiURL}/api/sectores/${cods}`;
		return this._http.put<sector>(url, data);
	}

	setView(view: 'all' | 'sectores' | 'secciones' | 'predios', id: number) {
		this.view.set(view);
		this.selectedId.set(id);
	}

	getSections(
		codsector: number,
		status: number,
		buscar: string,
		pageable: Pageable,
	): Observable<PaginatedResponse<section>> {
		const url = `${this.apiURL}/api/secciones/dto/${status}/${codsector}/${buscar}`;
		const params = {
			page: pageable.page,
			size: pageable.size,
			sort: pageable.sort,
		};
		return this._http.get<PaginatedResponse<section>>(url, { params });
	}

	getListSections(): Observable<PaginatedResponse<section>> {
		const buscar = ' ';
		const url = `${this.apiURL}/api/secciones/dto/1/0/${buscar}`;
		const params = {
			sort: ['cods,ASC'],
		};
		return this._http.get<PaginatedResponse<section>>(url, { params });
	}

	modSectionStatus(xid: number, xestadoactual: number): Observable<sector> {
		const url = `${this.apiURL}/api/secciones/${xestadoactual}/${xid}`;
		return this._http.delete<sector>(url);
	}

	addSectionData(data: section): Observable<section> {
		const url = `${this.apiURL}/api/secciones`;
		return this._http.post<section>(url, data);
	}

	modSectionData(data: section, codsec: number): Observable<section> {
		const url = `${this.apiURL}/api/secciones/${codsec}`;
		return this._http.put<section>(url, data);
	}

	getOwnerships(
		codsec: number,
		status: number,
		buscar: string,
		pageable: Pageable,
	): Observable<PaginatedResponse<ownership>> {
		const url = `${this.apiURL}/api/predios/${status}/${codsec}/${buscar}`;
		const params = {
			page: pageable.page,
			size: pageable.size,
			sort: pageable.sort,
		};
		return this._http.get<PaginatedResponse<ownership>>(url, { params });
	}

	getOwnershipById(codpre: string): Observable<any> {
		const url = `${this.apiURL}/api/predios/${codpre}`;
		return this._http.get<{ data: any }>(url).pipe(map((response) => response));
	}

	getFreeOwnership(): Observable<any> {
		const url = `${this.apiURL}/api/predios/libres`;
		return this._http.get<{ data: any }>(url).pipe(map((response) => response));
	}

	modOwnershipStatus(codpre: string, xestadoactual: number): Observable<ownership> {
		const url = `${this.apiURL}/api/predios/${xestadoactual}/${codpre}`;
		return this._http.delete<ownership>(url);
	}

	addOwnershipData(data: ownership): Observable<ownership> {
		const url = `${this.apiURL}/api/predios`;
		return this._http.post<ownership>(url, data);
	}

	modOwnershipData(data: ownership, codpre?: string): Observable<ownership> {
		const url = `${this.apiURL}/api/predios/${codpre}`;
		return this._http.put<ownership>(url, data);
	}
}
