export interface ApiResponse<T> {
	httpHeaders?: any;
	httpStatusCode: number;
	message?: string;
	otherParams?: any;
	data: T;
	data2?: any;
}
