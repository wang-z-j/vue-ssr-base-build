<template>
  <div id="app">
    <router-link to="/">home</router-link>
    <router-link to="/about">about</router-link>
    <router-link to="/posts">posts</router-link>
    <router-view></router-view>
    <!-- <h1>{{ message }}</h1>
    <input
      v-model="message"
      type="text"
      name=""
      id=""
    > -->
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
