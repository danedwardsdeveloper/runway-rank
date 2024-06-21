import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';

import { useAuthStore } from './authStore';

import './index.css';

import App from './App.vue';
import VoteHomeComponent from './components/VoteHomeComponent.vue';
import AboutComponent from './components/AboutComponent.vue';
import TopTenComponent from './components/TopTenComponent.vue';
import UploadComponent from './components/UploadComponent.vue';
import CreateAccountComponent from './components/CreateAccountComponent.vue';
import LogInComponent from './components/LogInComponent.vue';
import LogOutComponent from './components/LogOutComponent.vue';

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'homeview', component: VoteHomeComponent },
		{ path: '/about', name: 'about', component: AboutComponent },
		{ path: '/top-ten', name: 'hot', component: TopTenComponent },
		{ path: '/upload', name: 'upload', component: UploadComponent },
		{ path: '/log-in', name: 'log-in', component: LogInComponent },
		{ path: '/log-out', name: 'log-out', component: LogOutComponent },
		{
			path: '/create-account',
			name: 'create-account',
			component: CreateAccountComponent,
		},
	],
});

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore();
	authStore.checkAuth();

	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!authStore.user) {
			next({ name: 'log-in' });
		} else {
			next();
		}
	} else {
		next();
	}
});

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount('#app');

const authStore = useAuthStore();
authStore.checkAuth();
