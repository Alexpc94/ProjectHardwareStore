import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
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
	getToken(xlogin: string, xpass: string): Observable<Data> {
		const body = {
			username: xlogin,
			password: xpass,
		};
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
			}),
		};
		return this.http.post<Data>(`${this.apiURL}/auth/log-in`, body, httpOptions);
	}

	//datos de prueba
	// setLogout(): Observable<any> {
	// 	// Simulación: elimina al "currentUser" del localStorage
	// 	localStorage.removeItem('currentUser');
	// 	// Simula una respuesta exitosa del servidor
	// 	return of({ success: true, message: 'Logged out successfully' });
	// }

	// Cerrar sesión
	// setLogout(): Observable<any> {
	// 	const httpOptions = {
	// 		headers: new HttpHeaders({
	// 			'Content-Type': 'application/json',
	// 			Accept: 'application/json',
	// 		}),
	// 	};
	// 	return this.http.post(`${this.apiURL}/logout`, {}, httpOptions);
	// }
	//datos de prueba

	// Obtener el token del usuario actual
	getToken2(): string {
		const session = this.getCurrentSession<Data>('currentUser');
		return session?.otherParams.token ?? '';
	}

	// Establecer la sesión en storage
	setCurrentSession(sessionName: string, data: string): void {
		sessionStorage.setItem(sessionName, data);
	}

	// setCurrentSession(sessionName: string, data: Data): void {
	// 	sessionStorage.setItem(sessionName, JSON.stringify(data));
	// }

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
			console.log(`✅ Sesión "${sessionName}" eliminada.`);
		}
	}
}
