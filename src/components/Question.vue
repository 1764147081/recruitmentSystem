<template>
  <div class="questionnaire">
    <h3 v-if="ifCreate" >{{ form.title }}</h3>
    <h4 v-if="ifCreate">开始时间：{{ form.startTime }}</h4>
    <h4 v-if="ifCreate">结束时间：{{ form.endTime }}</h4>
    <el-button v-if="!ifCreate" @click="show = true">创建问卷</el-button>
  <el-button v-if="ifCreate">添加</el-button>
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
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button  size="small" @click="">删除</el-button>
          <el-button  size="small" @click="">编辑</el-button>

        </template>
    </el-table-column>
    </el-table>
    <el-button type="primary" @click="">发布</el-button>



  </div>
  

  
 
</template>
<script setup>
import { de } from 'element-plus/es/locales.mjs';
import { createQuestionnaire,getQuestionnaireDetailedById,getQuestionnaire } from '../services/user.js';
import {ElMessage,ElTableColumn,ElButton} from 'element-plus'



import {ref,reactive} from 'vue'
import { onMounted } from 'vue'
import { watch } from 'vue';
const props = defineProps({
   departmentId: {

    type: Number,
    required: true
  }
})

const form=reactive({
  title:'',
  description:'',
  startTime:'',
  endTime:'',
  status:0

})




watch(()=>props.departmentId,(newId)=>{
  if(newId){
    fetchQuestionnaire(newId);
    getQuestion(newId);
  }  

})



const ifCreate = ref(false);
const show = ref(false);

const questionList = ref([

]);

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
      questionList.value=result.data.questions;

    }
  } catch (error) {
    console.error("发生错误:", error);
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
    }else{
      ElMessage.error('创建失败');
      console.log(result);
    }

  } catch (error) {
    console.error("发生错误:", error);
  }
}


</script>