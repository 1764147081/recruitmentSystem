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
      @item-click="handleItemClick"  
    />
  </el-menu>
</template>

<script setup>
import { ref } from 'vue';
import MenuItem from './MenuItem.vue';
import { useStationStore } from '../store/station';
import { ElMessage } from 'element-plus';


const stationStore = useStationStore();
const props = defineProps({
  menuData: Array,
  backgroundColor: String,
  textColor: String,
  activeTextColor: String,
  isCollapse: Boolean,
});

const activeMenu = ref('');

// 直接监听子组件的 item-click 事件
const handleItemClick = (itemId,isDepartment,parentId,name) => {




  console.log('当前选中项 ID:', itemId);
  activeMenu.value = itemId;  
  stationStore.changeId(itemId)
  stationStore.changeIsDepartment(isDepartment)
  stationStore.changeParentId(parentId)
  console.log(stationStore.getIsDepartment)
  console.log(stationStore.getId)
  console.log(stationStore.getParentId)
  ElMessage({
    message: '选择了菜单项 ' + name+"可以进行操作",

    type: 'info',
  })



  
};


</script>
