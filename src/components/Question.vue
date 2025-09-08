<template>
<div class="showQuestionnaire" v-if="!showEdit">
  <!-- 题目详情弹窗 -->
  <el-dialog v-model="dialogVisible" title="题目详情" :width="800">
    <el-card v-if="currentQuestion" class="question-card">
      <div slot="header" class="clearfix">
        <h2>{{ currentQuestion.content }}</h2>
      </div>
      <div class="question-info">
        <p><strong>题目类型：</strong>{{ getQuestionTypeName(currentQuestion.type) }}</p>
        <div v-if="currentQuestion.option && currentQuestion.option.length > 0">
          <p><strong>选项：</strong></p>
          <ul class="options-list">
            <li v-for="(option, index) in currentQuestion.option" :key="index">
              {{ String.fromCharCode(65 + index) }}: {{ option.optionContent }}
            </li>
          </ul>
        </div>
        <div v-else-if="currentQuestion.type === 3">
          <p><strong>题型说明：</strong>简答题</p>
        </div>
      </div>
    </el-card>
    <el-empty v-else description="加载中..."></el-empty>
  </el-dialog>

  <div class="questionnaire">
    <h3 v-if="ifCreate" >{{ form.title }}</h3>
    <h4 v-if="ifCreate">开始时间：{{ form.startTime }}</h4>
    <h4 v-if="ifCreate">结束时间：{{ form.endTime }}</h4>
    <h4 v-if="ifCreate">状态：{{ form.status==0?'未发布':'已发布' }}</h4>
    <el-button v-if="!ifCreate" @click="show = true">创建问卷</el-button>
    <el-button v-if="ifCreate&&form.status==0" @click="showEdit=true">添加</el-button>
    <el-button v-if="ifCreate" @click="handleDelete">删除</el-button>
    <el-button v-if="ifCreate"  @click="show = true">编辑</el-button>
  </div>


  <div class="createQuestionnaire" v-if="show">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="demo-ruleForm">
      <el-form-item label="问卷名称" prop="title">
        <el-input v-model="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="问卷描述" prop="description">
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
         <el-date-picker
           v-model="form.startTime"
           type="datetime"
           placeholder="选择日期"
           value-format="YYYY-MM-DD HH:mm:ss">
         </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
         <el-date-picker
           v-model="form.endTime"
           type="datetime"
           placeholder="选择日期"
           value-format="YYYY-MM-DD HH:mm:ss">
         </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="handleCreateQuestionnaire" v-if="!ifCreate">提交</el-button>
        <el-button type="primary" @click="handleUpdateQuestionnaire" v-if="ifCreate">更新</el-button>



        <el-button type="primary" @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>

  </div>


  <div class="questionList">
    <el-table :data="questionList" >
      <el-table-column prop="content" label="题目名称" width="180" />
      <el-table-column label="题目类型" width="200">
      
      
    <!-- 自定义列模板 -->
    <template #default="scope">
      <span v-if="scope.row.type === 1">单选题</span>
      <span v-else-if="scope.row.type === 2">多选题</span>
      <span v-else-if="scope.row.type === 3">简答题</span>
      <span v-else>未知类型</span>
    </template>
  </el-table-column>
  <el-table-column label="操作" min-width="300">
      <template #default="scope">
        <el-button link type="danger" size="small" @click="handleDeleteQuestion(scope.row)" :disabled="form.status==1" v-if="form.status===0">
          删除
        </el-button>
        <el-button link type="primary" size="small" @click="handleViewQuestion(scope.row)">
  查看
</el-button>

     </template>
    </el-table-column>
    </el-table>
    <el-button type="primary" @click="handlePublish" v-if="form.status==0" >发布</el-button>


  </div> 
</div>


<div class="editQuestion" v-if="showEdit">
  <h1>填报表</h1>

  <el-button @click="showEdit=false" style="margin-bottom: 10px;">返回</el-button>
  <div class="dropdown-container">
  <el-dropdown>
  <span class="el-dropdown-link">
<el-icon style="margin-right: 5px;"><Menu /></el-icon>{{ selectedTypeName || '请选择题目类型' }}
<el-icon class="el-icon--right">
  <ArrowDown />
</el-icon>
</span>
  <template #dropdown>
  <el-dropdown-menu>
    <el-dropdown-item @click="typeData = 3;showQuestionEdit=true;initOptions()">简答题</el-dropdown-item>

    <el-dropdown-item @click="typeData = 1;showQuestionEdit=true;initOptions()">单选题</el-dropdown-item>
      <el-dropdown-item @click="typeData = 2;showQuestionEdit=true;initOptions()">多选题</el-dropdown-item>
  </el-dropdown-menu>
  </template>
  </el-dropdown>
  </div>
  <div class="form-container" v-if="showQuestionEdit">
  <el-form :model="formdata" :rules="rules"  label-width="120px">
    <el-form-item label="请输入题目" prop="content">
      <el-input v-model="formdata.content" />

    </el-form-item>
    <el-form-item v-if="typeData!==3" label="请输入选项" prop="options">
      <div v-for="(option, index) in formdata.option" :key="index" class="option-item">
        <el-input v-model="option.optionContent" placeholder="请输入选项内容" />
        <el-button type="danger" size="small" @click="removeOption(index)" v-if="formdata.option.length > 1">
          <el-icon><Delete /></el-icon> 删除
        </el-button>
      </div>
      <el-button type="primary" size="small" @click="addOption">
          <el-icon><Plus /></el-icon> 添加选项
        </el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addQuestions">提交</el-button>
    </el-form-item>

  </el-form>

</div>




</div>
</template>
<script setup>
import { createQuestionnaire,getQuestionnaireDetailedById,getQuestionnaire,publishQuestionnaire,deleteQuestionnaire,deleteQuestion } from '../services/user';
import { ElDialog, ElCard, ElEmpty } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';
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
import { ArrowDown } from '@element-plus/icons-vue'
import {ref,reactive, computed} from 'vue'
import { onMounted } from 'vue'
import { watch } from 'vue';
import {useUserStore} from '../store/user'
import { useRouter } from 'vue-router';



const userStore = useUserStore();
const router = useRouter();

   

const props = defineProps({

   departmentId: {

    type: Number,
    required: true
  },
})

const form=reactive({
  title:'',
  description:'',
  startTime:'',
  endTime:'',
  status:0,
})

const questionnaireId=ref(0);
const sort=ref(0);
const showQuestionEdit=ref(false)
const ifCreate = ref(false);
const show = ref(false);
const showEdit=ref(false);
const editQuestionnaire=ref(false);



// 组件挂载时获取数据
onMounted(async () => {
  if (props.departmentId) {
    try {
      await fetchQuestionnaire(props.departmentId);
      await getQuestion(props.departmentId);
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }
})

// 监听departmentId变化，重新获取数据
watch(()=>props.departmentId,(newId)=>{
  if(newId){
    fetchQuestionnaire(newId);
    getQuestion(newId);
    show.value=false
    showEdit.value=false;
    form.title='';
    form.description='';
    form.startTime='';
    form.endTime='';
    form.status=0;
    showQuestionEdit.value=false;


  }  

})

//获取题目
const questionList = ref([

]);


//编辑题目
const typeData=ref(0)

// 计算属性：获取选中的题目类型名称
const selectedTypeName = computed(() => {
  switch(typeData.value) {
    case 1: return '单选题';
    case 2: return '多选题';
    case 3: return '简答题';
    default: return '';
  }
})
// 弹窗控制
const dialogVisible = ref(false);
const currentQuestion = ref(null);

// 获取题目类型名称
const getQuestionTypeName = (type) => {
  switch(type) {
    case 1: return '单选题';
    case 2: return '多选题';
    case 3: return '简答题';
    default: return '未知类型';
  }
};

// 查看题目详情
const handleViewQuestion = async (row) => {
  try {
    dialogVisible.value = true;
    currentQuestion.value = row;
  } catch (error) {
    console.error('查看题目详情失败:', error);
    ElMessage.error('加载题目失败，请重试');
  }
};

// 初始化选项数组
const initOptions = () => {
  formdata.value.option = [{ optionContent: '', optionSort: 0 }];
};

// 添加选项
const addOption = () => {
  const newIndex = formdata.value.option.length;
  formdata.value.option.push({
    optionContent: '',
    optionSort: newIndex
  });
};

// 删除选项
const removeOption = (index) => {
  formdata.value.option.splice(index, 1);
  // 更新剩余选项的排序
  formdata.value.option.forEach((opt, i) => {
    opt.optionSort = i;
  });
};

const formdata = ref({
    questionnaireId:0,
    type:0,
    content:'',
    sort:0,
    option:[
      {
        optionContent:'',
        optionSort:0
      },
      {
        optionContent:'',
        optionSort:1
      },
      {
        optionContent:'',
        optionSort:2
      },
      {
        optionContent:'',
        optionSort:3

      }

    ]
})



async function addQuestions() {
  const BaseUrl = `https://i.sdu.edu.cn/XSZX/NXXT/api/questionnaire/edit/questions?departmentId=${props.departmentId}`;
  try {
    const data = await getQuestion(props.departmentId);
    
    // 将 Proxy 对象转换为普通对象
    const formDataObj = JSON.parse(JSON.stringify(formdata.value));
    
    formDataObj.type = typeData.value;
    formDataObj.questionnaireId = questionnaireId.value;
    formDataObj.departmentId = props.departmentId;

    // 确保选项格式正确，使用"option"而不是"options"
    if (typeData.value === 3) {
      formDataObj.option = [
      ]; // 改为与示例一致的"option"
    }

    // 确保allQuestions在正确的作用域内
    let allQuestions = [];
    if (data !== null && Array.isArray(data)) {
      formDataObj.sort = data.length + 1;
      allQuestions = [...data, formDataObj];
    } else {
      formDataObj.sort = 1; // 第一个问题排序为1
      allQuestions = [formDataObj];
    }

    // 验证并修正option格式（如果需要）
    allQuestions.forEach(question => {
      // 确保存在option属性且为数组
      if (!question.option) question.option = [];
      // 如果之前用了options，这里可以迁移数据
      if (question.options && !question.option.length) {
        question.option = question.options;
        delete question.options;
      }
    });

    console.log('表格数据', formDataObj);
    console.log('请求数据', allQuestions);
    
    let res = await fetch(BaseUrl, {  // 注意这里添加了await
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.getToken}`
      },
      body: JSON.stringify(allQuestions)
    });
    
    let data2 = await res.json();
    if (data2.code === 200) {
      ElMessage.success('添加成功');
      getQuestion(props.departmentId);
      showEdit.value = false;
      showQuestionEdit.value=false;
      formdata.value={
        questionnaireId:0,
        type:0,
        content:'',
        sort:0,
        option:[
          {
            optionContent:'',
            optionSort:0
          },
          {
            optionContent:'',
            optionSort:1
          },
          {
            optionContent:'',
            optionSort:2
          },
          {
            optionContent:'',
            optionSort:3
          }
        ]
      }

    }else{
      ElMessage.error(data2.msg); 

    }

  } catch (error) {
    ElMessage.error('添加失败');
    console.log(error);
  }
}


//获取问卷列表
async function fetchQuestionnaire() {
  try {
    const result = await getQuestionnaire(props.departmentId);
    if(result.code===200){
        ifCreate.value=true;
        console.log(result.data)
        form.title=result.data.title;
        form.description=result.data.description;
        form.startTime=result.data.startTime;
        form.endTime=result.data.endTime;
        form.status=result.data.status;
        questionnaireId.value=result.data.id;
    }
  } catch (error) {
    console.error("发生错误:", error);
    ifCreate.value=false;
  }
}

async function getQuestion(){
  try {
    const result = await getQuestionnaireDetailedById(props.departmentId);
    if(result.code===200){
      console.log(result.data);
      questionList.value=result.data.questions
      if(result.data.questions===null){
        sort.value=0
      }else{
        sort.value=result.data.questions.length;
        return result.data.questions
      }



    }
  } catch (error) {
    console.log("发生错误:", error);
    questionList.value=[]

  }

}







async function handleCreateQuestionnaire() {
  try {
    const result = await createQuestionnaire(props.departmentId, {
      id:props.departmentId,
      title: form.title,
      description: form.description,
      startTime: form.startTime,
      endTime: form.endTime,
      departmentId:props.departmentId,
      status:0
    });
    if(result.code===200){
      ElMessage.success('创建成功');
      fetchQuestionnaire(props.departmentId)

    }else{
      ElMessage.error('创建失败');
      console.log(result);
    }

  } catch (error) {
    console.error("发生错误:", error);
  }
}

async function handleUpdateQuestionnaire() {
  try {
    const result = await createQuestionnaire(props.departmentId, {
      id:questionnaireId.value,
      title: form.title,
      description: form.description,
      startTime: form.startTime,
      endTime: form.endTime,
      departmentId:props.departmentId,
      status:0
    });
    if(result.code===200){
      ElMessage.success('更新成功');
      fetchQuestionnaire(props.departmentId)
    }else{
      ElMessage.error('更新失败');
      console.log(result);
    }
  } catch (error) {
    console.error("发生错误:", error);
  }
}




async function handlePublish() {
  console.log(questionnaireId.value);
  try {
    const result = await publishQuestionnaire(questionnaireId.value);
    if(result.code===200){
      ElMessage.success('发布成功');
	  form.status=1;
    }else{
      ElMessage.error('发布失败');
    }
  } catch (error) {
    console.error("发生错误:", error.response.data.msg);
    ElMessage.error(error.response.data.msg);
  }
}

async function handleDelete(){
 try {
    // 显示确认弹窗
    await ElMessageBox.confirm(
      '确定要删除这个问卷吗？',
      '删除确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 用户确认后执行删除操作
    const result = await deleteQuestionnaire(props.departmentId);
    if(result.code===200){
      ElMessage.success('删除成功');
      fetchQuestionnaire(props.departmentId)
      getQuestion(props.departmentId)
      form.title='';
      form.description='';
      form.startTime='';
      form.endTime='';
      form.status=0;
    } else {
      ElMessage.error('删除失败');
      console.log(result);
    }
  } catch (error) {
    // 如果是用户取消，不显示错误信息
    if (error.name !== 'CanceledError') {
      console.error("发生错误:", error);
      ElMessage.error('操作失败');
    }
  }

}

async function handleDeleteQuestion(row){
try {
    // 显示确认弹窗
    await ElMessageBox.confirm(
      '确定要删除这个题目吗？',
      '删除确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 用户确认后执行删除操作
    const result = await deleteQuestion(row.id, props.departmentId);
    if(result.code===200){
      ElMessage.success('删除成功');
      getQuestion(props.departmentId)
    } else {
      ElMessage.error('删除失败');
      console.log(result);
    }
  } catch (error) {
    // 如果是用户取消，不显示错误信息
    if (error.name !== 'CanceledError') {
      console.error("发生错误:", error);
      ElMessage.error('操作失败');
    }
  }

}

</script>

<style scoped>
.question-card {
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.options-list {
  list-style: none;
  padding: 0;
}

.options-list li {
  margin: 8px 0;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: #f5f5f5;
  transition: background-color 0.2s;
}

.options-list li:hover {
  background-color: #e9e9e9;
}

.question-info {
  line-height: 1.8;
}

.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 10px 15px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.option-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.option-item .el-input {
  flex: 1;
}

/* 美化按钮样式 */
.form-actions .el-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
}

/* 优化下拉菜单样式 */
.dropdown-container .el-dropdown-link {
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  transition: all 0.2s;
}

.dropdown-container .el-dropdown-link:hover {
  border-color: #409eff;
  color: #409eff;
}

</style>