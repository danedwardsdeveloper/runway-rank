import { useApp } from '../contexts/AppContext';

export default function Message() {
	const { appData } = useApp();

	const defaultMessage = 'Please sign in or create an account to vote';

	const getColorClass = (color: string) => {
		const validColors = [
			'red',
			'yellow',
			'green',
			'blue',
			'indigo',
			'purple',
			'pink',
		];
		return validColors.includes(color) ? `text-${color}-500` : 'text-black';
	};

	const colorClass = appData.message.colour
		? getColorClass(appData.message.colour)
		: 'text-black';

	return (
		<h1 className={`${colorClass} text-center mt-4 text-lg`}>
			{appData.message.content || defaultMessage}
		</h1>
	);
}
