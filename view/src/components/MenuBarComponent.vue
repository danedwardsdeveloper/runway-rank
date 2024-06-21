<template>
    <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
        <div class="relative z-50 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <!-- Mobile menu button-->
                    <DisclosureButton
                        class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span class="absolute -inset-0.5" />
                        <span class="sr-only">Open main menu</span>
                        <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                        <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                    </DisclosureButton>
                </div>

                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div class="flex flex-shrink-0 items-center">
                        <router-link :to="{ name: 'homeview' }" class="logo">
                            <p class="text-center text-white text-lg font-bold">Runway Rank</p>
                        </router-link>
                    </div>
                    <!-- Main menu-->
                    <div class="hidden sm:ml-6 sm:block">
                        <div v-if="!isLoggedIn" class="flex space-x-4">
                            <router-link v-for="item in authenticatedNavigation" :key="item.name" :to="item.href"
                                class="rounded-md px-3 py-2 text-sm font-medium" :class="{
                                    'bg-gray-900 text-white': $route.path === item.href,
                                    'text-gray-300 hover:bg-gray-700 hover:text-white': $route.path !== item.href
                                }" aria-current="page">
                                {{ item.name }}
                            </router-link>
                        </div>
                        <div v-else class="flex space-x-4">
                            <router-link v-for="item in unauthenticatedNavigation" :key="item.name" :to="item.href"
                                class="rounded-md px-3 py-2 text-sm font-medium" :class="{
                                    'bg-gray-900 text-white': $route.path === item.href,
                                    'text-gray-300 hover:bg-gray-700 hover:text-white': $route.path !== item.href
                                }" aria-current="page">
                                {{ item.name }}
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                </div>
            </div>
        </div>


    </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { computed, watch } from 'vue';
import { useAuthStore } from '../auth-store.js';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.user !== null);

watch(isLoggedIn, (newValue, oldValue) => {
    console.log(`Login state changed: ${oldValue} -> ${newValue}`);
});

const authenticatedNavigation = [
    { name: 'Top Ten', href: '/top-ten' },
    { name: 'About', href: '/about' },
    { name: 'Log in', href: '/log-in' },
];

const unauthenticatedNavigation = [
    { name: 'Top Ten', href: '/top-ten' },
    { name: 'About', href: '/about' },
    { name: 'Log out', href: '/log-out' },
];
</script>

<style scoped>
.router-link-active {
    background-color: #1a202c;
    color: white;
}

.router-link-exact-active {
    background-color: #1a202c;
    color: white;
}

.logo {
    background-color: inherit;
}
</style>