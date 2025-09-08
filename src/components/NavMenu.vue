<template>
	<div>
		<template v-for="(navMenu, index) in navMenus" :key="navMenu.id">
			<el-menu-item v-if="navMenu.isDepartment === 1" :index="String(navMenu.id)"
				@click="goToDepartment(navMenu.id, navMenu.permitted)">
				<span>{{ navMenu.name }}</span>
			</el-menu-item>

			<el-sub-menu v-else-if="navMenu.isDepartment === 0" :index="String(navMenu.id)">
				<template #title>
					<span>{{ navMenu.name }}</span>
				</template>
				<NavMenu :navMenus="navMenu.children" />
			</el-sub-menu>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { ElMessage } from 'element-plus'
	import { useRouter } from 'vue-router'

	interface navMenu {
		id : number
		name : string
		isDepartment : 0 | 1
		permitted : boolean
		children ?: navMenu[]   // 可选，递归子菜单
	}
	defineProps<{
		navMenus : navMenu[]
	}>()

	const router = useRouter()

	const goToDepartment = (stationId : number, permitted : boolean) => {
		if (permitted) {
			router.push({ name: 'departmentDetail', params: { stationId } })
		} else {
			ElMessage.info('您没有对应的权限，无法访问')
		}
	}
</script>
<style scoped>
</style>