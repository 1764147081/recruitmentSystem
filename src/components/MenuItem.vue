<template>
  <el-sub-menu 
    v-if="hasChildren" 
    :index="item.id"
    @click="handleClick(item)"
  >
    <template #title>
      <span>{{ item.name }}</span>
    </template>
    <menu-item
      v-for="child in item.children"
      :key="child.id"
      :item="child"
    />
  </el-sub-menu>
  
  <el-menu-item v-else :index="item.id" @click="handleClick(item)">
    <template #title>{{ item.name }}</template>
  </el-menu-item>
</template>

<script setup>
import { defineProps, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const hasChildren = ref(false);
const loading = ref(false);

// 检查是否有子菜单
const checkChildren = async () => {
  if (props.item.children) {
    hasChildren.value = props.item.children.length > 0;
    return;
  }
  
};

onMounted(() => {
  checkChildren();
});

const handleClick = (item) => {

};
</script>