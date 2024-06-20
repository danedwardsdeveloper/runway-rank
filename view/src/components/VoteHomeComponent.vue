<template>

    <div class="text-center py-3">
        <p v-if="user" class="text-blue-600">Hello, {{ user.firstName }}!</p>
        <p v-if="isLoggedIn" class="text-center">Vote for your favourite! Cast votes for all pairs to see the <a href=""
                :class="{ disabled: accessTopLewks }">top ten lewks</a>. <span class="underline">{{ 50 }}</span> pairs
            remaining.
        </p>
        <p v-else>
            <router-link to="/create-account" href="" class="text-blue-500 underline">Create an account</router-link>
            or <router-link to="/log-in" class="text-blue-500 underline"> log in</router-link> to vote for your
            favourite.
        </p>
    </div>

    <div class="images-container">

        <div>
            <button
                :class="[' card outline-4 hover:outline', { ' outline-green-500 hover:shadow-lg cursor-pointer': isLoggedIn, 'hover:outline-gray-500 cursor-not-allowed': !isLoggedIn }]"
                @click="handleClick(0)" :disabled="!isLoggedIn">
                <img :src="`${baseUrl}${nextPair[0].image_path}`" :alt="`${baseUrl}${nextPair[0].image_path}`"
                    class="rounded-lg">
            </button>
        </div>

        <div>
            <button
                :class="[' card outline-4 hover:outline', { ' outline-green-500 hover:shadow-lg cursor-pointer': isLoggedIn, 'hover:outline-gray-500 cursor-not-allowed': !isLoggedIn }]"
                @click="handleClick(1)" :disabled="!isLoggedIn">
                <img :src="`${baseUrl}${nextPair[1].image_path}`" :alt="`${baseUrl}${nextPair[1].image_path}`"
                    class="rounded-lg">
            </button>
        </div>

    </div>
</template>

<script>
import { computed, watch } from 'vue';
import { useAuthStore } from '../client-auth.js';

export default {
    setup() {
        const authStore = useAuthStore();
        const isLoggedIn = computed(() => authStore.user !== null);
        authStore.checkAuth();

        watch(isLoggedIn, (newValue, oldValue) => {
            console.log(`Login state changed: ${oldValue} -> ${newValue}`);
        });
        return {
            isLoggedIn,
            authStore,
            user: authStore.user,
        };
    },
    data() {
        return {
            baseUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://www.runwayrank.com",
            nextPair: [{}, {}],
            accessTopLewks: true
        };
    },

    mounted() {
        this.fetchInitialPair();
    },

    methods: {
        async fetchInitialPair() {
            // const endpoint = this.isLoggedIn ? '/api/accounts/fewest-ratings' : '/api/items/get-next-pair';
            // const response = await fetch(`http://localhost:3000${endpoint}`);
            const response = await fetch('http://localhost:3000/api/items/get-next-pair');
            const data = await response.json();
            this.nextPair = data;
        },

        async handleClick(itemIndex) {
            let postData = {};

            if (itemIndex === 0) {
                postData.winnerID = this.nextPair[0].id;
                postData.loserID = this.nextPair[1].id;
            } else {
                postData.winnerID = this.nextPair[1].id;
                postData.loserID = this.nextPair[0].id;
            }

            const response = await fetch('http://localhost:3000/api/items/post-ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authStore.session}`
                },
                body: JSON.stringify(postData)
            });

            const result = await response.json();
            if (!response.ok) {
                console.log(result);
            }

            this.fetchInitialPair()
        }
    }
};
</script>

<style lang="less">
.images-container {
    display: flex;
    width: 100%;
    justify-content: center;
}

button.card {
    margin: 10px;
    border-radius: 10px;

    &:hover {
        outline-color: lightgreen;
    }

    &:active {
        transform: scale(0.98);
        box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
    }

    &:disabled {
        cursor: not-allowed;

        &:hover {
            outline-color: grey;
        }

        &:active {
            transform: scale(1);
            box-shadow: none;
        }
    }

    img {
        max-width: 500px;
        max-height: 500px;
    }
}
</style>
