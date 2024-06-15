<template>

    <div>
        <p v-if="isLoggedIn" class="text-center">Vote for your favourite!</p>
        <p v-else>
            <a href="" class="text-blue-500 underline">Create an account</a>
            or <a href="" class="text-blue-500 underline"> log in</a> to vote for your favourite. Cast votes for all
            pairs
            to see the
            <a href="" :class="{ disabled: accessTopLewks }">top ten lewks</a>. (<span>{{ 50 }}</span> pairs remaining).
        </p>
    </div>

    <div class="container mx-auto p-4 w-6/12">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">

            <button class="bg-white rounded-lg hover:outline outline-green-500 hover:shadow-lg shadow-md"
                @click="handleClick(0)" :disabled="!isLoggedIn">
                <img :src="`${baseUrl}${nextPair[0].image_path}`" :alt="`${baseUrl}${nextPair[0].image_path}`"
                    class="rounded-t-lg">
                <div class="p-6">
                    <h2 class="font-bold mb-2 text-2xl">{{ nextPair[0].name }}
                    </h2>
                    <p class="mb-2">{{ nextPair[0].subtitle }}</p>
                </div>
            </button>

            <button class="bg-white rounded-lg hover:outline outline-green-500 hover:shadow-lg shadow-md"
                @click="handleClick(1)" :disabled="!isLoggedIn">
                <img :src="`${baseUrl}${nextPair[1].image_path}`" :alt="`${baseUrl}${nextPair[1].image_path}`"
                    class="rounded-t-lg">
                <div class="p-6">
                    <h2 class="font-bold mb-2 text-2xl">{{ nextPair[1].name }}
                    </h2>
                    <p class="mb-2">{{ nextPair[1].subtitle }}</p>
                </div>
            </button>


        </div>
    </div>
</template>

<script>
import { computed, watch } from 'vue';
import { useAuthStore } from '../../auth.js';

export default {
    setup() {
        const authStore = useAuthStore();
        const isLoggedIn = computed(() => authStore.user !== null);

        // authStore.user = { id: 1, email: 'test@example.com' };
        // console.log('User set for testing:', authStore.user);

        watch(isLoggedIn, (newValue, oldValue) => {
            console.log(`Login state changed: ${oldValue} -> ${newValue}`);
        });

        return {
            isLoggedIn,
        };
    },
    data() {
        return {
            baseUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://www.runwayrank.com",
            nextPair: [{}, {}],
            accessTopLewks: false
        };
    },

    mounted() {
        this.fetchInitialPair();
    },

    methods: {
        async fetchInitialPair() {
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
                headers: { 'Content-Type': 'application/json' },
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
button.card {
    /* width: 300px;
    height: 400px;
    margin: 30px;
    background-color: #EEE;
    border: none;
    outline: 4px solid transparent;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center; */

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
}

/* p {
    font-size: 16px;
    margin: 0;
}

a {
    &:visited {
        color: navy;
    }

    &.disabled {
        &:visited {
            color: #444;

        }

        &:hover {
            cursor: not-allowed;
        }
    }
}

.container {
    display: flex;
    justify-content: center;


    h2 {
        margin: 12px 0 6px 0;
    }

    p {
        text-align: left;
        padding: 5px;
    }
}

.image-container {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: 10px;

    img {
        max-width: 100%;
        height: auto;
        display: block;
    }
} */
</style>
