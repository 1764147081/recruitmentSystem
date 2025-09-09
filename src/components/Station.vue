<template>
	<div v-loading="loading" element-loading-text="加载中..." element-loading-background="rgba(255, 255, 255, 0.8)"
		class="loading-container">
		<el-input v-model="searchUsername" placeholder="请输入学号或姓名进行搜索" clearable style="width: 300px;" />
		<el-button type="primary" @click="getFinishByUsername" style="margin-left: 10px;">搜索</el-button>
		<el-button type="warning" @click="getCurrentAnswers" style="margin-left: 10px;">取消</el-button>
		<el-table :data="userInfo" style="width: 100%" v-if="!show">
			<el-table-column prop="name" label="姓名" width="200" />
			<el-table-column prop="college" label="学院" width="200" />
			<el-table-column prop="username" label="学号" width="200" />
			<el-table-column prop="qq" label="QQ" width="200" />
			<el-table-column prop="email" label="邮箱" width="200" />
			<el-table-column label="操作" min-width="300">
				<template #default="scope">
					<el-button link size="small" @click="handleClick(scope.row)">查看问卷</el-button>
					<el-button link size="small" @click="viewUserInfo(scope.row)">查看个人信息</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination-container" v-if="!show && AnswerItems.length > 0">
			<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
				:total="AnswerItems.length" layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange" @current-change="handleCurrentChange" />
		</div>


		<div class="answerInfo" v-if="show">
			<el-button type="danger" @click="show = false">关闭</el-button>
			<div class="SignUpsName">{{ form.name }}</div>
			<div class="SignUpsUsername">学号：{{ form.username }}</div>
			<div class="showScore" >当前评分：{{ score }}</div>
			<el-card v-for="item in answerInfo" :key="item.content" class="question-card" shadow="hover">
				<div class="question-header">
					<span class="question-icon"><el-icon>
							<Document />
						</el-icon></span>
					<div class="question-content">{{ item.content }}</div>
				</div>
				<el-divider></el-divider>
				<div class="answer-list">
					<div class="answer-item" v-for="(a, index) in item.answer" :key="index">
						<span class="answer-text">{{ a }}</span>
					</div>
				</div>
			</el-card>
			<el-input v-model="setScore" placeholder="请输入评分"  style="width: 300px;" />
			<el-button type="primary" @click="submitScores" style="margin-left: 10px;">提交评分</el-button>
		</div>

		<el-dialog title="个人信息" v-model="showUserInfo" width="50%">
			<el-form :model="currentUserInfo" label-width="120px">
				<div style="text-align: center; margin-bottom: 20px;">
					<el-avatar :src="currentUserInfo.avatar" size="large">
						<span v-if="!currentUserInfo.avatar">{{ currentUserInfo.name?.charAt(0) || 'U' }}</span>
					</el-avatar>
				</div>
				<el-form-item label="姓名">
					<span>{{ currentUserInfo.name }}</span>
				</el-form-item>
				<el-form-item label="学院">
					<span>{{ currentUserInfo.college }}</span>
				</el-form-item>
				<el-form-item label="学号">
					<span>{{ currentUserInfo.username }}</span>
				</el-form-item>
				<el-form-item label="QQ">
					<span>{{ currentUserInfo.qq }}</span>
				</el-form-item>
				<el-form-item label="邮箱">
					<span>{{ currentUserInfo.email }}</span>
				</el-form-item>
				<el-form-item label="专业">
					<span>{{ currentUserInfo.major }}</span>
				</el-form-item>
				<el-form-item label="个人介绍">
					<span>{{ currentUserInfo.profile }}</span>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

// 分页相关变量
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const AnswerItems = ref<any[]>([])
const UserInfoCache = ref<{ [key: string]: any[] }>({})

// 计算当前页数据
const currentPageData = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value
	const end = start + pageSize.value
	return AnswerItems.value.slice(start, end)
})

// 处理每页显示数量变化
const handleSizeChange = async (newSize: number) => {
	pageSize.value = newSize
	currentPage.value = 1 // 重置到第一页
	await getCurrentAnswers() // 获取当前页数据
}

// 处理页码变化
const handleCurrentChange = async (newPage: number) => {
	currentPage.value = newPage
	await getCurrentAnswers() // 获取当前页数据
}
const show = ref(false)
const showUserInfo = ref(false)

interface UserInfo {
	username: number,
	college: string,
	name: string,
	finishedId: number,
	qq: string,
	email: string,
	profile: string,
	major: string,
	avatar: string,
}
const currentUserInfo = ref<UserInfo>({
	username: 0,
	college: '',
	name: '',
	finishedId: 0,
	qq: '',
	email: '',
	profile: '',
	major: '',
	avatar: '',
})

const props = defineProps({
	departmentId: {
		type: Number,
		required: true
	},
})

const getCurrentAnswers = async () => {
	loading.value = true
	const tempUsers: User[] = []
	const key = `${currentPage.value}-${pageSize.value}+${props.departmentId}`
	try{
	if (UserInfoCache.value[key]) {
		userInfo.value = UserInfoCache.value[key]
		loading.value = false
		return
	}
	for (let i = 0; i < currentPageData.value.length; i++) {
		let item = currentPageData.value[i];
		try {
			const userDetail = await getUserInfoByUsername(item.username)

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
}
finally{
		loading.value = false
	}
	UserInfoCache.value[key] = tempUsers
	userInfo.value = tempUsers
}

import { reactive } from 'vue'
import { getFinishedQuestionnaire, getQuestionnaireDetailedById, getUserInfoByUsername, getAnswerByFinishedId, getQuestionnaire,getFinishedByUsername ,getFinishedByName,submitScore,getScore} from '../services/user';
import { onMounted } from 'vue';
import { te } from 'element-plus/es/locales.mjs'
import { ElMessage } from 'element-plus'
let sort = 0;
interface User {
	username: number,
	college: string,
	name: string,
	finishedId: number,
	qq: string,
	email: string,
	profile: string,
	major: string,
}

interface Answer {
	content: string,
	answer: string[]

}
const answerInfo = ref<Answer[]>([])

const viewUserInfo = async (row: { username: any; }) => {
	try {
		const res = await getUserInfoByUsername(row.username);
		if (res.code === 200) {
			currentUserInfo.value = res.data;
			showUserInfo.value = true;
		}
	} catch (error) {
		console.error('获取用户信息失败:', error);
	}
}

const form = reactive({
	username: 0,
	college: '',
	name: '',
	qq: '',
	email: '',
	profile: '',
	major: ''
})


const handleClick = async (row: User) => {
	answerInfo.value = []
	form.username = row.username
	form.college = row.college
	form.name = row.name
	form.qq = row.qq
	form.email = row.email
	form.profile = row.profile
	form.major = row.major
	show.value = true
	const list: Answer[] = []
	const res1 = await getAnswer(row)
	const res2 = await getQuestion()
	console.log(res1, res2);
	for (let i = 0; i < res2.length; i++) {
		list.push({
			content: res2[i].content,
			answer: []
		})
		if (res2[i].type === 1 || res2[i].type === 2)
			for (let j = 0; j < res1.length; j++) {
				for (let k = 0; k < res2[i].option.length; k++) {
					if (res2[i].option[k].optionId === res1[j].optionId) {
						list[i].answer.push(res2[i].option[k].optionContent)
					}
				}
			}
		else {
			for (let j = 0; j < res1.length; j++) {
				if (res2[i].id === res1[j].questionId) {
					list[i].answer.push(res1[j].answerContent)
				}
			}
		}
	}
	answerInfo.value = list
	console.log(list);
	console.log('111111', answerInfo.value)
}

const userInfo = ref<User[]>([])

// 组件挂载时获取数据
onMounted(async () => {
	if (props.departmentId) {
		try {
			await getFinish() // 等待获取完成
			await fetchQuestionnaire()
			await getCurrentAnswers()

		} catch (error) {
			console.log(error)
			userInfo.value = []
		}
	}
	await getCurrentAnswers()
})

// 监听departmentId变化，重新获取数据
watch(() => props.departmentId, async (newVal) => {
	if (newVal) {
		try {
			await getFinish() // 等待获取完成
			await fetchQuestionnaire()
			await getCurrentAnswers()
			show.value = false
		} catch (error) {
			console.log(error)
			userInfo.value = []
		}
	}
})

    const searchUsername = ref<number|string>()
	const questionnaireId = ref(0)
	
async function fetchQuestionnaire() {
  try {
    const result = await getQuestionnaire(props.departmentId);
    if (result.code === 200) {
      questionnaireId.value = result.data.id;
    }
  } catch (error) {
    console.error("发生错误:", error);
  }
}

async function getFinishByUsername() {
  // 调整条件：判断是否为有效数字（包括number类型或纯数字字符串）
  const value = searchUsername.value;
  const isNumber = typeof value === 'number' || 
                  (typeof value === 'string' && /^\d+$/.test(value.trim()));

  if (isNumber) {
    try {
      userInfo.value = [];
      // 若为字符串类型的数字，转换为number（根据接口需求决定是否需要）
      const username = typeof value === 'string' ? Number(value) : value;
      const result = await getFinishedByUsername(username, questionnaireId.value);
      
      if (result.code === 200) {
        console.log("获取到的个人问卷数据:", result.data);
        const tempUsers: User[] = [];

        try {
          const userDetail = await getUserInfoByUsername(username);
          console.log('用户详情:', userDetail);

          if (userDetail.code === 200 && userDetail.data) {
            tempUsers.push({
              username: username,
              college: userDetail.data.college || '',
              name: userDetail.data.name || '',
              finishedId: result.data.id,
              qq: userDetail.data.qq || '',
              email: userDetail.data.email || '',
              profile: userDetail.data.profile || '',
              major: userDetail.data.major || ''
            });
          } else {
            tempUsers.push({
              username: username,
              college: '无权访问',
              name: '无权访问',
              finishedId: result.data.id,
              qq: '无权访问',
              email: '无权访问',
              profile: '无权访问',
              major: '无权访问',
            });
          }
        } catch (error) {
          console.log(`获取用户${username}信息失败:`, error);
          tempUsers.push({
            username: username,
            college: '获取失败',
            name: '获取失败',
            finishedId: result.data.id,
            qq: '',
            email: '',
            profile: '',
            major: '',
          });
        }

        userInfo.value = tempUsers;
      }
    } catch (error) {
      console.error("发生错误:", error);
      userInfo.value = [];
    }
  }else{
    try {
      userInfo.value = [];
      const username = typeof value === 'string' ? value :  String(value);  
      const result = await getFinishedByName(searchUsername.value, props.departmentId);
	  const tempUsers: User[] = [];
      if (result.code === 200) {
		 console.log("获取到的个人问卷数据:", result.data);
		tempUsers.push({
			username:result.data[0].username||'',
			college:result.data[0].college||'',
			name:username,
			finishedId:result.data[0].id||'',
			qq:'',
			email:'',
			profile:'',
			major:'',
		})
      userInfo.value = tempUsers;
      }else{
       tempUsers.push({
			username:0,
			college:'无权访问',
			name:username,
			finishedId:0,
			qq:'',
			email:'',
			profile:'',
			major:'',
		})
      }
    } catch (error) {
      console.error("发生错误:", error);
      userInfo.value = [];
    }
  }

}


async function getFinish() {
	try {
		// 先清空现有数据
		userInfo.value = []

		const res = await getFinishedQuestionnaire(props.departmentId)
		if (res.code === 200 && res.data && res.data.length) {
			console.log('问卷数据:', res.data)
			AnswerItems.value = res.data
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

const finishId = ref(0)
async function getAnswer(row: User) {

	try {
		const result = await getAnswerByFinishedId(row.finishedId);
		finishId.value = row.finishedId
		if (result.code === 200) {
			console.log(result.data)
			getCurrentScore()
		}
		return result.data
	} catch (error) {
		console.log("发生错误:", error);
	}

}


const score = ref(0)
const setScore = ref(0||null)
async function submitScores() {
	if(setScore.value !== null){
		try {
		const result = await submitScore(finishId.value,setScore.value);
		if (result.code === 200) {
			console.log(result.data)
			ElMessage.success('评分成功')
			setScore.value = null
			await getCurrentScore()
		}
	} catch (error) {
		console.log("发生错误:", error);
	}
	}
	
}


async function getCurrentScore(){
	if(finishId.value !== 0){
		try {
			const result = await getScore(finishId.value);
			if (result.code === 200) {
				console.log(result.data)
				score.value = result.data
			}
		} catch (error) {
			console.log("发生错误:", error);
		}
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

.question-card {
	margin-bottom: 20px;
	border-radius: 8px;
	overflow: hidden;
}

.question-header {
	display: flex;
	align-items: center;
	padding: 10px 0;
}

.question-icon {
	margin-right: 10px;
	color: #409EFF;
}

.question-content {
	font-size: 16px;
	font-weight: 500;
	flex: 1;
}

.answer-list {
	padding: 10px 0;
}

.answer-item {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
	padding: 8px 12px;
	background-color: #f5f7fa;
	border-radius: 4px;
	transition: all 0.3s ease;
}

.answer-item:hover {
	background-color: #eef1f5;
	transform: translateX(5px);
}

.answer-tag {
	margin-right: 10px;
}

.answer-text {
	line-height: 1.6;
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

.SignUpsName {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  margin: 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.SignUpsUsername {
  font-size: 14px;
  color: #606266;
  margin-bottom: 20px;
  padding-left: 5px;
}
.showScore{
	font-size: 14px;
	color: #606266;
	margin-bottom: 20px;
	padding-left: 5px;
}
</style>