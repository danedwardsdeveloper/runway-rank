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
import { useAuthStore } from '../client-auth';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        const logout = async () => {
            try {
                await authStore.logout();
                router.push('/log-in');
            } catch (error) {
                console.error('Logout error:', error);
            }
        };

        const confirmLogout = () => {
            if (confirm('Are you sure you want to log out?')) {
                logout();
            }
        };

        return {
            logout,
            confirmLogout,
        };
    },
};
</script>