type ErrorElementProps = {
	error: string;
};

export default function ErrorElement({ error }: ErrorElementProps) {
	return (
		<div className="flex justify-center items-center min-h-screen">
			<h1 className="text-lg font-red-500 mr-2">{error}</h1>
		</div>
	);
}
