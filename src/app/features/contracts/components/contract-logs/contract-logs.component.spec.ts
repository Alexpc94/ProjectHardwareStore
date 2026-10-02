import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { of } from 'rxjs';

import { ContractLogsComponent } from './contract-logs.component';
import { ContractService } from '../../services/contract.service';

describe('ContractLogsComponent', () => {
	let component: ContractLogsComponent;
	let fixture: ComponentFixture<ContractLogsComponent>;
	let service: jasmine.SpyObj<ContractService>;
	const log = {
		id: 1,
		momento_transaccion: '2026-09-22T10:30:00',
		usuario_id: 7,
		person: { firstName: 'Ana', secondName: 'Perez', name: 'Lopez', cedula: '123', telephone: '456' },
		tipo_operacion: 'UPDATE',
		nombre_tabla: 'mcontratos',
		registro_id: 'C-10',
		descripcion: 'Cambio de monto del contrato',
		datos_anteriores: JSON.stringify({ monto: 100, detalle: { activo: false, rubros: ['Anterior'] } }),
		datos_nuevos: { monto: 200, detalle: { activo: true, rubros: ['Posterior'] } },
	};

	beforeEach(async () => {
		service = jasmine.createSpyObj('ContractService', ['getLogs']);
		service.getLogs.and.returnValue(of({ content: [log], totalElements: 1 } as any));
		await TestBed.configureTestingModule({
			imports: [ContractLogsComponent, AngularSvgIconModule.forRoot()],
			providers: [provideHttpClient(), provideHttpClientTesting(), { provide: ContractService, useValue: service }],
		}).compileComponents();
		fixture = TestBed.createComponent(ContractLogsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('sends independent date filters, search, operation and pagination to the service', fakeAsync(() => {
		component.handlePageChange(3);
		fixture.detectChanges();
		const start = new Date(2026, 8, 1);
		const end = new Date(2026, 8, 22);
		fixture.debugElement.query(By.css('#dateFrom')).componentInstance.config.onChange([start]);
		fixture.debugElement.query(By.css('#dateTo')).componentInstance.config.onChange([end]);
		const select: HTMLSelectElement = fixture.nativeElement.querySelector('#type');
		select.value = 'UPDATE';
		select.dispatchEvent(new Event('change'));
		const search: HTMLInputElement = fixture.nativeElement.querySelector('input[name="search"]');
		search.value = 'Contrato';
		search.dispatchEvent(new Event('input'));
		tick(500);
		fixture.detectChanges();
		expect(service.getLogs).toHaveBeenCalledWith(
			'UPDATE',
			'contrato',
			{ page: 0, size: 10, sort: ['id,ASC'] },
			start,
			end,
		);
		component.handlePageChange(2);
		fixture.detectChanges();
		expect(service.getLogs.calls.mostRecent().args[2].page).toBe(1);
		component.handleItemsPerPageChange(20);
		fixture.detectChanges();
		expect(service.getLogs.calls.mostRecent().args[2]).toEqual({ page: 0, size: 20, sort: ['id,ASC'] });
	}));

	it('opens previous and posterior snapshots separately with nested JSON', () => {
		fixture.nativeElement.querySelector('[aria-label="Ver datos anteriores"]').click();
		fixture.detectChanges();
		let modal: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
		expect(modal.querySelectorAll('pre').length).toBe(1);
		expect(JSON.parse(modal.querySelector('pre')!.textContent!)).toEqual(JSON.parse(log.datos_anteriores));
		modal.querySelector<HTMLButtonElement>('[aria-label="Cerrar"]')!.click();
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
		expect(component.contractLogViewModal.selectedData).toBeNull();
		fixture.nativeElement.querySelector('[aria-label="Ver datos posteriores"]').click();
		fixture.detectChanges();
		modal = fixture.nativeElement.querySelector('[role="dialog"]');
		expect(modal.querySelectorAll('pre').length).toBe(1);
		expect(JSON.parse(modal.querySelector('pre')!.textContent!)).toEqual(log.datos_nuevos);
	});

	it('opens only the full description from the truncated table text', () => {
		const button: HTMLButtonElement = fixture.nativeElement.querySelector('[title="Ver descripcion completa"]');
		expect(button.textContent?.trim()).toBe('Cambio de monto del ...');
		button.click();
		fixture.detectChanges();
		const modal: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
		expect(modal.querySelector('p')?.textContent?.trim()).toBe(log.descripcion);
		expect(modal.querySelectorAll('p').length).toBe(1);
		expect(modal.querySelectorAll('pre').length).toBe(0);
		modal.querySelector<HTMLButtonElement>('[aria-label="Cerrar"]')!.click();
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
	});

	it('shows the complete transaction and both snapshots from actions', () => {
		fixture.nativeElement.querySelector('[aria-label="Ver detalle de transaccion"]').click();
		fixture.detectChanges();
		const modal: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
		for (const value of ['22/09/2026', 'Ana', 'UPDATE', 'mcontratos', 'C-10', log.descripcion]) {
			expect(modal.textContent).toContain(value);
		}
		expect(modal.querySelectorAll('pre').length).toBe(2);
	});

	it('keeps missing and malformed snapshots readable without breaking the list', () => {
		service.getLogs.and.returnValue(
			of({ content: [{ ...log, datos_anteriores: null, datos_nuevos: '{invalid' }], totalElements: 1 } as any),
		);
		component.loadLogs();
		component.ListLogsH(log.id);
		fixture.detectChanges();
		const modal: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
		expect(modal.textContent).toContain('Sin datos registrados');
		expect(modal.textContent).toContain('{invalid');
		expect(component.logs().length).toBe(1);
	});
});
