import { Component } from '@angular/core';
import { DatePipe, JsonPipe, NgTemplateOutlet } from '@angular/common';

@Component({
	selector: 'app-view-contract-log',
	imports: [DatePipe, JsonPipe, NgTemplateOutlet],
	templateUrl: './view-contract-log.component.html',
	styleUrl: './view-contract-log.component.css',
})
export class ViewContractLogComponent {
	showModal: boolean = false;
	selectedData: any = null;
	modalType: 'previous' | 'current' | 'detail' | 'description' = 'detail';

	open(log: any, type: 'previous' | 'current' | 'detail' | 'description' = 'detail') {
		this.selectedData = log;
		this.modalType = type;
		this.showModal = true;
	}

	close() {
		this.showModal = false;
		this.selectedData = null;
	}
}
