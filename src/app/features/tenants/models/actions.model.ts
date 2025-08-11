export interface ActionEvent {
	action: 'add' | 'edit' | 'editLocation' | 'delete' | 'enable' | 'assign' | 'assignType';
	success: boolean;
	data?: any;
	id?: number;
}
