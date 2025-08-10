<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-container">
        <img src='@/assets/logo.png' alt="logo" id="logo"></img>
        
        <RouterLink :to="{name:'login'}" v-if="!user.getIsLogin">
          <el-button>登录</el-button>
        </RouterLink>
        <div class="name" v-if="user.getIsLogin">名字</div>
        

      </el-header>
      <el-container>
        <el-aside>
          <el-row class="tac">
            <el-col :span="24"> 
              <h3 class="edit" @click="handleEditClick">组织目录</h3>

              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">
                
                <!-- 我的管理 -->
                <el-sub-menu index="1">
                  <template #title>
                    <span>我的管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="11">选项1</el-menu-item>
                    <el-menu-item index="12">选项2</el-menu-item>
                  </el-menu-item-group>
                </el-sub-menu>
                
                <!-- 我的收藏 -->
                <el-sub-menu index="2">
                  <template #title>
                    <span>我的收藏</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="21">选项1</el-menu-item>
                    <el-menu-item index="22">选项2</el-menu-item>
                  </el-menu-item-group>
                </el-sub-menu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
         <RouterView/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { RouterLink,useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { useStationStore } from '../store/station'
import { Avatar } from '@element-plus/icons-vue'



const router = useRouter()
const user = useUserStore()

const handleEditClick=()=>{
  router.push({name:'stationIndex'})
}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
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
  top: 100px; 
  left: 0;
  width: 200px;
  height: calc(100% - 100px); 
  padding-top: 20px; 
  background: #fff; 
  border-right: 2px solid #e6e6e6; 
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05); 
}

.el-main {
  margin-left: 200px; 
  margin-top: 100px; 
  padding: 20px;
  height: calc(100% - 100px);
}
.name{
  font-size: 20px;
  color:white;
}
.edit{
  margin-left: 20px;
}
</style>