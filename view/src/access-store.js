import { defineStore } from 'pinia';

export const useAccessStore = defineStore('access', {
	state: () => ({
		accessTopLewks: false,
	}),
	actions: {
		setAccessTopLewks(value) {
			this.accessTopLewks = value;
		},
	},
	getters: {
		isAccessTopLewks: (state) => state.accessTopLewks,
	},
});
