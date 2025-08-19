<template>
<h1>填报表</h1>
<el-dropdown>
  <template #reference>
    <el-button >
      选择题目类型
      <el-icon class="el-icon--right">
        <el-icon-arrow-down />
      </el-icon>
    </el-button>
  </template>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item @click="type = 3">简答题</el-dropdown-item>
    <el-dropdown-item @click="type = 1">单选题</el-dropdown-item>
    <el-dropdown-item @click="type = 2">多选题</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
<div class="form-container">
  <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
    <el-form-item label="请输入题目" prop="content">
      <el-input v-model="form.content" />
    </el-form-item>
    <el-form-item v-if="type!==3" label="请输入选项" prop="options">
      <el-input v-model="form.options[0].optionContent" />
      <el-input v-model="form.options[1].optionContent" />
      <el-input v-model="form.options[2].optionContent" />
      <el-input v-model="form.options[3].optionContent" />
    </el-form-item>
    <el-form-item>
      <el-button @click="addQuestion">提交</el-button>
    </el-form-item>

  </el-form>

</div>

</template>

<script setup>
import { ref ,reactive} from 'vue'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElButton, ElIcon } from 'element-plus'
import { ElIconArrowDown } from '@element-plus/icons-vue'
import { addQuestion } from '@/services/question'
import { addAbortListener } from 'events'


defineProps({
    questionnaireId:Number,
    departmentId:Number,
    required: true,
    default: 0
})
const type=ref(0)

const form = reactive({
    questionnaireId:props.questionnaireId,
    departmentId:props.departmentId,
    type:type.value,
    content:'',
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

async function addQuestion() {
  try {
    if(type.value===3){
      form.options=[]
    }
    await addQuestion(form);
    ElMessage.success('添加成功');
  } catch (error) {
    ElMessage.error('添加失败');
  }
}



</script>
