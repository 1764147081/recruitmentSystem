<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :value="false">拓展</el-radio-button>
    <el-radio-button :value="true">折叠</el-radio-button>
  </el-radio-group>
  <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
    @close="handleClose">
    <template>
      <div>
        <template v-for="item in treeData">
          <el-sub-menu :index="item.id" v-if="item.children && item.children.length > 0">
            <template slot="title">
              {{ item.name }}
            </template>
            <collapse :treeData="item.children"></collapse>
          </el-sub-menu>
          <el-menu-item 
          v-else-if="item.children && item.children.length === 0"
          :index="item.path" 
          :key="item.id"
          >
          {{ item.name }}</el-menu-item>

          </el-menu-item>
        </template>
      </div>
    </template>





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
