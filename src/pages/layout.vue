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
		</el-container>
		<el-container class="el-menu-vertical-demo" :router="false" @select="onMenuSelect">
			<el-aside>
				<el-row class="tac">
					<el-col :span="24">
						<h3 class="edit" @click="handleEditClick">我的管理</h3>
						<!-- <el-menu class="el-menu-vertical-demo" :router="false">
							<el-sub-menu index="1">
								<template #title>
									<span>组织目录</span>
								</template>
								<template v-for="station in stationTree" :key="station.id">
									<el-menu-item v-if="station.isDepartment === 1" :index="station.id.toString()"
										:class="{ 'department-node': true }"
										@click="goToDepartment(station.id,station.permitted)">
										{{ station.name }}
									</el-menu-item>
									<el-sub-menu v-else :index="station.id.toString()">
										<template #title>{{ station.name }}</template>

										<template v-for="child in station.children" :key="child.id">
											<el-menu-item v-if="child.isDepartment === 1" :index="child.id.toString()"
												:class="{ 'department-node': true }"
												@click="goToDepartment(child.id,child.permitted)">
												{{ child.name }}
											</el-menu-item>
											<el-sub-menu v-else :index="child.id.toString()">
												<template #title>{{ child.name }}</template>

												<template v-for="grandchild in child.children" :key="grandchild.id">
													<el-menu-item v-if="grandchild.isDepartment === 1"
														:index="grandchild.id.toString()"
														:class="{ 'department-node': true }"
														@click="goToDepartment(grandchild.id,grandchild.permitted)">
														{{ grandchild.name }}
													</el-menu-item>
													<el-sub-menu v-else :index="grandchild.id.toString()">
														<template #title>{{ grandchild.name }}</template>

													</el-sub-menu>
												</template>
											</el-sub-menu>
										</template>
									</el-sub-menu>
								</template>
							</el-sub-menu>
						</el-menu> -->
						<el-menu>
							<NavMenu :navMenus="leftMenus"></NavMenu>
						</el-menu>
					</el-col>
				</el-row>
			</el-aside>
		</el-container>
		<el-container>
			<el-main>
				<RouterView />
			</el-main>
		</el-container>
	</div>
</template>

<script setup lang="ts">
	import {
		ElMessage,
		ElMessageBox,

		ElTableColumn,
		ElButton,
		ElDropdown,
		ElDropdownMenu,
		ElDropdownItem,
		ElIcon
	} from 'element-plus'
	import { RouterLink, useRouter, useRoute } from 'vue-router'
	import { useUserStore } from '../store/user'
	import { useStationStore } from '../store/station'
	import NavMenu from '../components/NavMenu.vue'

	import { getUserInfo, getQuestionnaireStatus, unfoldStation } from '../services/user'
	import { ref, onBeforeMount, reactive, h, computed } from 'vue'
	import { request } from '@/services/1.js'

	const baseURL = "https://i.sdu.edu.cn/XSZX/NXXT/api"
	const onMenuSelect = () => false
	const router = useRouter()
	const route = useRoute()
	const user = useUserStore()

	// 用户信息
	const userInfo = ref({
		name: '请重新登录',
		avatar: '',
		username: ''
	})
	const permission = ref([{}])
	// 站点树数据
	interface Station {
		id : number
		name : string
		isDepartment : number
		permitted : boolean
		children ?: Station[]
	}
	const leftMenus = ref([])
	const stationTree = ref<Station[]>([])

	async function getPermission() {
		const res = await request({
			url: `/permission/show/user`
		})
		permission.value = res.data
	}



	// 获取站点树
	// const fetchStationTree = async (stationId : number) => {
	// 	try {
	// 		const res = await unfoldStation(stationId)
	// 		if (res && res.data) {
	// 			// 递归处理子站点
	// 			const processChildren = async (items : Station[]) => {
	// 				for (let item of items) {
	// 					// 如果不是部门，则继续获取子站点
	// 					if (item.isDepartment !== 1) {
	// 						try {
	// 							const childRes = await unfoldStation(item.id)
	// 							if (childRes && childRes.data) {
	// 								item.children = childRes.data
	// 								if (item.children) {
	// 									await processChildren(item.children)
	// 								}
	// 							}
	// 						} catch (error) {
	// 							// 处理404错误，不影响其他节点的渲染
	// 							console.warn('获取子站点失败，可能无子菜单:', item.id, error)
	// 							// 即使出错也继续处理其他节点
	// 						}
	// 					} else {
	// 						console.log('站点', item.id, '是部门，跳过获取子站点')
	// 					}
	// 				}
	// 			}

	// 			// 处理顶层站点
	// 			await processChildren(res.data)
	// 			stationTree.value = res.data
	// 			console.log('最终站点树:', stationTree.value)
	// 		}
	// 	} catch (error) {
	// 		console.error('获取站点树失败:', error)
	// 	}
	// }

	// 初始化站点数据

	async function getAllin() {
		const res = await request({
			url: "/station/allIn",
			headers: {
				'Authorization': `Bearer ${user.getToken}`
			},
		})
		leftMenus.value = res.data;
		console.log(res.data);
	}
	const initializeStationData = async () => {
		// 只有在用户已登录的情况下才获取站点数据
		if (!user.getToken || user.getToken === '--') {
			router.push({ name: 'login' })
			return
		}

		try {
			await getAllin()
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
				userInfo.value.name = data.data.name || '';
				userInfo.value.avatar = data.data.avatar || '';
				userInfo.value.username = data.data.username || '';
				if (userInfo.value.username === '') {
					router.push({ name: 'login' })
				}

				// 保存用户信息到store
				user.changeUserInfo(data.data);
			} catch (error) {
				console.error('获取用户信息失败:', error);
				if (userInfo.value.username === '') {
					router.push({ name: 'login' })
					localStorage.clear();
					sessionStorage.clear()
				}
			}
		}
	};

	// 在页面加载前初始化用户状态
	onBeforeMount(async () => {

		await initializeUserState();
		await initializeStationData();
		// await getPermission()
	})

	// 跳转到个人信息页面
	const goToProfile = () => {
		router.push({ name: 'profile' })
	}


	// 跳转到部门详细页
	const goToDepartment = (stationId : number, permitted : boolean) => {
		if (permitted) (
			router.push({ name: 'departmentDetail', params: { stationId: stationId } }))
		else {
			ElMessage.info('您没有对应的权限,无法访问')
		}
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
		z-index: 1000;
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
		z-index: 1000;
		width: 100%;
		border-top-left-radius: 25px;
		border-top-right-radius: 25px;

	}

	.el-aside {
		position: fixed;
		top: 100px;
		left: 0;
		width: 250px;
		display: flex;
		height: calc(100% - 100px)
	}

	.el-row {
		flex: 1;
		overflow-y: auto;
	}

	.el-main {
		margin-left: 200px;
		padding-top: 100px;
		height: calc(100% - 100px);
		padding-top: 40px;
		background: #fff;
		border-right: 2px solid #e6e6e6;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
	}

	.el-main {
		margin-left: 250px;
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

	/* 已移除激活状态样式 */
	/* .el-menu-vertical-demo .el-menu-item.is-active,
.el-menu-vertical-demo .department-node.is-active {
  background-color: #1890ff;
  color: white;
  border-left: 3px solid #0056b3;
  font-weight: bold;
} */
</style>