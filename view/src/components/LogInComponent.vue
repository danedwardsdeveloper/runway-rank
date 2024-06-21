<template>

    <div class="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Log in</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="login">
                <div>
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                    <div class="mt-2">
                        <input id="email" name="email" type="email" autocomplete="email" v-model="email" required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    </div>
                    <div class="mt-2">
                        <input id="password" name="password" autocomplete="current-password" v-model="password" required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log
                        in</button>
                </div>

                <div>
                    <button type="button" @click="quickLogin"
                        class="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                        Log in Quickly
                    </button>
                </div>

            </form>

            <div v-if="errorMessage">
                <p class="error-message mt-4 text-red-500 text-center">{{ errorMessage }}</p>
            </div>

            <p class="mt-10 text-center text-sm text-gray-500">
                Don't have an account?
                {{ ' ' }}
                <RouterLink :to="{ name: 'create-account' }"
                    class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Create an account</RouterLink>
            </p>
        </div>
    </div>
</template>
<script>
import { useAuthStore } from '../auth-store';
import { RouterLink } from 'vue-router';

export default {
    components: {
        RouterLink
    },
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
        };
    },
    methods: {
        async login() {
            const authStore = useAuthStore();
            try {
                const res = await authStore.login(this.email, this.password);

                console.log(`Response: ${res}`)

                if (res.success) {
                    this.errorMessage = null;
                    this.$router.push({ name: 'homeview' });
                } else {
                    console.error('Login error:', res);
                    this.errorMessage = 'Invalid email or password';
                }
            } catch (error) {
                if (error.response) {
                    console.log('Login failed, status code:', error.response.status);
                    console.log('Login failed, response data:', error.response.data);
                    this.errorMessage = 'Invalid email or password';
                } else {
                    console.log('Login failed, errorMessage:', error.message);
                    this.errorMessage = 'An error occurred during login';
                }
            }
        },
        async quickLogin() {
            this.email = 'name@email.com';
            this.password = 'password123';
            await this.login();
        },
    },
};
</script>
