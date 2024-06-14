import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import "./index.css";

import App from "./App.vue";
import VoteHomeComponent from "./components/VoteHomeComponent.vue";
import AboutComponent from "./components/AboutComponent.vue";
import HotOneHundredComponent from "./components/HotOneHundredComponent.vue";
import UploadComponent from "./components/UploadComponent.vue";
import CreateAccountComponent from "./components/CreateAccountComponent.vue";
import LogInComponent from "./components/LogInComponent.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "homeview", component: VoteHomeComponent },
    { path: "/about", name: "about", component: AboutComponent },
    { path: "/hot-100", name: "hot", component: HotOneHundredComponent },
    { path: "/upload", name: "upload", component: UploadComponent },
    { path: "/log-in", name: "log-in", component: LogInComponent },
    { path: "/create-account", name: "create-account", component: CreateAccountComponent },
  ],
});

createApp(App).use(router).mount("#app");
