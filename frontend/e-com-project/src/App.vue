<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

// Clear session (token) when user leaves/closes the page
const handleBeforeUnload = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style>
</style>
