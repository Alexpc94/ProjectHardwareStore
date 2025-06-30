export interface ActionEvent {
	action: 'add' | 'edit' | 'delete' | 'enable' | 'assign';
	success: boolean;
	data?: any;
	id?: number;
}
