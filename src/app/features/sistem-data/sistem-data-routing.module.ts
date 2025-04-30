import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListStaffComponent } from './components/staff/list-staff/list-staff.component';

const routes: Routes = [{ path: 'staff', component: ListStaffComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class StaffRoutingModule {}
