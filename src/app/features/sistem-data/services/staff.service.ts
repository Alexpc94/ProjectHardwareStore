import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { staff } from '../models/staff.model';

@Injectable({
	providedIn: 'root',
})
export class StaffService {
	private apiURL = `${environment.apiUrl}`;
	_http = inject(HttpClient);

	getUsers(status: boolean, type: string): Observable<staff[]> {
		const url = `${this.apiURL}/api/persons/${status}/${type}`;
		return this._http.get<{ data: staff[] }>(url).pipe(map((response) => response.data));
	}
	getUserById(id: number): Observable<any> {
		const url = `${this.apiURL}/api/persons/id/${id}`;
		return this._http.get<{ data: any }>(url).pipe(map((response) => response));
	}

	addData(user: FormData): Observable<staff> {
		const url = `${this.apiURL}/api/persons`;
		return this._http.post<staff>(url, user);
	}
	modData(user: FormData, id: number): Observable<staff> {
		const url = `${this.apiURL}/api/persons/${id}`;
		return this._http.put<staff>(url, user);
	}
	modStatus(id: number): Observable<any> {
		const url = `${this.apiURL}/api/persons/${id}`;
		return this._http.delete<staff>(url);
	}
	modTipoper(id: number, type: string): Observable<any> {
		const url = `${this.apiURL}/api/persons/tipoper/${id}`;
		return this._http.put<staff>(url, `"${type}"`, {
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
