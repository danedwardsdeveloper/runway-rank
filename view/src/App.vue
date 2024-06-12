<template>
  <main>
    <h1>Runway Rank</h1>
    <p>Vote for your favourite</p>
    <div class="container">

      <button @click="handleClick(0)">
        <div class="image-container">
          <img :src="`${baseUrl}${nextPair[0].image_path}`" alt="Image" />
        </div>
        <h2>{{ nextPair[0].name }}</h2>
      </button>

      <button @click="handleClick(1)">
        <div class="image-container">
          <img :src="`${baseUrl}${nextPair[1].image_path}`" alt="Image" />
        </div>
        <h2>{{ nextPair[1].name }}</h2>
      </button>

    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://www.runwayrank.com",
      nextPair: [{}, {}]
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

<style scoped>
main {
  text-align: center;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.container {
  display: flex;
  justify-content: center;
}

.container button {
  width: 300px;
  height: 400px;
  margin: 30px;
  background-color: #EEE;
  border: none;
  outline: 4px solid transparent;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

button:hover {
  outline-color: lightgreen;
}

button:active {
  transform: scale(0.98);
  box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
}

.image-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  padding: 10px
}

.image-container img {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
