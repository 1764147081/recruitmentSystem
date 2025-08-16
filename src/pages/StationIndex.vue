<template>
  <div>
    <h1>编辑组织目录</h1>
      <h3 class="edit" @click="">组织目录</h3>
      <el-button type="warning" @click="setDepartment = true;setStation=false">添加部门</el-button>
      <el-button type="warning" @click="setStation = true;setDepartment=false">设置模块</el-button>
  </div>
  <recursive-menu :menu-data="menuData" />
  <div class="content">
              <div v-if="setDepartment">
                <el-form :model="formData"  label-width="120px" class="demo-ruleForm">
                    <el-form-item label="设置部门名称" prop="name">
                       <el-input v-model="formData.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="输入部门描述" prop="description">
                       <el-input type="textarea" v-model="formData.description" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="上传部门海报" prop="image">
                      <el-upload
                        action="#"  
                        :auto-upload="false"  
                        :on-change="handleFileChange"  
                        :show-file-list="false"
                        accept="image/*"
                      >
                      <div class="upload-square">
                      <div v-if="!formData.image" class="upload-placeholder">
                        <span class="plus-icon">+</span>
                        <span class="upload-text">点击上传</span>
                      </div>
                      <img v-else :src="formData.image" alt="部门海报预览" class="preview-image">
          
                      <div v-if="formData.image" class="image-actions">
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                      @click.stop="handleRemoveImage"
                      circle
                      size="small"
                    ></el-button>
                  </div>
                </div>
              </el-upload>
              <div class="upload-tip">请选择图片文件（支持 JPG/PNG）</div>
                  </el-form-item>
                  <el-form-item label="设置部门负责人" prop="manager">
                    <el-input v-model="formData.manager"  placeholder="请输入姓名" autocomplete="off" />
                    <el-button type="primary" @click="search">搜索</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button  @click="addDepartment">确定</el-button>
                    <el-button @click="setDepartment=false">取消</el-button>

                  </el-form-item>
                </el-form>

              </div>



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
              
   
 
  
</template>

<script setup lang="ts">
import { ref,reactive, onBeforeUnmount } from 'vue'
import { onBeforeMount } from 'vue'
import { useUserStore } from '../store/user'
import { useStationStore } from '../store/station'
import { Station } from '../store/station'
import { ElMessage,  ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import RecursiveMenu from '../components/RecursiveMenu.vue'
import { getStationView } from '../store/stationTree'
import { onMounted } from 'vue'

const BaseUrl='https://i.sdu.edu.cn/XSZX/NXXT/api'
const user = useUserStore()
const station = useStationStore()
const menuData = ref<Station[]>([]); 


onMounted(async () => {
  const sentProp = await getStationView(1); 
  menuData.value = [sentProp]; 

});







const setDepartment=ref(false)
const setStation=ref(false)

const formData = reactive({
  name: '',
  parentId: 0,
  stationId: 0,
  description: '',
  manager: '',
  image: ''

});

const stationList = reactive({
  name: '',
  parentId: 0,
  description: '',
  manager: '',
})

const stationStore:Station[] = []
const stationMap = ref(stationStore)



// 图片上传处理
function handleFileChange(file: any) {
  if (!file.raw.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  formData.image = URL.createObjectURL(file.raw);
  console.log(formData.image)
  station.changeImg(formData.image)

}

// 删除图片
function handleRemoveImage() {
  if (formData.image.startsWith('blob:')) {
    URL.revokeObjectURL(formData.image);
  }
  formData.image = '';
}

// 组件卸载时清理
onBeforeUnmount(() => {
  if (formData.image.startsWith('blob:')) {
    URL.revokeObjectURL(formData.image);
  }
});






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
  let url = `${BaseUrl}/station/create`  
try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.getToken}`
    },
    body: JSON.stringify({
      name: station.getName,
      description: station.getDescription,
      pId: station.getParentId,
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


 station.changeName(formData.name)
 station.changeDescription(formData.description)
 let url = `${BaseUrl}/department/create`  
 try {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.getToken}`
    },
    body: JSON.stringify({
      name: station.getName,
      pId: station.getParentId,
      description: station.getDescription,
      image:station.getImg
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




</script>

<style scoped>
  h3{
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
  }
  .upload-square {
  width: 150px;
  height: 150px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s;
}

.upload-square:hover {
  border-color: #409eff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8c939d;
}

.plus-icon {
  font-size: 30px;
  line-height: 1;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  right: 5px;
  bottom: 5px;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #8c939d;
}
</style>
