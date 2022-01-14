<template>
  <div>
    <ul>
      <li
        v-for="post in posts"
        :key="post.id"
      >{{ post.title }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'posts',
  data() {
    return {
      // posts: []
    }
  },
  serverPrefetch() {
    return this.getPosts()
  },
  computed: {
    ...mapState(['posts'])
  },
  methods: {
    ...mapActions(['getPosts'])
  },
  components: {

  },
  mounted() {
    // 路由切换后判断有没有数据 如果没有数据 请求数据
    if (!this.posts.length) {
      this.getPosts()
    }
  }
}
</script>

<style scoped>
</style>
