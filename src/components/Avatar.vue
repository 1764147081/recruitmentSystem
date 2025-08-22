<template>
  <el-avatar :size="80" :src="userAvatar" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 优先使用用户头像，如果没有则使用默认头像
const userAvatar = computed(() => {
  return userStore.userInfo.avatar || 
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})
</script>

<style scoped>
 .el-avatar{
    margin-left: 92vw;
    margin-top: -5vh;
 }
</style>
