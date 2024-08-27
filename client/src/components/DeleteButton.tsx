import axios from 'axios';
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

export default function DeleteButton() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const response = await axios.delete(
				'http://localhost:3000/accounts/delete-account',
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				console.log('Account deleted successfully');
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
				className="flex justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
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
