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
}
