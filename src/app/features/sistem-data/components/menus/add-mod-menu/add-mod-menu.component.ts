
import { Component, EventEmitter, Output, ViewChild, inject, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActionEvent } from '../../../models/Actions.model';
import { NgxSelectModule } from 'ngx-select-ex';
import { ValidationComponent } from 'src/app/shared/components/validation/validation.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CustomValidators } from 'src/app/shared/components/validation/custom-validators';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';

import { iconos } from '../../../models/iconos.model';
import { menus } from '../../../models/menus.model';
import { MenusService } from '../../../services/menus.service';

@Component({
  selector: 'app-add-mod-menu',
  imports: [ReactiveFormsModule, ValidationComponent, ConfirmDialogComponent,NgxSelectModule],
  providers: [DatePipe],
  templateUrl: './add-mod-menu.component.html',
  styleUrl: './add-mod-menu.component.css'
})
export class AddModMenuComponent implements OnInit  {
  @Output() save = new EventEmitter<ActionEvent>();
@Input() menus: menus[] = [];
@Input() iconos: iconos[] = [];
  @ViewChild('confirmModal') confirmModal!: ConfirmDialogComponent;

  private _getMenuService = inject(MenusService);
  _formBuilder = inject(FormBuilder);
  _datePipe = inject(DatePipe);
  form!: FormGroup;
  get f() {
    return this.form.controls;
  }
  get selectedIcon(): iconos | undefined {
      const selectedPath = this.form?.get('icono')?.value;

      return this.iconos.find(
        (item) => item.icono === selectedPath
      );
  }
  showModal: boolean = false;
  submitted: boolean = false;
  iconDropdownOpen = false;
  selectedData?: menus;
  selectedID?: number;
  

  ngOnInit() {
    this.buildForm();
  }
  getIcon(photo: string): string {
	  return photo.startsWith('/') ? photo : '/' + photo;
	}
  
  selectIcon(item: iconos): void {
      const iconControl = this.form.get('icono');

      iconControl?.setValue(item.icono);
      iconControl?.markAsDirty();
      iconControl?.markAsTouched();

      this.iconDropdownOpen = false;
  }
  open(selectedID: number, menuStatus: boolean): void {
    
    if (menuStatus) {
      this._getMenuService.getMenus(menuStatus).subscribe((menus) => {
        this.selectedID = selectedID; // Primero asignas el ID
        this.menus = menus;
        this.selectedData =  this.menus.find(r => r.id_menu === this.selectedID);
        console.log(this.selectedData);
        
        this.patchForm();
      });
    }
    
    this.showModal = true;
  }

  close(): void {
      this.form.reset({
        name: '',
        description: '',
        icono: '',
        type_menu: ''
      });

      this.selectedID = undefined;
      this.selectedData = undefined;
      this.iconDropdownOpen = false;
      this.submitted = false;
      this.showModal = false;
  }

  buildForm(): void {
    this.form = this._formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
      icono: new FormControl('', [Validators.required]),
      type_menu: new FormControl('', Validators.required),
      
    });
  }

  patchForm(): void {
    //console.log(this.selectedData);
    if (this.selectedData) {
      
      this.form.patchValue({
        
        name: this.selectedData.name,
        description: this.selectedData.description,

        // Del backend "icon" pasa al control "icono"
        icono: this.selectedData.icon,

        type_menu: this.selectedData.type_menu
        
      });
    }
  }

  onPreSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;
    this.confirmModal.show();
  }

  capitalizeWords(str: string | undefined | null): string {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  saveData(): void {
    const {
      name,
      description,
      icono,
      type_menu
    } = this.form.getRawValue();

    const data: Partial<menus> = {
      name: this.capitalizeWords(name),
      description: this.capitalizeWords(description),

      // El formulario usa "icono", pero el modelo menus usa "icon"
      icon: icono,

      // Conservamos exactamente el tipo seleccionado
      type_menu: type_menu
    };

    console.log('Datos enviados al backend:', data);

    if (this.selectedID) {
      this._getMenuService.updateMenu(this.selectedID, data).subscribe({
        next: (response) => {
          this.save.emit({
            action: 'edit',
            success: true,
            data: response?.data ?? data,
            id: this.selectedID
          });

          this.close();
        },

        error: (error) => {
          if (this.handleCedulaError(error)) return;

          this.save.emit({
            action: 'edit',
            success: false
          });
        }
      });

    } else {
      const createData: menus = {
        id_menu: 0,
        name: this.capitalizeWords(name),
        description: this.capitalizeWords(description),

        // Ruta seleccionada, por ejemplo assets/icons/...
        icon: icono,

        // Tipo seleccionado, por ejemplo type one
        type_menu: type_menu,

        status: true
      };

      console.log('Menú que se creará:', createData);

      this._getMenuService.createMenu(createData).subscribe({
        next: (response) => {
          this.save.emit({
            action: 'add',
            success: true,

            // Antes enviabas "data", que no contenía todos los campos
            data: response?.data ?? createData
          });

          this.close();
        },

        error: (error) => {
          if (this.handleCedulaError(error)) return;

          this.save.emit({
            action: 'add',
            success: false
          });
        }
      });
    }
  }

  private handleCedulaError(error: any): boolean {
    const mensaje =
      typeof error?.error === 'string'
        ? error.error
        : typeof error?.error?.message === 'string'
        ? error.error.message
        : '';
    if (mensaje.includes('La Cédula ya Existe.')) {
      this.form.get('cedula')?.setErrors({ datoExistente: true });
      return true;
    }
    return false;
  }


}
