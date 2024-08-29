export default function cleanTailwindClasses(...classes: string[]): string {
	return classes.filter(Boolean).join(' ');
}
