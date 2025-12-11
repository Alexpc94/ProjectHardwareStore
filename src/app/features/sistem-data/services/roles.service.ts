import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { roles } from '../models/roles.model';

@Injectable({
	providedIn: 'root',
})
export class RolesService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);

	getRoles(status: boolean = true): Observable<roles[]> {
		const url = `${this.apiURL}/api/role/${status}`;
		return this._http.get<{ data: roles[] }>(url).pipe(map((response) => response.data));
	}

	assignRole(data: any): Observable<any> {
		const url = `${this.apiURL}/api/role/grant`;
		return this._http.post<any>(url, data);
	}

	deleteRole(idPerson: number, idRol: number): Observable<any> {
		const url = `${this.apiURL}/api/role/revoke/${idRol}/${idPerson}`;
		return this._http.delete<any>(url);
	}

	// Crear un nuevo rol
	createRole(data: roles): Observable<any> {
		const url = `${this.apiURL}/api/role`;
		return this._http.post<any>(url, data);
	}
		// Actualizar un rol existente
	updateRole(id: number, data: roles): Observable<any> {
		const url = `${this.apiURL}/api/role/${id}`;
		return this._http.put<any>(url, data);
	}

	// Eliminar un rol por su id
	removeRole(id: number): Observable<any> {
		const url = `${this.apiURL}/api/role/${id}`;
		return this._http.delete<any>(url);
	}
	
}
