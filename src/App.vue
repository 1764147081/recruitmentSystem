<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <img src='./assets/logo.png' alt="logo" id="logo"></img>
        <div class="name">yourName</div>
        <Avatar/>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Collapse></Collapse>
        </el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup lang="ts">
import Avatar from './components/Avatar.vue';
import Collapse from './components/Collapse.vue';




</script>

<style scoped>
#logo {
  height: 65%;
  margin-top: 25px;
  margin-left: 40px;

}

.all {
  height: 98vh;
  width: 100vw;
  max-width: 100%;
  /* 防止内部元素导致溢出 */
  max-height: 100%;
}

.el-header {
  background-color: rgba(159, 35, 26, 1);
  height: 14vh;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

}

.el-aside {
  border: 2px solid rgba(204, 204, 204, 1);
  height: 84vh;
  width: 30vh;
}

.el-main {
  border: 2px solid rgba(204, 204, 204, 1);
  border-bottom-right-radius: 25px;
}
.name{
  font-size: 20px;
  height: 20px;
  width:100px;
  margin-left: 85vw;
  margin-top: -7vh;
}
</style>
