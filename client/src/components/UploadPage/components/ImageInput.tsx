import { useState, ChangeEvent, DragEvent } from 'react';
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface ImageInputProps {
	onFileChange: (file: File) => void;
}

export default function ImageInput({ onFileChange }: ImageInputProps) {
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const validateFile = (file: File): string | null => {
		const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			return 'Invalid file type. Please upload a PNG, JPG, or WEBP file.';
		}

		if (file.size > 10 * 1024 * 1024) {
			return 'File is too large. Maximum size is 10MB.';
		}

		return null;
	};

	const validateImageDimensions = async (file: File): Promise<void> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				const width = img.width;
				const height = img.height;

				if (width > 2000 || height > 2000) {
					reject(
						'Image dimensions are too large. Maximum width/height is 2000px.'
					);
				}

				const aspectRatio = width / height;
				if (aspectRatio < 0.5 || aspectRatio > 2) {
					reject(
						'Invalid aspect ratio. Please use an image with an aspect ratio between 1:2 and 2:1.'
					);
				}

				resolve();
			};

			img.onerror = function () {
				reject('Error loading image. Please try another file.');
			};

			img.src = URL.createObjectURL(file);
		});
	};

	const processFile = async (file: File) => {
		setErrorMessage('');

		const fileError = validateFile(file);
		if (fileError) {
			setErrorMessage(fileError);
			return;
		}

		try {
			await validateImageDimensions(file);
			console.log('File validated successfully!');
			onFileChange(file);
			setPreviewUrl(URL.createObjectURL(file));
		} catch (error) {
			setErrorMessage(error as string);
		}
	};

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			await processFile(file);
		}
	};

	const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);

		const file = event.dataTransfer.files?.[0];
		if (file) {
			await processFile(file);
		}
	};

	const handleClearImage = () => {
		setPreviewUrl(null);
		setErrorMessage('');
		onFileChange(null);
	};

	return (
		<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
			<label
				htmlFor="photo"
				className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
			>
				Photo
				<span className="text-red-500 pl-1">*</span>
			</label>
			<div className="mt-2 sm:col-span-2 sm:mt-0">
				<div
					className={`relative flex flex-col items-center justify-center rounded-lg border border-dashed  px-6 py-10 ${
						isDragging
							? 'border-pink-600 bg-pink-50'
							: 'border-gray-900/25'
					}`}
					onDragEnter={handleDragEnter}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					{previewUrl ? (
						<div>
							<img
								src={previewUrl}
								alt="Uploaded preview"
								className="max-w-full max-h-[300px] object-contain rounded"
							/>
						</div>
					) : (
						<div className="text-center">
							<PhotoIcon
								aria-hidden="true"
								className="mx-auto h-12 w-12 text-pink-300"
							/>
							<div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
								<label
									htmlFor="file-upload"
									className="relative cursor-pointer rounded-md bg-white font-semibold text-pink-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-600 focus-within:ring-offset-2 hover:text-pink-500"
								>
									<span>Upload a file</span>
									<input
										id="file-upload"
										name="file-upload"
										type="file"
										className="sr-only"
										required
										onChange={handleFileChange}
									/>
								</label>
								<p className="pl-1">or drag and drop</p>
							</div>
							<div className="text-xs leading-5 text-gray-600">
								<ul className="list-disc list-inside">
									<li>PNG, JPG, WEBP up to 10MB</li>
									<li>Max 2,000px width/height</li>
									<li>Portrait, landscape, square</li>
									<li>Aspect ratio between 1:2 & 2:1</li>
								</ul>
							</div>
						</div>
					)}
					{(errorMessage || previewUrl) && (
						<div className="flex justify-center mt-4">
							{errorMessage && (
								<div>
									<p className="mt-2 text-sm text-red-600">
										{errorMessage}
									</p>
								</div>
							)}
							{previewUrl && (
								<button
									onClick={handleClearImage}
									className=" text-red-500 hover:text-red-300 ml-3"
								>
									<XCircleIcon className="h-6 w-6" />
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
