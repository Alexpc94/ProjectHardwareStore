export function capitalizeWords(str: string | undefined | null): string {
	if (!str) return '';
	return str
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function toLowerCase(str: string | undefined | null): string {
	if (!str) return '';
	return str.toLowerCase();
}

export function toUpperCase(str: string | undefined | null): string {
	if (!str) return '';
	return str.toUpperCase();
}
