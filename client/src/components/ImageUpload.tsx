import { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ queenId: string }) => {
	const [file, setFile] = useState(null);
	const [name, setName] = useState('');
	const [franchise, setFranchise] = useState('');
	const [season, setSeason] = useState('');
	const [episode, setEpisode] = useState('');
	const [episodeName, setEpisodeName] = useState('');
	const [score, setScore] = useState('');
	const [message, setMessage] = useState('');

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
			if (allowedTypes.includes(selectedFile.type)) {
				setFile(selectedFile);
			} else {
				setMessage(
					'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
				);
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			setMessage('Please select a file');
			return;
		}

		const formData = new FormData();
		formData.append('image', file);
		formData.append('queenId', queenId);
		formData.append('name', name);
		formData.append('franchise', franchise);
		formData.append('season', season);
		formData.append('episode', episode);
		formData.append('episodeName', episodeName);
		formData.append('score', score);

		try {
			const response = await axios.post('/api/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setMessage('Image uploaded successfully');
			// Reset form fields
			setFile(null);
			setName('');
			setFranchise('');
			setSeason('');
			setEpisode('');
			setEpisodeName('');
			setScore('');
		} catch (error) {
			setMessage(
				'Error uploading image: ' + error.response?.data?.error ||
					error.message
			);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="file"
				onChange={handleFileChange}
				accept="image/jpeg,image/png,image/webp"
			/>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Runway Name"
				required
			/>
			<input
				type="text"
				value={franchise}
				onChange={(e) => setFranchise(e.target.value)}
				placeholder="Franchise"
			/>
			<input
				type="number"
				value={season}
				onChange={(e) => setSeason(e.target.value)}
				placeholder="Season"
			/>
			<input
				type="number"
				value={episode}
				onChange={(e) => setEpisode(e.target.value)}
				placeholder="Episode"
			/>
			<input
				type="text"
				value={episodeName}
				onChange={(e) => setEpisodeName(e.target.value)}
				placeholder="Episode Name"
			/>
			<input
				type="number"
				value={score}
				onChange={(e) => setScore(e.target.value)}
				placeholder="Score"
				required
				step="0.1"
				min="0"
				max="10"
			/>
			<button type="submit">Upload</button>
			{message && <p>{message}</p>}
		</form>
	);
};

export default ImageUpload;
