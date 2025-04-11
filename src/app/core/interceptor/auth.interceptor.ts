import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';

export const authInterceptorFn: HttpInterceptorFn = (
	req: HttpRequest<any>,
	next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
	const authService = inject(AuthService);
	const router = inject(Router);

	const token = authService.getToken2();

	const cloned = authService.isAuthenticated('currentUser')
		? req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`,
				},
		  })
		: req;

	return next(cloned).pipe(
		catchError((err: HttpErrorResponse) => {
			if (err.status === 403) {
				authService.deleteCurrentSession('currentUser');
				router.navigateByUrl('/auth/sign-in');
			}
			return throwError(() => err);
		}),
	);
};
