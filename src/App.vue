<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <input
      v-model="message"
      type="text"
      name=""
      id=""
    >
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      message: 'hello vue'
    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped>
</style>
