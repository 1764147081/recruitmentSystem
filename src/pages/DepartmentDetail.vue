<template>
	<div class="department-detail">
		<el-tabs v-model="activeTab" type="border-card" class="department-tabs">
			<el-tab-pane label="情况总览" name="overview" v-if="departmentInfo.name">
				<h1>{{ departmentInfo.name }}</h1>
				<div class="stats-container">
					<div class="stat-box">
						<div class="stat-value">{{ departmentInfo.totalRegistrations ||0}}</div>
						<div class="stat-label">总报名人数</div>
					</div>
					<div class="poster-container">
						<img v-if="departmentInfo.image" :src="departmentInfo.image" alt="部门海报" class="poster-image" />
						<div v-else class="poster-placeholder">海报区域</div>
					</div>
				</div>
				<h1>部门描述</h1>
				<div class="description-box">
					<p v-if="departmentInfo.description">{{ departmentInfo.description }}</p>
					<p v-else>该部门暂无介绍</p>
				</div>
				<!-- 可以添加更多部门信息字段 -->
				<h1>页面管理员</h1>
				<div class="admin-info">
					<div class="admin-cards" v-if="departmentInfo.administrators && Array.isArray(departmentInfo.administrators)">
						<div class="admin-card" v-for="admin in departmentInfo.endAdmin" :key="admin.username">
							<div class="admin-header">
								<img class="admin-avatar" :src="admin.avatar || '/default-avatar.png'" :alt="admin.name" />
								<div class="admin-name">{{ admin.name }}</div>
							</div>
							<div class="admin-details">
								<div class="admin-contact">用户名: {{ admin.username }}</div>
								<div class="admin-contact" v-if="admin.qq">QQ: {{ admin.qq }}</div>
								<div class="admin-contact" v-if="admin.email">邮箱: {{ admin.email }}</div>
							</div>
						</div>
					</div>
					<div v-else>
						<p>暂无管理员信息</p>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="报名管理" name="registration">
				<Station v-if="activeTab === 'registration'" :departmentId="departmentInfo.id" />
			</el-tab-pane>
			<el-tab-pane label="题库管理" name="questionBank">
				<Question v-if="activeTab === 'questionBank'" :departmentId="departmentInfo.id || 0" />
			</el-tab-pane>
		</el-tabs>

		<!-- 管理员信息 -->

	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch
	} from 'vue';
	import {
		useRoute
	} from 'vue-router';
	import {
		getDepartmentInfo,
		getDepartmentIdByStationId
	} from '../services/user.js';
	import {
		ElTabs,
		ElTabPane
	} from 'element-plus';
	import {
		request
	} from '../services/1.js';
	import Station from '../components/Station.vue'
	import Question from '../components/Question.vue'


	// 获取路由参数
	const route = useRoute();

	// 活动标签页
	const activeTab = ref('overview');

	// 部门信息
	const departmentInfo = ref({
		id: '',
		stationId: null,
		name: '',
		description: '',
		totalRegistrations: 0,
		administrators: [],
		endAdmin: [],
		image: ''
	});
	const usernames = ref([])

	// 获取部门详细信息
	const fetchDepartmentInfo = async (stationId) => {

		try {
			const data = await getDepartmentInfo(stationId);
			if (data) {
				departmentInfo.value = data.data;
				await getAdmin();
				await getQuestionnaire()
			} else {
				console.warn('部门信息响应数据为空');
			}
		} catch (error) {
			console.error('获取部门信息失败:', error);
		}
	};

	async function getAdmin() {
		// 确保stationId有效后再发送请求
		if (!departmentInfo.value.stationId) {
			console.warn('stationId is not available yet');
			return;
		}
		try {
			const res = await request({
				url: `/permission/show/station?stationId=${departmentInfo.value.stationId}`,
			});
			// 处理响应数据
			if (res && res.data) {
				departmentInfo.value.administrators = res.data;
				await getEndingAdmin()
			} else if (res) {
				// 如果res存在但res.data不存在，直接使用res
				departmentInfo.value.administrators = res;
			} else {
				console.warn('管理员信息响应数据为空');
			}
		} catch (error) {
			console.error('获取管理员信息失败:', error);
		}
	}

	async function getQuestionnaire() {
		// 确保departmentId有效后再发送请求
		if (!departmentInfo.value.id) {
			console.warn('departmentId is not available yet');
			return;
		}
		try {
			const res = await request({
				url: `/department/view/questionnaire?departmentId=${departmentInfo.value.id}`
			});
			if (res && res.data) {
				departmentInfo.value.totalRegistrations = res.data.collected || 0;
			} else if (res) {
				departmentInfo.value.totalRegistrations = res.collected || 0;
			} else {
				console.warn('问卷信息响应数据为空');
			}
		} catch (error) {
			console.error('获取问卷信息失败:', error);
		}
	}
	async function getUserInfo(username) {
		const res = await request({
			url: `/user/info?username=${username}`
		})
		return res.data
	}
	async function getEndingAdmin() {
		departmentInfo.value.endAdmin = await Promise.all(departmentInfo.value.administrators.map(async (val) => {
			let a = await getUserInfo(val.username);
			return a;
		}));
	}




	// 组件挂载时获取部门信息
	onMounted(async () => {
		await fetchDepartmentInfo(route.params.stationId);

	});

	// 监听路由参数变化
	watch(
		() => route.params.stationId,
		async (newId) => {
			await fetchDepartmentInfo(newId);
			console.log(departmentInfo.value);
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

	/* 管理员卡片样式 */
	.admin-cards {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin-top: 15px;
	}

	.admin-card {
		background: #f5f7fa;
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		padding: 20px;
		width: calc(50% - 10px);
		box-sizing: border-box;
	}

	.admin-header {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
	}

	.admin-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin-right: 15px;
		object-fit: cover;
	}

	.admin-name {
		font-size: 18px;
		font-weight: bold;
		color: #303133;
	}

	.admin-details {
		color: #606266;
	}

	.admin-contact {
		margin-bottom: 5px;
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