<template>
  <div id="app">
    <Header />
    <router-view>
    </router-view>
    <Footer />
  </div>
</template>

<style scoped>
.background_content {
  background-color: #E6E6FA !important;
  padding-bottom: 30px;
}
</style>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
  })
})
</script>
