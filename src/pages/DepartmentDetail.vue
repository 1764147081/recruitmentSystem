<template>
  <div class="department-detail">
    <el-tabs v-model="activeTab" type="border-card" class="department-tabs">
      <el-tab-pane label="情况总览" name="overview">
        <h1>{{ departmentInfo.name }}</h1>
        <div class="stats-container">
          <div class="stat-box">
            <div class="stat-value">{{ departmentInfo.totalRegistrations || 0 }}</div>
            <div class="stat-label">总报名人数</div>
          </div>
          <div class="poster-container">
            <img v-if="departmentInfo.image" :src="departmentInfo.image" alt="部门海报" class="poster-image" />
            <div v-else class="poster-placeholder">海报区域</div>
          </div>
        </div>
        <h1>部门描述</h1>
        <div class="description-box">
          <p>{{ departmentInfo.description }}</p>
        </div>
        <!-- 可以添加更多部门信息字段 -->
         <h1>页面管理员</h1>
        <div class="admin-info">
      <ul class="admin-list">
        <li v-for="admin in departmentInfo.administrators" :key="admin.id">
          <span class="admin-name">{{ admin.name }}</span>
          <span class="admin-contact">{{ admin.contact }}</span>
        </li>
      </ul>
    </div>
      </el-tab-pane>
      <el-tab-pane label="报名管理" name="registration">
        <p>这里是报名管理内容</p>
      </el-tab-pane>
      <el-tab-pane label="题库管理" name="questionBank">
        <p>这里是题库管理内容</p>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 管理员信息 -->
    
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getDepartmentInfo } from '../services/user.js';
import { ElTabs, ElTabPane } from 'element-plus';
import {request} from '../services/1.js';

// 获取路由参数
const route = useRoute();

// 活动标签页
const activeTab = ref('overview');

// 部门信息
const departmentInfo = ref({
  id: '',
  stationId:null,
  name: '',
  description: '',
  totalRegistrations: 1,
  administrators: [],
  image:''
});
const usernames=ref([])

// 获取部门详细信息
const fetchDepartmentInfo = async (stationId) => {
  try {
    const res = await getDepartmentInfo(stationId);
    if (res && res.data) {
      departmentInfo.value = res.data;
    }
    console.log('获取部门信息成功:', res.data);
  } catch (error) {
    console.error('获取部门信息失败:', error);
  }
};

async function getAdmin(){
  const res = await request({
    url: `/permission/show/station?stationId=${departmentInfo.value.stationId}`,
  })
}
async function getQuestionnaire(){
	const res = await request({
		url
	})
}
// 组件挂载时获取部门信息
onMounted(async() => {
  await fetchDepartmentInfo(route.params.stationId);
  await getAdmin()
});

// 监听路由参数变化
watch(
  () => route.params.stationId,
  (newId) => {
    fetchDepartmentInfo(newId);
	getAdmin()
  }
);
</script>

<style scoped>
.department-detail {
  padding: 20px;
  padding-top: 0;
}



.department-tabs {
  width: 100%;
  margin-top: 20px;
}

.department-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.department-tabs :deep(.el-tabs__nav) {
  width: 100%;
}

.department-tabs :deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
}

.department-detail p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  gap: 50px;
  height: 450px;
}

.stat-box {

  text-align: center;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 15%;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.poster-container {
  width: 300px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.poster-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

.poster-placeholder {
  color: #909399;
  font-size: 16px;
}

.description-box {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.description-box h3 {
  margin-top: 0;
  color: #409eff;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.description-box p {
  font-size: 16px;
  line-height: 1.5;
  margin: 10px 0 0 0;
  color: #606266;
}

.admin-info {
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.admin-info h2 {
  margin-top: 0;
  color: #409eff;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.admin-list {
  list-style: none;
  padding: 0;
}

.admin-list li {
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
}

.admin-list li:last-child {
  border-bottom: none;
}

.admin-name {
  font-weight: bold;
  color: #606266;
}

.admin-contact {
  color: #909399;
}
</style>