import axios from 'axios';

import UploadForm from './components/UploadForm';
import { UploadFormInterface } from '../../../../types';
import { logger } from '../../utilities/logger';

export default function UploadPage() {
	const handleSubmit = async (formData: UploadFormInterface) => {
		logger.info('Form submission started', { formData });

		if (
			!formData.name ||
			!formData.queenId ||
			!formData.franchise ||
			!formData.image
		) {
			logger.error('Missing required fields', { formData });
			alert('Please fill in all required fields and upload an image.');
			return;
		}

		try {
			const data = new FormData();

			Object.entries(formData).forEach(([key, value]) => {
				if (value !== null && value !== '') {
					if (key === 'image' && value instanceof File) {
						data.append('image', value);
					} else {
						data.append(key, value.toString());
					}
				}
			});

			logger.info('Prepared FormData for submission', {
				keys: Array.from(data.keys()),
				fileIncluded: data.has('image'),
			});

			logger.info('Sending POST request to images/upload');
			const response = await axios.post(
				'http://localhost:3000/images/upload',
				data,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					withCredentials: true,
				}
			);

			logger.info('Queen added successfully:', response.data);
		} catch (error) {
			logger.error('Error adding queen:', error);
		}
	};

	return <UploadForm onSubmit={handleSubmit} />;
}
