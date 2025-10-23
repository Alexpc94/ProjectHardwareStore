const DEBOUNCE_DELAY = 1000;
let debounceTimer: any;

export function dateFormatChange(event: Event, setter: (d: Date) => void): void {
	const input = event.target as HTMLInputElement;
	clearTimeout(debounceTimer);

	debounceTimer = setTimeout(() => {
		const [year, month, day] = input.value.split('-').map(Number);
		const localDate = new Date(year, month - 1, day);
		setter(localDate);
	}, DEBOUNCE_DELAY);
}
