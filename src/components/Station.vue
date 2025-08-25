<template>
	<el-table :data="userInfo" style="width: 100%" v-if="!show">
		<el-table-column prop="name" label="姓名" width="200" />
		<el-table-column prop="college" label="学院" width="200" />
		<el-table-column prop="username" label="学号" width="200" />
		<el-table-column prop="qq" label="QQ" width="200" />
		<el-table-column prop="email" label="邮箱" width="200" />
		<el-table-column label="操作" min-width="300">
			<template #default="scope">
				<el-button link size="small" @click="handleClick(scope.row)">
					查看
				</el-button>
			</template>
		</el-table-column>
	</el-table>


	<div class="answerInfo" v-if="show">
		<el-button type="danger" @click="show=false">关闭</el-button>
		<div v-for="item in answerInfo" :key="item.content">
			<div class="question">问题:{{item.content}}</div>
			<div class="answer">回答:{{item.answer}}</div>
		</div>
	</div>

	<el-form :model="form" ref="formRef" label-width="100px" class="demo-ruleForm" v-if="show">
		<el-form-item label="姓名" prop="name">
			<div>{{form.name}}</div>
		</el-form-item>
		<el-form-item label="学院" prop="college">
			<div>{{form.college}}</div>
		</el-form-item>
		<el-form-item label="学号" prop="username">
			<div>{{form.username}}</div>
		</el-form-item>
		<el-form-item label="qq" prop="qq">
			<div>{{form.qq}}</div>
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<div>{{form.email}}</div>
		</el-form-item>
		<el-form-item label="个人介绍" prop="profile">
			<div>{{form.profile}}</div>
		</el-form-item>
	</el-form>



</template>

<script lang="ts" setup>
	const show = ref(false)

	const props = defineProps({
		departmentId: {
			type: Number,
			required: true
		},
	})

	import { reactive, ref, watch } from 'vue'
	import { getFinishedQuestionnaire, getQuestionnaireDetailedById, getUserInfoByUsername, getAnswerByFinishedId } from '../services/user';
	import { onMounted } from 'vue';
	let sort = 0;
	interface User {
		username : number,
		college : string,
		name : string,
		finishedId : number,
		qq : string,
		email : string,
		profile : string,
		major : string,
	}

	interface Answer {
		content : string,
		answer : string

	}
	const answerInfo = ref<Answer[]>([])

	const form = reactive({
		username: 0,
		college: '',
		name: '',
		qq: '',
		email: '',
		profile: '',
		major: ''
	})


	const handleClick = async (row : User) => {
		answerInfo.value = []
		form.username = row.username
		form.college = row.college
		form.name = row.name
		form.qq = row.qq
		form.email = row.email
		form.profile = row.profile
		form.major = row.major

		console.log('点击查看:', row.finishedId)
		show.value = true
		const list : Answer[] = []
		const res1 = await getAnswer(row)
		const res2 = await getQuestion()
		for (let i = 0; i < res1.length; i++) {
			list.push({
				content: res2[i].content,
				answer: ''
			})
			if (res1[i].optionId !== null) {
				for (let j = 0; j < res2[i].option.length; j++) {
					if (res1[i].optionId === res2[i].option[j].optionId) {
						list[i].answer = res2[i].option[j].optionContent
					}
				}
			} else {
				list[i].answer = res1[i].answerContent
			}

		}
		answerInfo.value = list
		console.log(answerInfo.value)
	}

	const userInfo = ref<User[]>([])

	// 组件挂载时获取数据
	onMounted(async () => {
		if (props.departmentId) {
			try {
				await getFinish() // 等待获取完成
			} catch (error) {
				console.log(error)
				userInfo.value = []
			}
		}
	})

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
				const tempUsers : User[] = []

				// 循环获取每个用户的详细信息
				for (const item of res.data) {
					try {
						const userDetail = await getUserInfoByUsername(item.username)
						console.log('用户详情:', userDetail)

						if (userDetail.code === 200 && userDetail.data) {
							tempUsers.push({
								username: item.username,
								college: userDetail.data.college || '',
								name: userDetail.data.name || '',
								finishedId: item.id,
								qq: userDetail.data.qq || '',
								email: userDetail.data.email || '',
								profile: userDetail.data.profile || '',
								major: userDetail.data.major || ''
							})
						} else {
							// 如果获取详情失败，至少保留用户名
							tempUsers.push({
								username: item.username,
								college: '无权访问',
								name: '无权访问',
								finishedId: item.id,
								qq: '无权访问',
								email: '无权访问',
								profile: '无权访问',
								major: '无权访问',
							})
						}
					} catch (error) {
						console.log(`获取用户${item.username}信息失败:`, error)
						tempUsers.push({
							username: item.username,
							college: '获取失败',
							name: '获取失败',
							finishedId: item.id,
							qq: '',
							email: '',
							profile: '',
							major: '',
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


	async function getQuestion() {
		try {
			const result = await getQuestionnaireDetailedById(props.departmentId);
			if (result.code === 200) {
				console.log(result.data)
			}
			return result.data.questions

		} catch (error) {
			console.log("发生错误:", error);
		}
	}

	async function getAnswer(row : User) {

		try {
			const result = await getAnswerByFinishedId(row.finishedId);
			if (result.code === 200) {
				console.log(result.data)
			}
			return result.data
		} catch (error) {
			console.log("发生错误:", error);
		}

	}
</script>


<style scoped>
	.answerInfo,
	.demo-ruleForm {
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		padding: 20px;
		margin: 15px 0;
		transition: all 0.3s ease;
		width: 80%;
		margin-left: 7%;
	}

	.answerInfo:hover {
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
	}

	.close-btn {
		margin-bottom: 15px;
		transition: all 0.2s ease;
	}

	.close-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(255, 73, 73, 0.25);
	}

	.answer-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.answer-card {
		border: 1px solid #f0f0f0;
		border-radius: 8px;
		padding: 16px;
		transition: all 0.3s ease;
		background-color: #fafafa;
	}

	.answer-card:hover {
		border-color: #e0e0e0;
		background-color: #fff;
		transform: translateX(4px);
	}

	.question-section,
	.answer-section {
		margin-bottom: 12px;
	}

	.question-section:last-child,
	.answer-section:last-child {
		margin-bottom: 0;
	}

	.section-label {
		font-weight: 600;
		color: #409eff;
		margin-right: 8px;
		font-size: 14px;
	}

	.content {
		display: inline;
		color: #303133;
		line-height: 1.6;
		font-size: 14px;
		word-break: break-word;
	}

	/* 动画效果 */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.answerInfo {
		animation: fadeIn 0.4s ease forwards;
	}

	.answer-card {
		animation: fadeIn 0.4s ease forwards;
		animation-delay: calc(var(--index) * 0.1s);
		opacity: 0;
	}

	.question {
		font-weight: 600;
		color: #409eff;
		margin-right: 8px;
		font-size: 18px;

	}

	.answer {
		font-size: 14px;
		border: 1px solid #070606;
		border-radius: 4px;
		padding: 8px;
		background-color: #fff;
		width: 80%;
		margin-left: 7%;
		margin-top: 10px;
		margin-bottom: 30px;

	}

	.demo-ruleForm {
		width: 80%;
		margin-left: 7%;
	}
</style>