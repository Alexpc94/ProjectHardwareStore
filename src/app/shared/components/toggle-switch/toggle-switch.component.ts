import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-toggle-switch',
	standalone: true,
	templateUrl: './toggle-switch.component.html',
})
export class ToggleSwitchComponent {
	@Input() checked = false;
	@Input() disabled = false;

	@Output() checkedChange = new EventEmitter<boolean>();

	onToggle(event: Event) {
		const input = event.target as HTMLInputElement;
		this.checkedChange.emit(input.checked);
	}
}
