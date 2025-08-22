<template>
<div class="showQuestionnaire" v-if="!showEdit">

  <div class="questionnaire">
    <h3 v-if="ifCreate" >{{ form.title }}</h3>
    <h4 v-if="ifCreate">开始时间：{{ form.startTime }}</h4>
    <h4 v-if="ifCreate">结束时间：{{ form.endTime }}</h4>
    <el-button v-if="!ifCreate" @click="show = true">创建问卷</el-button>
    <el-button v-if="ifCreate" @click="showEdit=true">添加</el-button>
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
           type="date"
           placeholder="选择日期">
         </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
         <el-date-picker
           v-model="form.endTime"
           type="date"
           placeholder="选择日期">
         </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCreateQuestionnaire">创建问卷</el-button>
        <el-button type="primary" @click="show = false">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
  <div class="questionnaire">
    <h3></h3>
  </div>

  <div class="questionList">
    <el-table :data="questionList" >
      <el-table-column prop="content" label="题目名称" width="180" />
      <el-table-column prop="type" label="题目类型" width="200" />
    </el-table>
    <el-button type="primary" @click="handlePublish">发布</el-button>

  </div> 
</div>


<div class="editQuestion" v-if="showEdit">
  <h1>填报表</h1>

  <el-button @click="showEdit=false" style="margin-bottom: 10px;">返回</el-button>
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
    <el-dropdown-item @click="type = 3">简答题</el-dropdown-item>
    <el-dropdown-item @click="type = 1">单选题</el-dropdown-item>
    <el-dropdown-item @click="type = 2">多选题</el-dropdown-item>
  </el-dropdown-menu>
  </template>
  </el-dropdown>
  </div>
  <div class="form-container">
  <el-form :model="formdata" :rules="rules" ref="formRef" label-width="120px">
    <el-form-item label="请输入题目" prop="content">
      <el-input v-model="formdata.content" />

    </el-form-item>
    <el-form-item v-if="type!==3" label="请输入选项" prop="options">
      <el-input v-model="formdata.options[0].optionContent" />
      <el-input v-model="formdata.options[1].optionContent" />
      <el-input v-model="formdata.options[2].optionContent" />
      <el-input v-model="formdata.options[3].optionContent" />
    </el-form-item>
    <el-form-item>
      <el-button @click="addQuestions">提交</el-button>
    </el-form-item>

  </el-form>

</div>




</div>
</template>
<script setup>
import { createQuestionnaire,getQuestionnaireDetailedById,getQuestionnaire,addQuestion,publishQuestionnaire,deleteQuestionnaire } from '../services/user';
import { 
  ElMessage, 
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
  status:0

})

const questionnaireId=ref(0);
const sort=ref(0);



watch(()=>props.departmentId,(newId)=>{
  if(newId){
    fetchQuestionnaire(newId);
    getQuestion(newId);
  }  

})


const ifCreate = ref(false);
const show = ref(false);
const showEdit=ref(false);

//获取题目
const questionList = ref([

]);


//编辑题目
const type=ref(0)
const formdata = reactive({
    departmentId:props.departmentId,
    questionnaireId:questionnaireId.value,
    type:type.value,
    content:'',
    sort:sort.value+1,
    options:[
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
  try {
    if(type.value===3){
      formdata.options=[]
    }
    await addQuestion([formdata]);
    ElMessage.success('添加成功');
    getQuestion(props.departmentId);
  } catch (error) {
    ElMessage.error('添加失败');
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



async function handlePublish() {
  try {
    const result = await publishQuestionnaire(questionnaireId.value);
    if(result.code===200){
      ElMessage.success('发布成功');
    }else{
      ElMessage.error('发布失败');
      console.log(result);
    }
  } catch (error) {
    console.error("发生错误:", error);
  }
}

async function handleDelete(){
  try {
    const result = await deleteQuestionnaire(props.departmentId);
    if(result.code===200){
      ElMessage.success('删除成功');
    }else{
      ElMessage.error('删除失败');
      console.log(result);
    }
  } catch (error) {
    console.error("发生错误:", error);
  }

}

</script>