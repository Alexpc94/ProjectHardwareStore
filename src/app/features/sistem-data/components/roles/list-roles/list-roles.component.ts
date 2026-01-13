import { Component, OnInit, signal, computed, inject, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesService } from '../../../services/roles.service';
import { roles } from '../../../models/roles.model';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { AddModRolComponent } from '../add-mod-rol/add-mod-rol.component';
import { ActionEvent } from '../../../models/Actions.model';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TableFilterService } from '../../../services/table-filter.service';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';

@Component({
  selector: 'app-list-roles',
  standalone: true,
  imports: [CommonModule, SortHeaderComponent, ToggleSwitchComponent,AddModRolComponent,AngularSvgIconModule,TableFooterComponent,ConfirmChangeStatusComponent,],
  templateUrl: './list-roles.component.html',
  styleUrl: './list-roles.component.css'
})
export class ListRolesComponent implements OnInit {

  private rolesService = inject(RolesService);
  private _filterService = inject(TableFilterService);
  
  @Output() save = new EventEmitter<ActionEvent>();
  @Input() rol!: roles;

@ViewChild(AddModRolComponent) rolModal!: AddModRolComponent;
@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

  roles=signal<roles[]>([]);
  totalRoles = computed(() => this.roles().length);
  itemsPerPage = signal(5);
  currentPage = signal(1);
  isActive: boolean = true;
  alertType: any;
  selectedRol: any;
  selectedID: any = null;
  addRol(): void {
      
		this.addUpdateRol();
	
  } 
  addUpdateRol(rolID?: number) {
		console.log(rolID);
		this.selectedID = rolID ?? null;
		this.rolModal.open(this.selectedID,this.isActive);
	}
  
  openModalToUpdateStatus(id: number, name: string, status: boolean) {
		this.selectedRol = { id, name, status };
		this.confirmDialog.message = status ? 'dar de baja' : 'habilitar';
		this.confirmDialog.show();
	}

	changeStatus() {
		if (!this.selectedRol) return;
		const { id, status } = this.selectedRol;
		this.rolesService.removeRole(id).subscribe({
			next: (response) => {
				// this.save.emit({ action: status ? 'delete' : 'enable', success: true, id: id }) esta linea la borre y la cambie por loadroles porque en vez de guardar directamente lo actualizo ahi
				this.loadRoles(this.isActive);
				this.showAlert('success');
			},
			error: (err) => {
				console.error('Error:', err);
				this.showAlert('error');
			},
		});
		this.selectedRol = null;
	}

  ngOnInit(): void {
    this.loadRoles(true);
  }
  onToggleChange(status: boolean) {
		this.loadRoles(status);
	}
  loadRoles(status: boolean) {
    this.isActive = status;
    this.rolesService.getRoles(status).subscribe({
      next: (data) => {
        this.roles.set(data) ;
        this.currentPage.set(1); // to restart pagination
      },
      error: (err) => {
        console.error('Error cargando roles', err);
   
      }
    });
  }

  filteredData = computed(() => {
		const search = this._filterService.searchField().toLowerCase().trim();

		return this.roles().filter((data) => {
			const fullName = `${data.name}`.toLowerCase();
			

			return (
				fullName.includes(search) 
			);
		});
	});

  paginatedData = computed(() => {
		const start = (this.currentPage() - 1) * this.itemsPerPage();
		const end = start + this.itemsPerPage();
		return this.filteredData().slice(start, end);
	});


  
  onSearchChange(value: Event) {
		const input = value.target as HTMLInputElement;
		this._filterService.searchField.set(input.value);
		this.currentPage.set(1);
	}

  
	handlePageChange(page: number) {
		this.currentPage.set(page);
	}

	handleItemsPerPageChange(count: number) {
		this.itemsPerPage.set(count);
		this.currentPage.set(1);
	}

	handleDataSave(res: any) {
		// console.log('User save response:', res);
		switch (res.action) {
			case 'add':
				this.loadRoles(this.isActive);
				break;
			case 'edit':
				this.roles.update((roles) => roles.map((rol) => (rol.id_role === res.id ? { ...rol, ...res.data } : rol)));
				break;
			case 'delete':
			case 'enable':
				
     			 break;
	
		}
	}



  showAlert(type: 'success' | 'error' | 'info') {
		this.alertType = '';
		setTimeout(() => {
			this.alertType = type;
		}, 0);
	 }
  addModSave(res: any) {
		//console.log('let me see:', res);
		if (!res.success) return this.showAlert('error');
		this.save.emit(res);
		this.showAlert('success');
	}
}
