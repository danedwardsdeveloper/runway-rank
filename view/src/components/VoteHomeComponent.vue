<template>

    <div class="text-center py-3">
        <p v-if="user" class="text-blue-600">Hello, {{ user.firstName }}!</p>
        <div v-if="isLoggedIn" class="text-center">
            <p class="text-center">Vote for your favourite! Cast votes for all pairs to see the <a href=""
                    :class="{ disabled: accessTopLewks }">top ten lewks</a>.</p>
            <p class="text-blue-600">
                <span class="underline underline-offset-2">{{ pairsRated }} </span> out of
                <span>{{ totalPairs }}</span> pairs rated.
            </p>
            <p>Access top lewks: <span>{{ accessTopLewks }}</span></p>

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
import { useAuthStore } from '../auth-store.js';
import { useAccessStore } from '../access-store.js';

export default {
    setup() {
        const authStore = useAuthStore();
        authStore.checkAuth();
        const accessStore = useAccessStore();
        const isLoggedIn = computed(() => authStore.user !== null);

        const pairsRated = ref(0);
        const totalPairs = ref(100);
        const nextPair = ref([{}, {}]);
        const accessTopLewks = ref(false);

        const getInitialPair = async () => {
            const response = await fetch('http://localhost:3000/api/items/get-next-pair');
            const data = await response.json();
            nextPair.value = data;
        };

        const getPairsRated = async () => {
            const userID = authStore.user ? authStore.user.userId : null;
            if (userID) {
                try {
                    const response = await fetch('http://localhost:3000/api/accounts/pairs-rated', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userID }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch pairs rated');
                    }

                    const data = await response.json();
                    console.log(data);
                    pairsRated.value = data.pairsRated;
                } catch (error) {
                    console.error('Error fetching pairs rated:', error);
                }
            } else {
                console.warn('User ID not available');
            }
        };

        const getTotalPairs = async () => {
            const response = await fetch('http://localhost:3000/api/items/total-pairs');
            const data = await response.json();
            console.log(data);
            totalPairs.value = data.totalPairs;
        };

        const postRatings = async (itemIndex) => {
            try {
                authStore.checkAuth();
                const userID = authStore.user ? authStore.user.userId : null;
                // console.log(`User ID = ${userID}`);
                const token = authStore.token;
                // console.log(`Token = ${token}`);

                if (!userID || !token) {
                    console.warn('User ID or token is not available. Cannot post ratings.');
                    return;
                }

                const postData = {
                    userID: userID,
                    winnerID: itemIndex === 0 ? nextPair.value[0].id : nextPair.value[1].id,
                    loserID: itemIndex === 0 ? nextPair.value[1].id : nextPair.value[0].id
                };

                // console.log(postData);

                const response = await fetch('http://localhost:3000/api/ratings/post-ratings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(postData)
                });

                const result = await response.json();
                if (!response.ok) {
                    console.log(result);
                }

                getNextPair();
                getPairsRated();
            } catch (error) {
                console.error('Error posting ratings:', error);
            }
        };

        const getNextPair = async () => {
            try {
                const userID = authStore.user ? authStore.user.userId : null;

                if (!userID) {
                    console.warn('User ID is not available. Skipping fetch operation.');
                    return;
                }

                const token = authStore.token;

                if (!token) {
                    console.warn('Token is not available. Skipping fetch operation.');
                    return;
                }

                const response = await fetch('http://localhost:3000/api/accounts/next-pair', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userID })
                });

                if (!response.ok) {
                    const responseBody = await response.text();
                    console.error(`Failed to fetch next pair. Status: ${response.status}, Status Text: ${response.statusText}, Response Body: ${responseBody}`);
                    throw new Error('Failed to fetch next pair');
                }

                const data = await response.json();
                nextPair.value = data;
            } catch (error) {
                console.error('Error fetching next pair:', error);
            }
        };

        watch(isLoggedIn, (newValue, oldValue) => {
            console.log(`Login state changed: ${oldValue} -> ${newValue}`);
        });

        const checkAccessTopLewks = computed(() => {
            return pairsRated.value >= totalPairs.value;
        });

        watch(checkAccessTopLewks, (newValue) => {
            accessStore.setAccessTopLewks(newValue);
            accessTopLewks.value = newValue;
        });

        onMounted(() => {
            getInitialPair();
            getTotalPairs();
            if (isLoggedIn.value) {
                getPairsRated();
            }
        });

        return {
            isLoggedIn,
            pairsRated,
            totalPairs,
            nextPair,
            getInitialPair,
            getTotalPairs,
            getPairsRated,
            postRatings,
            getNextPair,
            user: authStore.user,
            accessTopLewks: computed(() => accessStore.isAccessTopLewks),
        };
    },

    data() {
        return {
            baseUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://www.runwayrank.com",
            // accessTopLewks: true
        };
    }
}
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
