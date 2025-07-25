export interface ActionEvent {
	action: 'add' | 'edit' | 'delete' | 'enable' | 'assign' | 'assignType';
	success: boolean;
	data?: any;
	id?: number;
}
