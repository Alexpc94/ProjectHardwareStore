import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListStaffComponent } from './components/staff/list-staff/list-staff.component';
import { ListRolesComponent } from './components/roles/list-roles/list-roles.component';
const routes: Routes = [
	{ path: 'staff', component: ListStaffComponent },
	{ path: 'roles', component: ListRolesComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class StaffRoutingModule {}
