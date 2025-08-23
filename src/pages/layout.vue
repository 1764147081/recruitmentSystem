<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-container">
        <img src='@/assets/logo.png' alt="logo" id="logo"></img>

        <RouterLink :to="{ name: 'login' }" v-if="!user.getToken || user.getToken === '--'">
          <el-button>登录</el-button>
        </RouterLink>
        <div class="user-info" v-else>
          <el-avatar :src="userInfo.avatar" @click="goToProfile" class="user-avatar"></el-avatar>
          <span class="user-name">{{ userInfo.name }}</span>
        </div>


      </el-header>
      <el-container>
        <el-aside>
          <el-row class="tac">
            <el-col :span="24">
              <h3 class="edit" @click="handleEditClick">组织目录</h3>

              <el-menu default-active="2" class="el-menu-vertical-demo">

                <el-sub-menu index="1">
                  <template #title>
                    <span>我的管理</span>
                  </template>
                  <template v-for="station in stationTree" :key="station.id">
                    <el-menu-item v-if="station.isDepartment === 1" :index="station.id.toString()"
                      class="department-node" @click="goToDepartment(station.id)">
                      {{ station.name }}
                    </el-menu-item>
                    <el-sub-menu v-else :index="station.id.toString()">
                      <template #title>{{ station.name }}</template>
                      <!-- 递归渲染子站点 -->
                      <template v-for="child in station.children" :key="child.id">
                        <el-menu-item v-if="child.isDepartment === 1" :index="child.id.toString()"
                          class="department-node" @click="goToDepartment(child.id)">
                          {{ child.name }}
                        </el-menu-item>
                        <el-sub-menu v-else :index="child.id.toString()">
                          <template #title>{{ child.name }}</template>
                          <!-- 继续递归渲染子站点 -->
                          <template v-for="grandchild in child.children" :key="grandchild.id">
                            <el-menu-item v-if="grandchild.isDepartment === 1" :index="grandchild.id.toString()"
                              class="department-node" @click="goToDepartment(grandchild.id)">
                              {{ grandchild.name }}
                            </el-menu-item>
                            <el-sub-menu v-else :index="grandchild.id.toString()">
                              <template #title>{{ grandchild.name }}</template>
                              <!-- 可以继续添加更多层级 -->
                            </el-sub-menu>
                          </template>
                        </el-sub-menu>
                      </template>
                    </el-sub-menu>
                  </template>
                </el-sub-menu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>

          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { useStationStore } from '../store/station'

import { getUserInfo, getQuestionnaireStatus, unfoldStation } from '../services/user'
import { ref, onBeforeMount, reactive, h } from 'vue'

const baseURL = "https://i.sdu.edu.cn/XSZX/NXXT/api"

const router = useRouter()
const user = useUserStore()
console.log('此时为从user里拿', user.token)

// 用户信息
const userInfo = ref({
  name: '名字',
  avatar: '',
  username: ''
})



// 站点树数据
interface Station {
  id: number
  name: string
  isDepartment: number
  children?: Station[]
}

const stationTree = ref<Station[]>([])

// 获取站点树
const fetchStationTree = async (stationId: number) => {
  try {
    console.log('正在获取站点ID为', stationId, '的站点树')
    const res = await unfoldStation(stationId)
    console.log('获取站点树响应:', res)
    if (res && res.data) {
      // 递归处理子站点
      const processChildren = async (items: Station[]) => {
        for (let item of items) {
          console.log('处理站点:', item)

          // 如果不是部门，则继续获取子站点
          if (item.isDepartment !== 1) {
            console.log('站点', item.id, '不是部门，继续获取子站点')

            try {
              const childRes = await unfoldStation(item.id)
              console.log('获取子站点响应:', childRes)
              if (childRes && childRes.data) {
                item.children = childRes.data
                if (item.children) {
                  await processChildren(item.children)
                }
              }
            } catch (error) {
              // 处理404错误，不影响其他节点的渲染
              console.warn('获取子站点失败，可能无子菜单:', item.id, error)
              // 即使出错也继续处理其他节点
            }
          } else {
            console.log('站点', item.id, '是部门，跳过获取子站点')
          }
        }
      }

      // 处理顶层站点
      await processChildren(res.data)
      stationTree.value = res.data
      console.log('最终站点树:', stationTree.value)
    }
  } catch (error) {
    console.error('获取站点树失败:', error)
  }
}

// 初始化站点数据
const initializeStationData = async () => {
  // 只有在用户已登录的情况下才获取站点数据
  if (!user.getToken || user.getToken === '--') {
    console.log('用户未登录，跳过站点数据初始化')
    return
  }

  try {

    console.log('开始初始化站点数据')
    async function getPermission() {
      const username = parseInt(userInfo.value.username)
      const res = await fetch(`${baseURL}/permission/show/user?username=${username}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.getToken}`
        }
      }).then(res=>res.json())
      return res.data[0].stationId
    }
   const rootStationId = await getPermission()
    console.log('使用根站点ID获取站点树:', rootStationId)
    await fetchStationTree(rootStationId)
  } catch (error) {
    console.error('初始化站点数据失败:', error)

  }
}
async function fetchUserInfo() {
  try {
    const response = await fetch(`${baseURL}/user/info`, {
      headers: {
        'Authorization': `Bearer ${user.getToken}`
      }
    })
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 初始化用户状态
const initializeUserState = async () => {
  // 检查存储中的token
  const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (storedToken && storedToken !== '--') {
    user.changeToken(storedToken);
    user.changeIsLogin();

    // 获取用户信息
    try {
      const data = await fetchUserInfo();
      userInfo.value.name = data.data.name || '名字';
      userInfo.value.avatar = data.data.avatar || '';
      userInfo.value.username = data.data.username || '';
      console.log('用户信息:', data);

      // 保存用户信息到store
      user.changeUserInfo(data.data);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  }
};

// 在页面加载前初始化用户状态
onBeforeMount(async () => {
  await initializeUserState();
  await initializeStationData();
})

// 跳转到个人信息页面
const goToProfile = () => {
  router.push({ name: 'profile' })
}

// 跳转到部门详细页
const goToDepartment = (departmentId: number) => {
  router.push({ name: 'departmentDetail', params: { id: departmentId } })
}

const handleEditClick = () => {
  router.push({ name: 'stationIndex' })
}

// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }

// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath)
// }
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

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  cursor: pointer;
}

.user-name {
  font-size: 20px;
  color: white;
}

.edit {
  margin-left: 20px;
}

/* 美化导航栏菜单 */
.el-menu-vertical-demo {
  border-right: none;
  background-color: transparent;
}

/* 显示所有节点的下拉菜单箭头 */
.el-menu-vertical-demo :deep(.el-sub-menu__icon-arrow) {
  display: inline-block !important;
}

.el-menu-vertical-demo .el-sub-menu__title,
.el-menu-vertical-demo .el-menu-item {
  font-size: 14px;
  color: #333;
  height: 40px;
  line-height: 40px;
  border: 1px solid #e8e8e8;
  margin-bottom: -1px;
  border-radius: 0px;
}

/* 移除最后一个元素的下边框 */
.el-menu-vertical-demo .el-sub-menu__title:last-child,
.el-menu-vertical-demo .el-menu-item:last-child {
  border-bottom: none;
}

/* 移除第一个元素的上边框 */
.el-menu-vertical-demo .el-sub-menu__title:first-child,
.el-menu-vertical-demo .el-menu-item:first-child {
  border-top: none;
}

.el-menu-vertical-demo .el-sub-menu__title:hover,
.el-menu-vertical-demo .el-menu-item:hover {
  background-color: #f5f5f5;
  border-radius: 0px;
}

.el-menu-vertical-demo .el-sub-menu.is-active .el-sub-menu__title,
.el-menu-vertical-demo .el-menu-item.is-active {
  color: #1890ff;
  background-color: #e6f7ff;
  border-radius: 0px;
}

/* 站点树标题样式 */
.el-sub-menu .el-sub-menu__title {
  font-weight: 500;
}

/* 部门节点特殊样式 */
.el-menu-vertical-demo .department-node {
  background-color: #f0f8ff;
  color: #1890ff;
  font-weight: 500;
  border-left: 3px solid #1890ff;
}

.el-menu-vertical-demo .department-node:hover {
  background-color: #e6f7ff;
}

.el-menu-vertical-demo .department-node.is-active {
  background-color: #1890ff;
  color: white;
  border-left: 3px solid #0056b3;
  font-weight: bold;
}
</style>