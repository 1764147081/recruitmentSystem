<template>
  <div>
    <h1>编辑组织目录</h1>


 
              <h3 class="edit" @click="">组织目录</h3>

              <el-button type="warning" @click="show = true">添加部门</el-button>
              <div v-if="show">

                <el-form :model="formData"  label-width="120px" class="demo-ruleForm">
                  <el-form-item label="设置部门名称" prop="name">
                    <el-input v-model="formData.name" autocomplete="off" />
                  </el-form-item>
                  <el-form-item prop="description">
                    <el-input type="textarea" v-model="formData.description" autocomplete="off" />
                    <div>输入部门描述</div>
                  </el-form-item>
                    <el-form-item label="上传部门海报">
                     <el-upload
                     action="/api/upload"
                      :on-success="handleUploadSuccess"
                      :on-error="handleUploadError"
                      :before-upload="beforeUpload"
                      :show-file-list="false"
                      accept="image/*"
                      >
                      <el-button type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过2MB</div>
                      <div v-if="formData.poster">
                      <img :src="formData.poster.url" v-if="formData.poster.url" style="max-width: 200px; max-height: 200px; margin-top: 10px;">
                        <div v-else>已上传文件</div>
                      </div>
                      </el-upload>
                    </el-form-item>
                  <el-form-item label="设置部门负责人" prop="manager">
                    <el-input v-model="formData.manager"  placeholder="请输入姓名" autocomplete="off" />
                    <el-button type="primary" @click="search">搜索</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="">确定</el-button>
                    <el-button @click="show=false">取消</el-button>

                  </el-form-item>
                </el-form>

              </div>

              <el-button type="warning" @click="setStation = true">设置模块</el-button>

              <div v-if="setStation">
                <el-form :model="stationList"   label-width="120px" class="demo-ruleForm">
                  <el-form-item label="设置模块名称" prop="name">
                    <el-input v-model="stationList.name" autocomplete="off" />
                  </el-form-item>
                  <el-form-item label="输入模块描述"prop="description">
                    <el-input type="textarea" v-model="stationList.description" autocomplete="off" />
                    
                  </el-form-item>
                  <el-form-item label="设置模块负责人" prop="manager">
                    <el-input v-model="stationList.manager"  placeholder="请输入姓名" autocomplete="off" />
                    <el-button type="primary" @click="search">搜索</el-button>
                  </el-form-item>

                  <el-form-item>
                    <el-button  @click="addStation">确定</el-button>
                    <el-button @click="setStation=false">取消</el-button>
                  </el-form-item>
                </el-form>
              </div>
            
              
   
  </div>
  <recursive-menu :menu-data="menuData" />
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { onBeforeMount } from 'vue'
import { useUserStore } from '../store/user'
import { useStationStore } from '../store/station'
import { Station } from '../store/station'
import { ElMessageBox, ElMessage, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import RecursiveMenu from '../components/RecursiveMenu.vue'
import { getStationView } from '../store/stationTree'
import { onMounted } from 'vue'

const BaseUrl='https://www.isdu-remote-connect.asia/XSZX/NXXT/api'
const user = useUserStore()
const station = useStationStore()
const menuData = ref<Station[]>([]); 



onMounted(async () => {
  const station = await getStationView(1); 
  menuData.value = [station]; 
});

console.log(menuData.value)


const topId=1001


const show=ref(false)
const setStation=ref(false)

const formData = reactive({
  name: '',
  parentId: 0,
  stationId: 0,
  description: '',
  manager: '',
  poster: {
    url: ''
  }
});

const stationList = reactive({
  name: '',
  parentId: 0,
  description: '',
  manager: '',
})

const stationStore:Station[] = []
const stationMap = ref(stationStore)



const handleUploadSuccess = (response, file, fileList) => {
  formData.poster = {
    url: response.url
  };
};

const handleUploadError = (err, file, fileList) => {
  console.error('上传失败:', err);
  ElMessage.error('上传失败，请重试');
};

const beforeUpload = (file) => {
  const isImage = file.type.includes('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB!');
    return false;
  }
  
  return true;
};

const submitForm = () => {
  console.log('提交数据:', formData);
  
};

const resetForm = () => {
  formData.name = '';
  formData.description = '';
  formData.manager = '';
  formData.poster = {
    url: ''
  };
}



//提交表单

async function search() {
  console.log(user.getToken)
  console.log(stationList.manager)
  let url = `${BaseUrl}/user/info?username=${stationList.manager}`
  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': user.getToken
      }
    })
    let data = await response.json()
    if(data.code == 200) {
      stationList.manager = data.data.username
      console.log(data.data.username)
    }
  } catch (error) {
    console.log(error)
  }
  



}

async function addStation() {

  station.changeName(stationList.name);
  station.changeDescription(stationList.description);
  station.changeId(topId)

  console.log(station.getName)
  console.log(station.getDescription)
  console.log(user.getToken) 





  let url = `${BaseUrl}/station/create`;
  let url2 = "https://m1.apifoxmock.com/m1/6884356-6599915-default/station/edit"
  
try {
  const response = await fetch(url2, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.getToken}`
    },
    body: JSON.stringify({
      name: station.getName,
      description: station.getDescription,
      isDepartment:0
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server responded with ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Success:', data);
  return data;
} catch (error) {
  console.error('Request failed:', error);
  throw error;
}
}


async function addDepartment(){


}




</script>

<style scoped>
  h3{
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
  }
</style>
