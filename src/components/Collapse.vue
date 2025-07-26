<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :value="false">拓展</el-radio-button>
    <el-radio-button :value="true">折叠</el-radio-button>
  </el-radio-group>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <template >
      <el-sub-menu v-if="item.children && item.children.length>0" >
          <template #title>{{item.title}}</template>
          <collapse v-for="item in item.children" :key="item.path" :item="item"></collapse>
      </el-sub-menu> 
      <el-menu-item v-else >
        <router-link :to="item.path">{{item.title}}</router-link>
      </el-menu-item>
    </template>
    
    
  
  
  
  
  
  
  
  
  <el-sub-menu index="1">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>学生在线</span>
      </template>

      <!-- <el-menu-item index="1-1">软件园分站</el-menu-item>
      <el-menu-item index="1-2">中心分站</el-menu-item>
      <el-menu-item index="1-3">兴隆山分站</el-menu-item>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu> -->
    </el-sub-menu>
    
    
    
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon>
        <document />
      </el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon>
        <setting />
      </el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import { te } from "element-plus/es/locales.mjs";


const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}
</style>
