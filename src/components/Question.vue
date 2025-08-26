<template>
<div class="showQuestionnaire" v-if="!showEdit&&!showCheck">


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


  <div class="questionList" >

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
        <el-button link type="danger" size="small" @click="handleDeleteQuestion(scope.row)" :disabled="form.status==1">

          删除
        </el-button>
        <el-button link type="primary" size="small" @click="handleCheckQuestion(scope.row);showCheck=true">


          查看
        </el-button>

     </template>
    </el-table-column>
    </el-table>
    <el-button type="primary" @click="handlePublish" :disabled="form.status==1">发布</el-button>


  </div> 
</div>


<div class="editQuestion" v-if="showEdit">
  <h1>填报表</h1>

  <el-button @click="showEdit=false;formdata={}" style="margin-bottom: 10px;">返回</el-button>
  <div class="dropdown-container">
  <el-dropdown>
  <span class="el-dropdown-link">
    请选择题目类型
    <el-icon class="el-icon--right">
      <ArrowDown />
    </el-icon>
  </span>
  <template #dropdown>
  <el-dropdown-menu>
    <el-dropdown-item @click="typeData = 3;showQuestionEdit=true">简答题</el-dropdown-item>
    <el-dropdown-item @click="typeData = 1;showQuestionEdit=true">单选题</el-dropdown-item>
    <el-dropdown-item @click="typeData = 2;showQuestionEdit=true">多选题</el-dropdown-item>
  </el-dropdown-menu>
  </template>
  </el-dropdown>
  </div>
  <div class="form-container" v-if="showQuestionEdit">
  <el-form :model="formdata" :rules="rules"  label-width="120px">
    <el-form-item label="请输入题目" prop="content">
      <el-input v-model="formdata.content" />

    </el-form-item>
   <el-form-item 
  v-if="typeData!==3" 
  label="请输入选项" 
  v-for="(item, index) in formdata.option"
  :key="item.optionSort"  
  :prop="`option[${index}].optionContent`"  
>
  <el-input v-model="item.optionContent" />  
  <el-button @click="removeOption(item)"> 删除选项 </el-button>  
</el-form-item>
    <el-form-item>
      <el-button @click="addQuestions">提交</el-button>
      <el-button @click="addOption">添加选项</el-button>

    </el-form-item>

  </el-form>

</div>
</div>

<div v-if="showCheck" class="checkQuestion">
  <h1>查看题目</h1>
  <el-button @click="showCheck=false" style="margin-bottom: 10px;">返回</el-button>
  <el-form :model="checkQuestion"label-width="120px" class="checkQuestionForm">

    <el-form-item label="题目" prop="content">
      <div >
        {{checkQuestion.content}}
      </div>
    </el-form-item>
   <el-form-item 
  v-if="checkQuestion.type!==3" 
  :label="`选项${index + 1}:`"
  v-for="(item, index) in checkQuestion.option"
  :key="item.optionSort"  
  :prop="`option[${index}].optionContent`"  
>
  <div >
    {{item.optionContent}}
  </div>  
</el-form-item>
  </el-form>


</div>







</template>
<script setup>
import { createQuestionnaire,getQuestionnaireDetailedById,getQuestionnaire,publishQuestionnaire,deleteQuestionnaire,deleteQuestion } from '../services/user';
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
import {ref,reactive} from 'vue'
import { onMounted } from 'vue'
import { watch } from 'vue';
import {useUserStore} from '../store/user'




const userStore = useUserStore();

   

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
const showCheck=ref(false);




watch(()=>props.departmentId,(newId)=>{
  if(newId){
    fetchQuestionnaire(newId);
    getQuestion(newId);
    show.value=false
    showEdit.value=false;
    showCheck.value=false;
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
const formdata = ref({
    questionnaireId:0,
    type:0,
    content:'',
    sort:0,
    option:[
      {
        optionContent:'',
        optionSort:0
      }

    ]
})

const checkQuestion=ref({
  content:'',
  type:0,
  option:[]
})


function removeOption(option) {
  // 找到要删除的选项索引
  const index = formdata.value.option.findIndex(item => item.optionSort === option.optionSort)
  // 如果找到则删除
  if (index !== -1) {
    formdata.value.option.splice(index, 1)
  }
}

function addOption() {
  formdata.value.option.push({
    optionContent: '',
    optionSort: formdata.value.option.length
  })
}


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
        option:[]
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
async function  fetchQuestionnaire() {
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
        console.log(questionnaireId.value)
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
        console.log(result.data.questions.length)
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
      collected:200,
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
      collected:200,
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
      fetchQuestionnaire(props.departmentId)
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


function handleCheckQuestion(row){
  console.log(row)
  checkQuestion.value=row;


}

</script>

