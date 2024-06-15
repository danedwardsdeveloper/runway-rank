<template>
    <div class="flex justify-center py-8">
        <button @click="confirmLogout"
            class="rounded-md px-3 py-2 text-sm font-medium bg-green-500 text-black hover:bg-green-300 hover:text-gray-800">
            Log Out
        </button>
    </div>
</template>

<script>
import { useAuthStore } from '../auth';
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
            confirmLogout,
        };
    },
};
</script>