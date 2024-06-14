<template>
    <MenuBarComponent />
    <main class="bg-slate-100 flex flex-col h-screen">
        <router-view />
    </main>
</template>

<script>
import MenuBarComponent from './components/MenuBarComponent'

export default {
    components: {
        MenuBarComponent,
    },
};
</script>

<style></style>