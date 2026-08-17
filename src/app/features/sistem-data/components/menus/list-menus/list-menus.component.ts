import { Component, OnInit, signal, computed, inject, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusService } from '../../../services/menus.service';
import { menus } from '../../../models/menus.model';
import { iconos } from '../../../models/iconos.model';
import { SortHeaderComponent } from 'src/app/shared/components/sort-header/sort-header.component';
import { ToggleSwitchComponent } from 'src/app/shared/components/toggle-switch/toggle-switch.component';
import { AddModMenuComponent } from '../add-mod-menu/add-mod-menu.component';
import { ActionEvent } from '../../../models/Actions.model';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TableFilterService } from '../../../services/table-filter.service';
import { TableFooterComponent } from 'src/app/shared/components/table-footer/table-footer.component';
import { ConfirmChangeStatusComponent } from 'src/app/shared/components/confirm-change-status/confirm-change-status.component';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-list-menus',
  standalone: true,
  imports: [CommonModule, SortHeaderComponent, ToggleSwitchComponent,AddModMenuComponent,AngularSvgIconModule,TableFooterComponent,ConfirmChangeStatusComponent,],
  templateUrl: './list-menus.component.html',
  styleUrl: './list-menus.component.css'
})
export class ListMenusComponent implements OnInit {

  private menusService = inject(MenusService);
  private _filterService = inject(TableFilterService);
  
  @Output() save = new EventEmitter<ActionEvent>();
  @Input() menu!: menus;
  @Input() icono!: iconos;

@ViewChild(AddModMenuComponent) menuModal!: AddModMenuComponent;
@ViewChild('confirmDialog') confirmDialog!: ConfirmChangeStatusComponent;

  storageUrl = environment.storageUrl;
  menus=signal<menus[]>([]);
  totalMenus = computed(() => this.menus().length);
  itemsPerPage = signal(5);
  currentPage = signal(1);
  isActive: boolean = true;
  alertType: any;
  selectedMenu: any;
  selectedID: any = null;
  addMenu(): void {
		this.addUpdateMenu();
  } 
  addUpdateMenu(menuID ?: number) {
		console.log(menuID);
		this.selectedID = menuID ?? null;
		this.menuModal.open(this.selectedID,this.isActive);
	}

  getIcon(photo: string): string {
	  return photo.startsWith('/') ? photo : '/' + photo;
	}
  iconos = signal<iconos[]>([]);
  loadIconos() {
  this.menusService.getIconos().subscribe({
      next: (data) => {
         console.log('ICONOS RECIBIDOS:', data);
          
         this.iconos.set(data) ;  
  
      },
      error: (err) => {
        console.error('Error cargando roles', err);
   
      }
    });
  }
  loadMenus(status: boolean) {
    this.isActive = status;
    this.menusService.getMenus(status).subscribe({
      next: (data) => {
        this.menus.set(data) ;
        this.currentPage.set(1); // to restart pagination
      },
      error: (err) => {
        console.error('Error cargando roles', err);
   
      }
    });
  }

  openModalToUpdateStatus(id: number, name: string, status: boolean) {
    this.selectedMenu = { id, name, status };
    this.confirmDialog.message = status ? 'dar de baja' : 'habilitar';
    this.confirmDialog.show();
  }

  changeStatus() {
    if (!this.selectedMenu) return;
    const { id, status } = this.selectedMenu;
    this.menusService.removeMenu(id).subscribe({
      next: (response) => {
        // this.save.emit({ action: status ? 'delete' : 'enable', success: true, id: id }) esta linea la borre y la cambie por loadroles porque en vez de guardar directamente lo actualizo ahi
        this.loadMenus(this.isActive);
        this.showAlert('success');
      },
      error: (err) => {
        console.error('Error:', err);
        this.showAlert('error');
      },
    });
    this.selectedMenu = null;
  }

  ngOnInit(): void {
    this.loadMenus(true);
    this.loadIconos();
  }
  onToggleChange(status: boolean) {
    this.loadMenus(status);
  }
  

  filteredData = computed(() => {
    const search = this._filterService.searchField().toLowerCase().trim();

    return this.menus().filter((data) => {
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
        this.loadMenus(this.isActive);
        break;
      case 'edit':
        this.menus.update((menus) => menus.map((menu) => (menu.id_menu === res.id ? { ...menu, ...res.data } : menu)));
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

