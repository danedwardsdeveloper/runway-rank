import { useEffect, useState } from 'react';

import Metadata from '../../Metadata';
import ImageInput from './ImageInput';
import {
	FranchiseData,
	Queen,
	UploadFormInterface,
} from '../../../../../types';

interface UploadFormProps {
	onSubmit: (formData: UploadFormInterface) => void;
}

export default function UploadForm({ onSubmit }: UploadFormProps) {
	const [queens, setQueens] = useState<Queen[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedFranchise, setSelectedFranchise] = useState('');
	const [formData, setFormData] = useState<UploadFormInterface>({
		description: '',
		queen: '',
		franchise: '',
	});

	useEffect(() => {
		const fetchQueens = async () => {
			try {
				const response = await fetch('http://localhost:3000/queens');
				if (!response.ok) {
					throw new Error('Failed to fetch queens');
				}
				const data = await response.json();
				setQueens(data);
				setLoading(false);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An unknown error occurred'
				);
				setLoading(false);
			}
		};

		fetchQueens();
	}, []);

	const franchises: FranchiseData[] = [
		{ name: "RuPaul's Drag Race", seasons: 16 },
		{ name: `RuPaul's Drag Race All Stars`, seasons: 9 },
		{ name: 'Drag Race UK', seasons: 5 },
		{ name: "Canada's Drag Race", seasons: 4 },
		{ name: 'Drag Race Down Under', seasons: 3 },
		{ name: 'Drag Race España', seasons: 3 },
		{ name: 'Drag Race Italia', seasons: 3 },
		{ name: 'Drag Race France', seasons: 3 },
		{ name: 'Drag Race Philippines', seasons: 2 },
		{ name: 'Drag Race Thailand', seasons: 2 },
		{ name: 'Drag Race Holland', seasons: 2 },
		{ name: 'Drag Race Belgique', seasons: 2 },
		{ name: 'Drag Race Sverige', seasons: 1 },
		{ name: 'Drag Race Brasil', seasons: 1 },
		{ name: 'Drag Race Deutschland', seasons: 1 },
		{ name: 'Drag Race México', seasons: 1 },
		{ name: 'Other', seasons: undefined },
	];

	if (loading) return <p>Loading queens...</p>;
	if (error) return <p>Error: {error}</p>;

	const handleFileChange = (file: File) => {
		setFormData((prev) => ({ ...prev, image: file }));
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (name === 'franchise') {
			setSelectedFranchise(value);
		}
	};

	const renderSeasonOptions = () => {
		const selectedFranchiseData = franchises.find(
			(franchise) => franchise.name === selectedFranchise
		);
		if (!selectedFranchiseData || !selectedFranchiseData.seasons) return null;

		return Array.from(
			{ length: selectedFranchiseData.seasons },
			(_, i) => i + 1
		).map((season) => (
			<option key={season} value={season}>
				Season {season}
			</option>
		));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<>
			<Metadata title="Upload a photo" slug="upload" pageName="Upload" />

			<div className="container mx-auto md:px-4 sm:px-6 flex justify-center">
				<form
					onSubmit={handleSubmit}
					className="w-full md:w-3/4 lg:w-3/5 bg-white md:rounded-lg py-5 px-4 md:px-10 md:mt-10 md:mb-20"
				>
					<div className="space-y-12 sm:space-y-16">
						<div>
							<h2 className="text-base font-semibold leading-7 text-gray-900">
								Upload photo
							</h2>
							<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
								Submit a photo for approval
							</p>

							{/* Input container */}
							<div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
								{/* Photo upload */}
								<ImageInput onFileChange={handleFileChange} />

								{/* Description */}
								<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
									<label
										htmlFor="first-name"
										className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
									>
										Photo description
										<span className="text-red-500 pl-1">*</span>
									</label>
									<div className="mt-2 sm:col-span-2 sm:mt-0">
										<input
											id="description"
											name="description"
											type="text"
											required
											placeholder="Short description of the lewk"
											value={formData.description}
											onChange={handleInputChange}
											className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
										/>
									</div>
								</div>

								{/* Queen name */}
								<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
									<label
										htmlFor="country"
										className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
									>
										Queen
										<span className="text-red-500 pl-1">*</span>
									</label>
									<div className="mt-2 sm:col-span-2 sm:mt-0">
										<select
											id="queen"
											name="queen"
											required
											value={formData.queen}
											onChange={handleInputChange}
											className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 px-2"
										>
											<option value="">Select a queen</option>
											{queens.map((queen) => (
												<option key={queen.name} value={queen.name}>
													{queen.name}
												</option>
											))}
										</select>
									</div>
								</div>

								{/* Franchise */}
								<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
									<label
										htmlFor="franchise"
										className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
									>
										Franchise
									</label>
									<div className="mt-2 sm:col-span-2 sm:mt-0">
										<select
											id="franchise"
											name="franchise"
											value={formData.franchise}
											onChange={handleInputChange}
											className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 px-2"
										>
											<option value="">Select a franchise</option>
											{franchises.map((franchise) => (
												<option
													key={franchise.name}
													value={franchise.name}
												>
													{franchise.name}
												</option>
											))}
										</select>
									</div>
								</div>

								{/* Season */}
								{selectedFranchise && selectedFranchise !== 'Other' && (
									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
										<label
											htmlFor="season"
											className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
										>
											Season
										</label>
										<div className="mt-2 sm:col-span-2 sm:mt-0">
											<select
												id="season"
												name="season"
												value={formData.season || ''}
												onChange={handleInputChange}
												className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 px-2"
											>
												<option value="">Select a season</option>
												{renderSeasonOptions()}
											</select>
										</div>
									</div>
								)}

								{/* Episode number */}
								{selectedFranchise && selectedFranchise !== 'Other' && (
									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
										<label
											htmlFor="episode"
											className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
										>
											Episode
										</label>
										<div className="mt-2 sm:col-span-2 sm:mt-0">
											<select
												id="episode"
												name="episode"
												value={formData.episodeNumber || ''}
												onChange={handleInputChange}
												className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 px-2"
											>
												<option value="">
													Select an episode number
												</option>
												{Array.from(
													{ length: 16 },
													(_, i) => i + 1
												).map((num) => (
													<option key={num} value={num.toString()}>
														{num}
													</option>
												))}
											</select>
										</div>
									</div>
								)}

								{/* Episode name */}
								{selectedFranchise && selectedFranchise !== 'Other' && (
									<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
										<label
											htmlFor="episodeName"
											className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
										>
											Episode name
										</label>
										<div className="mt-2 sm:col-span-2 sm:mt-0">
											<input
												id="episodeName"
												name="episodeName"
												type="text"
												value={formData.episodeName || ''}
												onChange={handleInputChange}
												className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
											/>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="mt-6 flex items-center justify-end gap-x-6">
						<button
							type="button"
							className="text-sm font-semibold leading-6 text-gray-900"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="inline-flex justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
