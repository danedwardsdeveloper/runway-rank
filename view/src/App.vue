<template>
    <MenuBarComponent />
    <main class="bg-slate-100 flex flex-col min-h-screen">
        <router-view />
    </main>
    <FooterComponent />
</template>

<script>
import MenuBarComponent from './components/MenuBarComponent';
import FooterComponent from './components/FooterComponent.vue';

export default {
    components: {
        MenuBarComponent,
        FooterComponent
    },
};
</script>

<style></style>