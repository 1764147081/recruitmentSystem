<template>
  <el-sub-menu 
    v-if="hasChildren" 
    :index="String(item.id)"
    @open="handleSubMenuOpen"  
  >
    <template #title>
      <span @click.stop="handleTitleClick">{{ item.name }}</span>
    </template>
    <menu-item
      v-for="child in item.children"
      :key="child.id"
      :item="child"
      @item-click="(id,isDepartment,parentId) => $emit('item-click', id,isDepartment,parentId)"

    />
  </el-sub-menu>
  
  <el-menu-item v-else :index="String(item.id)" @click="handleItemClick">
    <span>{{ item.name }}</span>
  </el-menu-item>
</template>

<script setup>
import {  computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({ id: 0, name: '', children: [] })
  },
});

const emit = defineEmits(['item-click']);

const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0;
});

const handleSubMenuOpen = (index) => {
  console.log('子菜单展开:', index);
};

const handleTitleClick = (e) => {
  e.stopPropagation();
  emit('item-click', props.item.id,props.item.isDepartment,props.item.parentId);


};

const handleItemClick = () => {
  emit('item-click', props.item.id,props.item.isDepartment,props.item.parentId);


};
</script>