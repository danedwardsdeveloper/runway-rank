<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

            <div>
                <button @click="confirmLogout"
                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log
                    out</button>
            </div>

            <div class="pt-4">
                <button type="button" @click="logout"
                    class="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                    Log out Quickly
                </button>
            </div>

        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../authStore';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        return {
            authStore,
            router
        };
    },
    methods: {
        async logout() {
            console.log('Logout method called');
            try {
                // Make an API call to the server to log out
                const response = await fetch('http://localhost:3000/api/accounts/log-out', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Logout API response:', response);

                if (!response.ok) {
                    throw new Error('Logout failed');
                }

                // Clear local storage and cookies
                localStorage.removeItem('session');
                document.cookie = 'Session=; Max-Age=0; path=/;';

                // Update the state and redirect to login page
                this.authStore.logout(); // Assuming logout is an action in the auth store
                this.$router.push('/log-in');
            } catch (error) {
                console.error('Logout error:', error);
            }
        },

        confirmLogout() {
            console.log('Confirm logout method called');
            if (confirm('Are you sure you want to log out?')) {
                this.logout();
            }
        },
    },
};
</script>
