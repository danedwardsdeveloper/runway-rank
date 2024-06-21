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
                        <div class="flex space-x-4">
                            <router-link v-for="item in navigation" :key="item.name" :to="item.href"
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

                    <!-- Profile dropdown -->
                    <Menu v-if="isLoggedIn" as="div" class="relative ml-3">
                        <div>
                            <MenuButton
                                class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span class="absolute -inset-1.5" />
                                <span class="sr-only">Open user menu</span>
                                <span
                                    class="text-white text-xl rounded-full h-8 w-8 bg-gray-700 flex items-center justify-center">
                                    {{ userInitial }}
                                </span>
                            </MenuButton>
                        </div>
                        <transition enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95">
                            <MenuItems
                                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <MenuItem v-slot="{ active }">
                                <a href="#"
                                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Your
                                    Profile</a>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                <a href="#"
                                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Settings</a>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                <a href="#"
                                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign
                                    out</a>
                                </MenuItem>
                            </MenuItems>
                        </transition>
                    </Menu>


                </div>
            </div>
        </div>

        <DisclosurePanel class="sm:hidden">
            <div class="space-y-1 px-2 pb-3 pt-2">
                <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href"
                    :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
                    :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
            </div>
        </DisclosurePanel>

    </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

import { computed, watch } from 'vue';
import { useAuthStore } from '../authStore.js';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.user !== null);

watch(isLoggedIn, (newValue, oldValue) => {
    console.log(`Login state changed: ${oldValue} -> ${newValue}`);
});

const userInitial = computed(() => {
    if (authStore.user.firstName) {
        console.log(`User: ${authStore.user.firstName}`);
        return authStore.user.firstName.charAt(0).toUpperCase();
    }
    return '';
});

const navigation = computed(() => {
    return isLoggedIn.value ? [
        { name: 'Top Ten', href: '/top-ten' },
        { name: 'About', href: '/about' },
        { name: 'Log out', href: '/log-out' },
    ] : [
        { name: 'Top Ten', href: '/top-ten' },
        { name: 'About', href: '/about' },
        { name: 'Log in', href: '/log-in' },
    ];
});

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