import axios from 'axios';
import { useState } from 'react';

import UploadForm from './components/UploadForm';
import { UploadFormInterface } from '../../../../types';
import { logger } from '../../utilities/logger';

export default function UploadPage() {
	// const [successMessage, setSuccessMessage] = useState('');
	const handleSubmit = async (formData: UploadFormInterface) => {
		logger.info('Form submission started', { formData });

		try {
			const data = new FormData();
			Object.entries(formData).forEach(([key, value]) => {
				if (value !== undefined) {
					if (key === 'file' && value instanceof File) {
						data.append('file', value);
						logger.debug(`Appended file to FormData`, {
							fileName: value.name,
							fileSize: value.size,
						});
					} else {
						data.append(key, String(value));
						logger.debug(`Appended ${key} to FormData`, { value });
					}
				} else {
					logger.warn(`Skipped undefined value for key: ${key}`);
				}
			});

			logger.info('Prepared FormData for submission', {
				keys: Array.from(data.keys()),
				fileIncluded: data.has('file'),
			});

			logger.info('Sending POST request to images/upload');
			const response = await axios.post(
				'http://localhost:3000/images/upload',
				data,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			logger.info('Queen added successfully:', response.data);
			// setSuccessMessage('Queen added successfully!');
		} catch (error) {
			logger.error('Error adding queen:', error);
		}
	};

	return <UploadForm onSubmit={handleSubmit} />;
}
