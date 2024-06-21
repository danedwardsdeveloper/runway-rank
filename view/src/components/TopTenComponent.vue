<template>
    <div class="mx-auto py-8 text-center">
        <h1 class="text-3xl font-bold mb-6 text-center">Top Ten Drag Race Lewks</h1>
        <p>Access top lewks: <span>{{ accessTopLewks }}</span></p>

        <!-- <p v-if="!accessTopLewks" class="text-red-500 text-center"><a href="">Cast <span class="font-bold">{{
            ratingsUntilAccess }} </span> more votes
                to view the top ten.</a>
        </p> -->
        <div v-if="accessTopLewks" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 m-4">
            <div v-for="(item, index) in items" :key="item.id"
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
import { ref, onMounted, watch } from 'vue';
import { useAccessStore } from '../access-store.js'; // Adjust the path as needed

export default {
    setup() {
        const accessStore = useAccessStore();
        const accessTopLewks = ref(false);

        const checkAccessTopLewks = () => {
            accessTopLewks.value = accessStore.isAccessTopLewks;
        };

        onMounted(() => {
            checkAccessTopLewks();
        });

        watch(() => accessStore.isAccessTopLewks, (newValue) => {
            accessTopLewks.value = newValue;
        });

        return {
            accessTopLewks,
        };
    },
};
</script>