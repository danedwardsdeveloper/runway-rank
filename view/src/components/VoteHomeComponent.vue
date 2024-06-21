<template>

    <div class="text-center py-3">
        <p v-if="user" class="text-blue-600">Hello, {{ user.firstName }}!</p>
        <div v-if="isLoggedIn" class="text-center">
            <p class="text-center">Vote for your favourite! Cast votes for all pairs to see the <a href=""
                    :class="{ disabled: accessTopLewks }">top ten lewks</a>.</p>
            <p class="text-blue-600">
                <span>{{ ratedPairs }} </span> out of
                <span class="underline">{{ totalPairs }}</span> pairs rated.
            </p>

        </div>

        <div v-else>
            <router-link to="/create-account" href="" class="text-blue-500 underline">Create an account</router-link>
            or <router-link to="/log-in" class="text-blue-500 underline"> log in</router-link> to vote for your
            favourite.
        </div>
    </div>

    <div class="images-container">

        <div>
            <button
                :class="[' card outline-4 hover:outline', { ' outline-green-500 hover:shadow-lg cursor-pointer': isLoggedIn, 'hover:outline-gray-500 cursor-not-allowed': !isLoggedIn }]"
                @click="postRatings(0)" :disabled="!isLoggedIn">
                <img :src="`${baseUrl}${nextPair[0].image_path}`" :alt="`${baseUrl}${nextPair[0].image_path}`"
                    class="rounded-lg">
            </button>
        </div>

        <div>
            <button
                :class="[' card outline-4 hover:outline', { ' outline-green-500 hover:shadow-lg cursor-pointer': isLoggedIn, 'hover:outline-gray-500 cursor-not-allowed': !isLoggedIn }]"
                @click="postRatings(1)" :disabled="!isLoggedIn">
                <img :src="`${baseUrl}${nextPair[1].image_path}`" :alt="`${baseUrl}${nextPair[1].image_path}`"
                    class="rounded-lg">
            </button>
        </div>

    </div>
</template>

<script>
import { computed, ref, onMounted, watch } from 'vue';
import { useAuthStore } from '../client-auth.js';

export default {
    setup() {
        const authStore = useAuthStore();
        const isLoggedIn = computed(() => authStore.user !== null);
        authStore.checkAuth();
        const ratedPairs = ref(100000);

        const fetchPairsRated = async () => {
            const userId = authStore.user ? authStore.user.userId : null;
            if (userId) {
                try {
                    const response = await fetch('http://localhost:3000/api/accounts/pairs-until-access', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch pairs rated');
                    }

                    const data = await response.json();
                    ratedPairs.value = data.total;
                } catch (error) {
                    console.error('Error fetching pairs rated:', error);
                }
            } else {
                console.warn('User ID not available');
            }
        };

        watch(isLoggedIn, (newValue, oldValue) => {
            console.log(`Login state changed: ${oldValue} -> ${newValue}`);
        });

        onMounted(() => {
            if (isLoggedIn.value) {
                fetchPairsRated();
            }
        });

        return {
            isLoggedIn,
            authStore,
            user: authStore.user,
            ratedPairs,
            fetchPairsRated
        };
    },

    data() {
        return {
            baseUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://www.runwayrank.com",
            nextPair: [{}, {}],
            totalPairs: null,
            accessTopLewks: true
        };
    },

    mounted() {
        this.fetchInitialPair();
        this.getTotalPairs();
    },

    methods: {
        async fetchInitialPair() {
            const response = await fetch('http://localhost:3000/api/items/get-next-pair');
            const data = await response.json();
            this.nextPair = data;
        },

        async fetchNextPair() {
            try {
                const userId = this.$store.state.auth.user ? this.$store.state.auth.user.userId : null;

                if (!userId) {
                    console.warn('User ID is not available. Skipping fetch operation.');
                    return;
                }

                const response = await fetch('http://localhost:3000/api/accounts/next-pair', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId })
                });

                if (!response.ok) {
                    const responseBody = await response.text();
                    console.error(`Failed to fetch next pair. Status: ${response.status}, Status Text: ${response.statusText}, Response Body: ${responseBody}`);
                    throw new Error('Failed to fetch next pair');
                }

                const data = await response.json();
                this.nextPair = data;
            } catch (error) {
                console.error('Error fetching next pair:', error);
            }
        },

        async getTotalPairs() {
            const response = await fetch('http://localhost:3000/api/items/whole-pairs');
            const data = await response.json();
            this.totalPairs = data;
        },

        async postRatings(itemIndex) {
            let postData = {};

            if (itemIndex === 0) {
                postData.winnerID = this.nextPair[0].id;
                postData.loserID = this.nextPair[1].id;
            } else {
                postData.winnerID = this.nextPair[1].id;
                postData.loserID = this.nextPair[0].id;
            }

            const userId = this.authStore.user ? this.authStore.user.userId : null;

            if (!userId) {
                console.warn('User ID is not available. Cannot post ratings.');
                return;
            }

            postData.userID = userId;

            const response = await fetch('http://localhost:3000/api/ratings/post-ratings', {
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
            this.fetchPairsRated()
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
