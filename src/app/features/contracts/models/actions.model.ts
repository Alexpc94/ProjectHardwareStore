export interface ActionEvent {
	action: 'add' | 'edit' | 'delete' | 'enable' | 'stop';
	success: boolean;
	data?: any;
	id?: number | string;
}
