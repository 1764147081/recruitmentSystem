<template>
	<div class="department-detail">
		<el-tabs v-model="activeTab" type="border-card" class="department-tabs">
			<el-tab-pane label="情况总览" name="overview" v-if="departmentInfo.name">
				<div class="tab-content">
					<div class="department-header">
						<div class="header-gradient"></div>
						<h1 class="department-title">{{ departmentInfo.name }}</h1>
						<div class="title-decoration"></div>
					</div>
					
					<div class="stats-container">
						<div class="stat-box">
							<div class="stat-icon">📊</div>
							<div class="stat-value">{{ departmentInfo.totalRegistrations || 0}}</div>
							<div class="stat-label">总报名人数</div>
						</div>
						<div class="poster-container">
							<img v-if="departmentInfo.image" :src="departmentInfo.image" alt="部门海报" class="poster-image" />
							<div v-else class="poster-placeholder">
								<div class="placeholder-icon">🖼️</div>
								<div class="placeholder-text">海报区域</div>
							</div>
						</div>
					</div>
					
					<div class="section">
						<h2 class="section-title">
							<span class="title-icon">📝</span>
							部门描述
						</h2>
						<div class="description-box">
							<p v-if="departmentInfo.description">{{ departmentInfo.description }}</p>
							<p v-else class="empty-state">该部门暂无介绍</p>
						</div>
					</div>
					
					<div class="section">
						<h2 class="section-title">
							<span class="title-icon">👥</span>
							页面管理员
						</h2>
						<div class="admin-info">
							<div class="admin-cards" v-if="departmentInfo.administrators && Array.isArray(departmentInfo.administrators)">
								<div class="admin-card" v-for="admin in departmentInfo.endAdmin" :key="admin.username">
									<div class="admin-header">
										<div class="admin-avatar-wrapper">
											<img class="admin-avatar" :src="admin.avatar || default_avatar" :alt="admin.name" />
											<div class="avatar-ring"></div>
										</div>
										<div class="admin-name">{{ admin.name }}</div>
									</div>
									<div class="admin-details">
										<div class="admin-contact">
											<span class="contact-label">用户名:</span> 
											<span class="contact-value">{{ admin.username }}</span>
										</div>
										<div class="admin-contact" v-if="admin.qq">
											<span class="contact-label">QQ:</span> 
											<span class="contact-value">{{ admin.qq }}</span>
										</div>
										<div class="admin-contact" v-if="admin.email">
											<span class="contact-label">邮箱:</span> 
											<span class="contact-value">{{ admin.email }}</span>
										</div>
									</div>
								</div>
							</div>
							<div v-else class="empty-state">
								<div class="empty-icon">👤</div>
								<p>暂无管理员信息</p>
							</div>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="报名管理" name="registration">
				<div class="tab-content">
					<Station v-if="activeTab === 'registration'" :departmentId="departmentInfo.id" />
				</div>
			</el-tab-pane>
			<el-tab-pane label="题库管理" name="questionBank">
				<div class="tab-content">
					<Question v-if="activeTab === 'questionBank'" :departmentId="departmentInfo.id || 0" />
				</div>
			</el-tab-pane>
		</el-tabs>
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
	import default_avatar from '../../public/avatar.png'


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
		padding: 24px;
		background: linear-gradient(135deg, #faf5f5 0%, #f0e6e6 100%);
		min-height: 100vh;
	}

	/* Enhanced Tabs Styling */
	.department-tabs {
		width: 100%;
		background: #ffffff;
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.department-tabs :deep(.el-tabs__header) {
		margin: 0;
		background: linear-gradient(135deg, rgba(159, 35, 26, 1) 0%, rgba(139, 25, 16, 1) 100%);
		padding: 0;
		position: relative;
	}

	.department-tabs :deep(.el-tabs__nav-wrap) {
		padding: 8px;
	}

	.department-tabs :deep(.el-tabs__nav) {
		width: 100%;
		display: flex;
		border: none;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.1);
		padding: 4px;
	}

	.department-tabs :deep(.el-tabs__item) {
		flex: 1;
		text-align: center;
		color: rgba(255, 255, 255, 0.8);
		border: none;
		border-radius: 10px;
		margin: 0 4px;
		padding: 12px 20px;
		font-weight: 500;
		transition: all 0.3s ease;
		background: transparent;
		position: relative;
		overflow: hidden;
	}

	.department-tabs :deep(.el-tabs__item:before) {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
		border-radius: 10px;
	}

	.department-tabs :deep(.el-tabs__item:hover:before) {
		opacity: 1;
	}

	.department-tabs :deep(.el-tabs__item:hover) {
		color: rgba(159, 35, 26, 1);
		background: rgba(255, 255, 255, 0.9);
		transform: translateY(-2px);
	}

	.department-tabs :deep(.el-tabs__item.is-active) {
		color: rgba(159, 35, 26, 1);
		background: #ffffff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(-1px);
	}

	.department-tabs :deep(.el-tabs__active-bar) {
		display: none;
	}

	.department-tabs :deep(.el-tabs__content) {
		padding: 0;
	}

	.tab-content {
		padding: 32px;
		animation: fadeInUp 0.6s ease;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Department Header */
	.department-header {
		text-align: center;
		margin-bottom: 40px;
		position: relative;
	}

	.header-gradient {
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		width: 200px;
		height: 4px;
		background: linear-gradient(90deg, rgba(159, 35, 26, 1), rgba(179, 45, 36, 1), rgba(159, 35, 26, 1));
		border-radius: 2px;
		animation: shimmer 2s ease-in-out infinite;
	}

	@keyframes shimmer {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.department-title {
		font-size: 2.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, rgba(159, 35, 26, 1) 0%, rgba(179, 45, 36, 1) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 20px 0 10px 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.title-decoration {
		width: 60px;
		height: 2px;
		background: linear-gradient(90deg, rgba(159, 35, 26, 1), rgba(179, 45, 36, 1));
		margin: 0 auto;
		border-radius: 1px;
	}

	/* Section Styling */
	.section {
		margin-bottom: 40px;
	}

	.section-title {
		display: flex;
		align-items: center;
		font-size: 1.5rem;
		font-weight: 600;
		color: #2c3e50;
		margin-bottom: 20px;
		padding-bottom: 10px;
		border-bottom: 2px solid #e1e8ed;
		position: relative;
	}

	.section-title:after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 60px;
		height: 2px;
		background: linear-gradient(90deg, rgba(159, 35, 26, 1), rgba(179, 45, 36, 1));
	}

	.title-icon {
		margin-right: 12px;
		font-size: 1.2em;
	}

	/* Stats Container */
	.stats-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 32px 0;
		gap: 40px;
		min-height: 400px;
	}

	.stat-box {
		text-align: center;
		padding: 32px 24px;
		border-radius: 20px;
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		aspect-ratio: 1 / 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 200px;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.2);
		position: relative;
		overflow: hidden;
	}

	.stat-box:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(159, 35, 26, 0.1) 0%, rgba(179, 45, 36, 0.1) 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.stat-box:hover:before {
		opacity: 1;
	}

	.stat-box:hover {
		transform: translateY(-8px);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
	}

	.stat-icon {
		font-size: 2rem;
		margin-bottom: 12px;
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, rgba(159, 35, 26, 1) 0%, rgba(179, 45, 36, 1) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 8px;
	}

	.stat-label {
		font-size: 14px;
		color: #6c757d;
		font-weight: 500;
	}

	/* Poster Container */
	.poster-container {
		width: 320px;
		height: 400px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20px;
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.poster-container:hover {
		transform: translateY(-4px);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
	}

	.poster-image {
		max-width: 100%;
		max-height: 100%;
		border-radius: 16px;
		transition: transform 0.3s ease;
	}

	.poster-image:hover {
		transform: scale(1.05);
	}

	.poster-placeholder {
		text-align: center;
		color: #6c757d;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.placeholder-icon {
		font-size: 3rem;
		margin-bottom: 12px;
		opacity: 0.5;
	}

	.placeholder-text {
		font-size: 16px;
		font-weight: 500;
	}

	/* Description Box */
	.description-box {
		padding: 32px;
		border-radius: 16px;
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
	}

	.description-box:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
	}

	.description-box p {
		font-size: 16px;
		line-height: 1.6;
		margin: 0;
		color: #495057;
	}

	/* Admin Cards */
	.admin-info {
		padding: 32px;
		border-radius: 16px;
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.admin-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 24px;
		margin-top: 20px;
	}

	.admin-card {
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		border-radius: 16px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
		padding: 24px;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.2);
		position: relative;
		overflow: hidden;
	}

	.admin-card:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(159, 35, 26, 0.05) 0%, rgba(179, 45, 36, 0.05) 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.admin-card:hover:before {
		opacity: 1;
	}

	.admin-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
	}

	.admin-header {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}

	.admin-avatar-wrapper {
		position: relative;
		margin-right: 16px;
	}

	.admin-avatar {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		object-fit: cover;
		border: 3px solid #ffffff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		display: block;
		flex-shrink: 0;
	}

	.avatar-ring {
		position: absolute;
		top: -4px;
		left: -4px;
		width: calc(100% + 8px);
		height: calc(100% + 8px);
		border-radius: 50%;
		background: linear-gradient(45deg, rgba(159, 35, 26, 1), rgba(179, 45, 36, 1));
		z-index: -1;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.admin-card:hover .avatar-ring {
		opacity: 1;
	}

	.admin-name {
		font-size: 18px;
		font-weight: 600;
		color: #2c3e50;
		margin: 0;
	}

	.admin-details {
		color: #6c757d;
		position: relative;
		z-index: 1;
	}

	.admin-contact {
		margin-bottom: 8px;
		display: flex;
		align-items: center;
		font-size: 14px;
	}

	.contact-label {
		font-weight: 500;
		margin-right: 8px;
		color: #495057;
	}

	.contact-value {
		color: rgba(159, 35, 26, 1);
		font-weight: 500;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		color: #6c757d;
		padding: 40px 20px;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 16px;
		opacity: 0.5;
	}

	.empty-state p {
		margin: 0;
		font-size: 16px;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.department-detail {
			padding: 16px;
		}

		.tab-content {
			padding: 20px;
		}

		.department-title {
			font-size: 2rem;
		}

		.stats-container {
			flex-direction: column;
			gap: 24px;
			min-height: auto;
		}

		.stat-box {
			width: 100%;
			aspect-ratio: auto;
			min-height: 120px;
		}

		.poster-container {
			width: 100%;
			max-width: 300px;
		}

		.admin-cards {
			grid-template-columns: 1fr;
		}

		.department-tabs :deep(.el-tabs__item) {
			font-size: 14px;
			padding: 10px 16px;
		}
	}

	@media (max-width: 480px) {
		.department-tabs :deep(.el-tabs__nav) {
			flex-direction: column;
			gap: 4px;
		}

		.department-tabs :deep(.el-tabs__item) {
			margin: 0;
			margin-bottom: 4px;
		}
	}
</style>