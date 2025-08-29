export interface ActionEvent {
	action: 'add' | 'edit' | 'delete' | 'enable';
	success: boolean;
	data?: any;
	id?: number | string;
}
