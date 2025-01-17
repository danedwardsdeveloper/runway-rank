import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText: string;
	cancelText: string;
	color?: 'red' | 'blue' | 'green';
}

export default function ConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText,
	cancelText,
	color = 'red',
}: ConfirmationModalProps) {
	const colorClasses = {
		red: 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600',
		blue: 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600',
		green: 'bg-green-600 hover:bg-green-500 focus-visible:outline-green-600',
	};

	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-10">
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
			/>
			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<DialogPanel
						transition
						className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
					>
						<div>
							<div
								className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-${color}-100`}
							>
								<ExclamationTriangleIcon
									aria-hidden="true"
									className={`h-6 w-6 text-${color}-600`}
								/>
							</div>
							<div className="mt-3 text-center sm:mt-5">
								<DialogTitle
									as="h3"
									className="text-base font-semibold leading-6 text-gray-900"
								>
									{title}
								</DialogTitle>
								<div className="mt-2">
									<p className="text-sm text-gray-500">{message}</p>
								</div>
							</div>
						</div>
						<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
							<button
								type="button"
								onClick={onConfirm}
								className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:col-start-2 ${colorClasses[color]}`}
							>
								{confirmText}
							</button>
							<button
								type="button"
								data-autofocus
								onClick={onClose}
								className={`
									flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm
									bg-gradient-to-tr from-orange-600 via-red-500 to-rose-600
									ring-1 ring-red-600
									hover:ring-red-700
									hover:from-orange-700 hover:via-red-600 hover:to-rose-700
									focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600
									disabled:opacity-50
								  `}
							>
								{cancelText}
							</button>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}
