export function decinalFormat(value: number | string | undefined): string {
	const num = Number(value ?? 0);

	if (isNaN(num)) return '0.00';

	return num.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}
