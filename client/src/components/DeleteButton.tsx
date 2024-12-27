import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { environment } from '../environment';
import ConfirmationModal from './ConfirmationModal';
import { logger } from '../utilities/logger';
import { useApp } from '../contexts/AppContext';
import { defaultAppData } from '../contexts/defaultAppData';

export default function DeleteButton() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const navigate = useNavigate();
	const { setAppData } = useApp();

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const response = await axios.delete(
				`${environment.apiBase}/delete-account`,
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				logger.info('Account deleted successfully');
				setAppData(defaultAppData);
				navigate('/');
			} else {
				throw new Error('Failed to delete account');
			}
		} catch (error) {
			console.error('Error deleting account:', error);
		} finally {
			setIsDeleting(false);
			setIsModalOpen(false);
		}
	};

	return (
		<>
			<button
				onClick={() => setIsModalOpen(true)}
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
				Delete account
			</button>
			<ConfirmationModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={handleDelete}
				title="Delete Account"
				message="Are you sure you want to delete your account? This action cannot be undone."
				confirmText={isDeleting ? 'Deleting...' : 'Yes, delete my account'}
				cancelText="Cancel"
				color="red"
			/>
		</>
	);
}
