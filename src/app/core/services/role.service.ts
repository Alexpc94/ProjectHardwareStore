import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleService {
	private roleSubject = new BehaviorSubject<string>('');
	public role$ = this.roleSubject.asObservable();

	setRole(role: string) {
		this.roleSubject.next(role);
	}

	getCurrentRole(): string {
		return this.roleSubject.value;
	}
}
