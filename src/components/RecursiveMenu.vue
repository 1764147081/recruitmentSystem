<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor"
    :collapse="isCollapse"
  >
    <menu-item 
      v-for="item in menuData" 
      :key="item.id" 
      :item="item" 
    />
  </el-menu>
</template>

<script setup>
import { ref } from 'vue';
import MenuItem from './MenuItem.vue';

const props = defineProps({
  menuData: {
    type: Array,
    required: true,
    default: () => []
  },
  backgroundColor: {
    type: String,
    default: '#304156'
  },
  textColor: {
    type: String,
    default: '#bfcbd9'
  },
  activeTextColor: {
    type: String,
    default: '#409EFF'
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
});

const activeMenu = ref('');
</script>