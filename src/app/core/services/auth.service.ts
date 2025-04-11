import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Data } from './../models/data.interface';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private apiURL = `${environment.apiUrl}`;
	private http = inject(HttpClient);

	// Obtener token de autenticación
	// getToken(xlogin: string, xpass: string): Observable<Data> {
	// 	const body = new HttpParams().set('email', xlogin).set('password', xpass);
	// 	const httpOptions = {
	// 		headers: new HttpHeaders({
	// 			'Content-Type': 'application/x-www-form-urlencoded',
	// 			Accept: 'application/json',
	// 		}),
	// 	};
	// 	return this.http.post<Data>(`${this.apiURL}/login`, body.toString(), httpOptions);
	// }

	// Cerrar sesión
	setLogout(): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			}),
		};
		return this.http.post(`${this.apiURL}/logout`, {}, httpOptions);
	}

	// Obtener el token del usuario actual
	getToken2(): string {
		const session = this.getCurrentSession<Data>('currentUser');
		return session?.token ?? '';
	}

	// Establecer la sesión en storage
	// setCurrentSession(sessionName: string, data: Data): void {
	// 	sessionStorage.setItem(sessionName, JSON.stringify(data));
	// }
	getToken(xlogin: string, xpass: string): Observable<Data> {
		return this.http.get<Data>('assets/mock-login.json');
	}
	setCurrentSession(sessionName: string, data: string): void {
		sessionStorage.setItem(sessionName, data);
	}

	// Obtener la sesión desde el storage
	getCurrentSession<T = any>(sessionName: string): T | null {
		const data = sessionStorage.getItem(sessionName);
		return data ? (JSON.parse(data) as T) : null;
	}

	// Verificar si el usuario está autenticado
	isAuthenticated(sessionName: string): boolean {
		return !!sessionStorage.getItem(sessionName);
	}

	// Eliminar la sesión
	deleteCurrentSession(sessionName: string): void {
		if (this.isAuthenticated(sessionName)) {
			sessionStorage.removeItem(sessionName);
		}
	}
}
