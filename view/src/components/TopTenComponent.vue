<template>
    <div class="container mx-auto py-8">
        <h1 class="text-3xl font-bold mb-6 text-center">Top Ten Drag Race Lewks</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 m-4">
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [],
            baseUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000/images/" : "http://www.runwayrank.com/images/",
        };
    },
    mounted() {
        this.fetchTopTenImages();
    },
    methods: {
        async fetchTopTenImages() {
            try {
                const response = await fetch('http://localhost:3000/api/items/top-10');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                this.items = data.rows;
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        }
    }
};
</script>

<style>
.container {
    max-width: 1200px;
    margin: 0 auto;
}
</style>