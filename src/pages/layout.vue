<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-container">
        <img src='@/assets/logo.png' alt="logo" id="logo"></img>
        <div class="name">yourName</div>
        <Avatar/>
        <RouterLink :to="{name:'login'}">
          <el-button>登录</el-button>
        </RouterLink>
      </el-header>
      <el-container>
        <el-aside >
        <!-- width="200px" v-for="(item,index) of $store.state.userRouters"  -->
        
          <!-- <Collapse :key="index" :item="item" /> -->
        </el-aside>
        <el-main>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
//import Avatar from '@/components/Avatar.vue';
//import Collapse from './components/Collapse.vue';
</script>
<style scoped>

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

#logo {
  height: 60px;
  
}

.el-header {
  position: fixed;
 
  background-color: rgba(159, 35, 26, 1);
  height: 100px;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

}

.el-aside {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  border: 2px solid rgba(204, 204, 204, 1);
  height: 100%;
  width: 200px;
  padding-top: 120px;
}

.el-main {
  border: 2px solid rgba(204, 204, 204, 1);
  border-bottom-right-radius: 25px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 120px 30px 30px 230px; 
}
.name{
  font-size: 20px;
  
}
</style>