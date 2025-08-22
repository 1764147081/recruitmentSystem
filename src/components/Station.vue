<template>
  <el-table :data="userInfo" style="width: 100%">
    <el-table-column prop="name" label="姓名" width="300" />
    <el-table-column prop="depart" label="学院" width="300" />
    <el-table-column prop="username" label="学号" width="300" />
    <el-table-column  label="操作" min-width="300">
      <template #default="scope">
        <el-button link size="small" @click="handleClick(scope.row)">
          查看
        </el-button>
     </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
const props = defineProps({
  departmentId: {
    type: Number,
    required: true
  },
})

import { ref, watch } from 'vue'
import { getFinishedQuestionnaire, getUserInfoByUsername } from '../services/user';

interface User {
  username: number,
  depart: string,
  name: string,
}

const handleClick = (row: User) => {
  console.log('点击查看:', row)
}

const userInfo = ref<User[]>([])

// 监听departmentId变化，重新获取数据
watch(() => props.departmentId, async (newVal) => {
  if (newVal) {
    try {
      await getFinish() // 等待获取完成
    } catch (error) {
      console.log(error)
      userInfo.value = []
    }
  }
})  

async function getFinish() {
  try {
    // 先清空现有数据
    userInfo.value = []
    
    const res = await getFinishedQuestionnaire(props.departmentId)
    if (res.code === 200 && res.data && res.data.length) {
      console.log('问卷数据:', res.data)
      
      // 创建临时数组存储结果，避免频繁更新DOM
      const tempUsers: User[] = []
      
      // 循环获取每个用户的详细信息
      for (const item of res.data) {
        try {
          const userDetail = await getUserInfoByUsername(item.username)
          console.log('用户详情:', userDetail)

          if (userDetail.code === 200 && userDetail.data) {
            tempUsers.push({
              username: item.username,
              depart: userDetail.data.depart || '',
              name: userDetail.data.name || ''
            })
          } else {
            // 如果获取详情失败，至少保留用户名
            tempUsers.push({
              username: item.username,
              depart: '无权访问',
              name: '无权访问'
            })
          }
        } catch (error) {
          console.log(`获取用户${item.username}信息失败:`, error)
          tempUsers.push({
            username: item.username,
            depart: '获取失败',
            name: '获取失败'
          })
        }
      }
      
      // 一次性更新数组，减少DOM更新次数
      userInfo.value = tempUsers
    }
  } catch (error) {
    console.log('获取问卷数据失败:', error)
    userInfo.value = []
  }
}
</script>
