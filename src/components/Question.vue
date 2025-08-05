<template>
    <header>
       <h1>题库管理</h1>
       <button>添加</button>
       <el-table :data="tableData">
            <el-column prop="title"  label="题目" width=""/>
            <el-column prop="type"   label="类型" width=""/>
            <el-column fixed="right" label="操作" width="">
               
                <template #default>
                        <el-button  size="small"  type="danger" @click="handleDelete" >
                            删除
                        </el-button>
                        <el-button  size="small" @click="handleEdit">
                            编辑
                        </el-button>
                </template>
                
            </el-column>
            
       </el-table>
    </header>
</template>
<script lang="ts" setup>
import {ref,reactive,onBeforeMount} from 'vue'
const tableData = [
  {
    title: '1+1=2',
    type: '单选题',
  },
 
]
const handleDelete = (row: any) => {
    console.log(row);
}
const handleEdit = (row: any) => {
    console.log(row);
}
onBeforeMount(()=>{
    //请求
})
</script>