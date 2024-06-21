<template>
    <div class="mx-auto py-8 text-center">
        <h1 class="text-3xl font-bold mb-6 text-center">Top Ten Drag Race Lewks</h1>
        <p>Access top lewks: <span>{{ accessTopLewks }}</span></p>

        <!-- <p v-if="!accessTopLewks" class="text-red-500 text-center"><a href="">Cast <span class="font-bold">{{
            ratingsUntilAccess }} </span> more votes
                to view the top ten.</a>
        </p> -->
        <div v-if="accessTopLewks" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 m-4">
            <div v-for="(item, index) in topTen" :key="item.id"
                class="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between">

                <img :src="`${baseUrl}${item.image_path}`" :alt="item.name" class="w-full h-auto rounded-md">

                <div class="flex justify-between">
                    <div>
                        <h2 class="text-xl font-semibold mt-2">{{ item.name }}</h2>
                        <h2 class="text-m gray-700 mb-2">{{ item.subtitle }}</h2>
                        <p class="text-gray-600">Score: {{ item.average_score }}</p>
                        <p class="text-gray-600">Ratings: {{ item.num_of_ratings }}</p>
                    </div>

                    <div class="flex flex-col justify-end">
                        <h2 class="text-6xl bold">{{ index + 1 }}</h2>
                    </div>
                </div>

            </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 m-4">
            <div v-for="index in 10" :key="index"
                class="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between">

                <img src="../assets/mystery-drag-queen.webp" alt="Mystery look" class="w-full h-auto rounded-md">

                <div class="flex justify-between">
                    <div>
                        <h2 class="text-xl font-semibold mt-2">Queen Name</h2>
                        <h2 class="text-m gray-700 mb-2">Lewk description</h2>
                        <p class="text-gray-600">Score: ?</p>
                        <p class="text-gray-600">Ratings: ?</p>
                    </div>

                    <div class="flex flex-col justify-end">
                        <h2 class="text-6xl bold">{{ index }}</h2>
                    </div>
                </div>


            </div>

        </div>

    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useAccessStore } from '../accessStore.js';

export default {
    setup() {
        const accessStore = useAccessStore();
        const accessTopLewks = ref(false);
        const topTen = ref([]);

        const isAccessTopLewks = computed(() => accessStore.isAccessTopLewks);

        const checkAccessTopLewks = () => {
            accessTopLewks.value = accessStore.isAccessTopLewks;
        };

        const renderTopTen = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/items/top-10');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                topTen.value = data.rows;
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        }

        onMounted(() => {
            checkAccessTopLewks();
            // Check the initial state and call renderTopTen if accessTopLewks is true
            if (isAccessTopLewks.value) {
                renderTopTen();
            }
        });

        // watch(isAccessTopLewks, (newValue) => {
        //     accessTopLewks.value = newValue;
        //     // Also check the new value and call renderTopTen if true
        //     if (newValue) {
        //         renderTopTen();
        //     }
        // });

        return {
            accessTopLewks,
            topTen,
            baseUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000/images/" : "http://www.runwayrank.com/images/",
        };
    },
};
</script>