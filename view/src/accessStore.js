import { defineStore } from 'pinia';

export const useAccessStore = defineStore('access', {
	state: () => ({
		accessTopLewks:
			JSON.parse(localStorage.getItem('accessTopLewks')) || false,
	}),
	actions: {
		setAccessTopLewks(value) {
			this.accessTopLewks = value;
			localStorage.setItem('accessTopLewks', JSON.stringify(value));
		},
	},
	getters: {
		isAccessTopLewks: (state) => state.accessTopLewks,
	},
});
