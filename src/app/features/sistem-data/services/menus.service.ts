import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { menus } from '../models/menus.model';
import { iconos } from '../models/iconos.model';

@Injectable({
	providedIn: 'root',
})
export class MenusService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);

	getMenus(status: boolean = true): Observable<menus[]> {
		const url = `${this.apiURL}/api/menu/${status}`;
		return this._http.get<{ data: menus[] }>(url).pipe(map((response) => response.data));
	}
	getIconos(): Observable<iconos[]> {
		const url = `${this.apiURL}/api/iconos`;
	
		//return this._http.get<{ data: iconos[] }>(url).pipe(map((response) => response.data));
		return this._http.get<iconos[]>(url);
	}
	// Crear un nuevo rol
	createMenu(data: menus): Observable<any> {
		const url = `${this.apiURL}/api/menu`;
		return this._http.post<any>(url, data);
	}
		// Actualizar un rol existente
	updateMenu(id: number, data: Partial<menus>): Observable<any> {
		const url = `${this.apiURL}/api/menu/${id}`;
		return this._http.put<any>(url, data);
	}

	// Eliminar un rol por su id
	removeMenu(id: number): Observable<any> {
		const url = `${this.apiURL}/api/menu/${id}`;
		return this._http.delete<any>(url);
	}
	
}
