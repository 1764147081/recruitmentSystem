<template>
  <div>
    <h1>编辑组织目录</h1>
      <el-button type="warning" @click="setDepartment = true;setStation=false"  >添加部门</el-button>
      <el-button type="warning" @click="setStation = true;setDepartment=false">设置模块</el-button>
      <el-button type="danger" @click="deleteDepartment">删除</el-button>
      <el-button  @click="getPermission">查看管理员</el-button>
      <el-button type="primary" @click="getDepartmentDetail">编辑</el-button>


  </div>
  <recursive-menu :menu-data="menuData":key="menuKey"  class="index"/>

  <h3>搜索人员</h3>

  <div class="search">
    <el-input placeholder="请输入管理员姓名" v-model="username" class="search-input"/>
    <el-button type="primary" @click="search">查询</el-button>
    <el-button type="primary" @click="setPermission">添加</el-button>
  </div>
  <div class="permissionTable">
    <el-table :data="userInfo" style="width: 100%">
    <el-table-column prop="name" label="姓名" width="300" />
    <el-table-column prop="depart" label="学院" width="300" />
    <el-table-column prop="username" label="学号" width="300" />
    <el-table-column label="操作" min-width="300">
      <template #default="scope">
        <el-button link type="danger" size="small" @click="handlePermissionDelete(scope.row)">
          删除
        </el-button>
     </template>
    </el-table-column>
    </el-table>
  </div>


  <div>
              <div class="department" v-if="setDepartment">
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
                  <el-form-item>
                    <el-button  @click="addDepartment">确定</el-button>
                    <el-button @click="setDepartment=false">取消</el-button>

                  </el-form-item>
                </el-form>

              </div>



              <div class="station" v-if="setStation">

                <el-form :model="stationList"   label-width="120px" class="demo-ruleForm">
                  <el-form-item label="设置模块名称" prop="name">
                    <el-input v-model="stationList.name" autocomplete="off" />
                  </el-form-item>
                  <el-form-item label="输入模块描述"prop="description">
                    <el-input type="textarea" v-model="stationList.description" autocomplete="off" />
                  </el-form-item>
                  <el-form-item label="是否为部门">
                     <el-radio v-model="stationList.isDepartment" label="0">否</el-radio>
                     <el-radio v-model="stationList.isDepartment" label="1">是</el-radio>
                  </el-form-item>


                  <el-form-item>
                    <el-button  @click="addStation">确定</el-button>
                    <el-button @click="setStation=false">取消</el-button>
                  </el-form-item>
                </el-form>
              </div>
  </div>  
  
  

  <div class="editForm" v-if="ifEdit">
    <el-form :model="editForm"  label-width="120px" class="demo-ruleForm">
      <el-form-item label="设置部门名称" prop="name">
         <el-input v-model="editForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="输入部门描述" prop="description">
         <el-input type="textarea" v-model="editForm.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="上传部门海报" prop="image" v-if="station.getIsDepartment == 1">
        <el-upload
          action="#"  
          :auto-upload="false"  
          :on-change="handleEditFileChange"  
          :show-file-list="false"
          accept="image/*"
        >
        <div class="upload-square">
        <div v-if="!editForm.image" class="upload-placeholder">
          <span class="plus-icon">+</span>
          <span class="upload-text">点击上传</span>
        </div>
        <img v-else :src="editForm.image" alt="部门海报预览" class="preview-image">
    
        <div v-if="editForm.image" class="image-actions">
        <el-button
          type="danger"
          icon="el-icon-delete"
        @click.stop="handleRemoveEditImage"
        circle
        size="small"
      ></el-button>
    </div>
  </div>
  <div class="upload-tip">请选择图片文件（支持 JPG/PNG）</div>
      </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button  @click="edit">确定</el-button>
        <el-button @click="ifEdit=false">取消</el-button>
      </el-form-item>
    </el-form>  
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
import { stat } from 'fs'
import { getUserInfoByUsername ,getDepartmentInfo,getStationInfo} from '@/services/user'

import constants from 'constants'

const BaseUrl='https://i.sdu.edu.cn/XSZX/NXXT/api'
const user = useUserStore()
const station = useStationStore()
const menuData = ref<Station[]>([]); 


const fetchMenuData = async () => {
  try {
    const sentProp = await getStationView(1); 
    menuData.value = [sentProp]; 
  } catch (error) {
    console.error('获取菜单数据失败:', error);
    ElMessage.error('获取菜单数据失败');
  }
};


onBeforeMount(fetchMenuData)




const menuKey = ref(0);

const refreshMenu = () => {
  menuKey.value += 1;
  fetchMenuData();

};






const ifEdit=ref(false)
const setDepartment=ref(false)
const setStation=ref(false)
const username=ref("")

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
  isDepartment: 0,
})

const editForm = reactive({
  name: '',
  description: '',
  image: '',
  id:0,
  pId:0,
  stationId:0,
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

function handleEditFileChange(file: any) {
  if (!file.raw.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  editForm.image = URL.createObjectURL(file.raw);
  console.log(editForm.image)
}


// 删除图片
function handleRemoveImage() {
  if (formData.image.startsWith('blob:')) {
    URL.revokeObjectURL(formData.image);
  }
  formData.image = '';
}

function handleRemoveEditImage() {
  if (formData.image.startsWith('blob:')) {
    URL.revokeObjectURL(editForm.image);
  }
  editForm.image = '';
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
  console.log(username.value)
  let url = `${BaseUrl}/user/info?username=${username.value}`

  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization':`Bearer ${user.getToken}`
      }
    })
    let data = await response.json()
    if(data.code == 200) {
      username.value = data.data.username
     alert(data.data.username)
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
        pId: station.getId,
        isDepartment:stationList.isDepartment
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Success:', data);
    
    // 添加成功后刷新菜单
    await refreshMenu();
    ElMessage.success('模块创建成功');
    
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    ElMessage.error('模块创建失败');
    throw error;
  }
}

async function addDepartment() {
  station.changeName(formData.name)
  station.changeDescription(formData.description)
  console.log(station.getParentId)
  console.log(station.getId)



  let url = `${BaseUrl}/department/create`  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.getToken}`
      },
      body: JSON.stringify({
        pId:station.getId,
        name: station.getName,
        description: station.getDescription,
        image:station.getImg,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Success:', data);
    
    // 添加成功后刷新菜单
     refreshMenu();
    ElMessage.success('部门创建成功');
    
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    ElMessage.error('部门创建失败');
    throw error;
  }
}

async function deleteDepartment(){
  try{
    const res = await fetch(`${BaseUrl}/station/del?stationId=${station.getId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.getToken}`
      }
    })
    if(res.status == 200) {
      ElMessage.success('部门删除成功');
    }
    refreshMenu();
  }catch(error){
    console.error('Request failed:', error);
    ElMessage.error('部门删除失败');
    throw error;
  }
  



}

//权限设置部分

interface User {
  username: number,
  depart: string,
  name: string,
  permissionId: number,

}

const userInfo = ref<User[]>([])



async function getPermission(){
  try{
    userInfo.value = []
    const response = await fetch(`${BaseUrl}/permission/show/station?stationId=${station.getId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.getToken}`
      }
    })
   
    let res = await response.json()
    const tempUsers: User[] = []
          for (const item of res.data) {
        try {
          const userDetail = await getUserInfoByUsername(item.username)
          console.log('用户详情:', userDetail)

          if (userDetail.code === 200 && userDetail.data) {
            tempUsers.push({
              username: item.username,
              depart: userDetail.data.depart || '',
              name: userDetail.data.name || '',
              permissionId:item.id

            })
          } else {
            // 如果获取详情失败，至少保留用户名
            tempUsers.push({
              username: item.username,
              depart: '无权访问',
              name: '无权访问',
              permissionId:item.id

            })
          }
        } catch (error) {
          console.log(`获取用户${item.username}信息失败:`, error)
          tempUsers.push({
            username: item.username,
            depart: '获取失败',
            name: '获取失败',
            permissionId:item.id

          })
        }
      }
      userInfo.value = tempUsers
      console.log(userInfo.value)
    
    

  }catch(error){
  console.error('Request failed:', error);
  ElMessage.error('无管理员');
  throw error;
}

 } 

 async function setPermission() {
  const queryParams = new URLSearchParams({
  stationId:station.getId.toString(),
  username:username.value,
})
  const url = `${BaseUrl}/permission/set?${queryParams}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.getToken}`
    }
  })
  let data = await response.json()
  if(data.code == 200) {
    ElMessage.success("设置成功")
    getPermission()
    console.log(data)
  }else{
    ElMessage.error("设置失败")
  }


}


async  function handlePermissionDelete  (row: any) {
  const permissionId = row.permissionId; // 获取 permissionId
  console.log('要删除的permissionId:', permissionId);
  const queryParams = new URLSearchParams({
    permissionId:permissionId.toString(),
  })
  const url = `${BaseUrl}/permission/del?${queryParams}`
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.getToken}`
    }
  })
  let data = await response.json()
  if(data.code == 200) {
    ElMessage.success("删除成功")
    getPermission()
    console.log(data)
  }else{
    ElMessage.error("删除失败")
  }

  
};

async function getDepartmentDetail(){
  ifEdit.value=true
  let res:any = {}
  if(station.getIsDepartment == 1) {
    res = await getDepartmentInfo(station.getId)
  }else{
    res = await getStationInfo(station.getId)
  }
  
  editForm.name = res.data.name
  editForm.description = res.data.description
  editForm.id = res.data.id
  editForm.pId = res.data.pId
  if(station.getIsDepartment == 1) {
    editForm.image=res.data.image
    editForm.stationId = res.data.stationId
  }
 

}

async function edit(){
  if(station.getIsDepartment == 0) {
    try{
    const response = await fetch(`${BaseUrl}/station/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.getToken}`
      },
      body: JSON.stringify({
        id: editForm.id,
        pId: editForm.pId,
        name: editForm.name,
        description: editForm.description,
      })
    })
    let data = await response.json()
    if(data.code == 200) {
      ElMessage.success("编辑成功")
      getPermission()
      console.log(data)
    }else{
      ElMessage.error("编辑失败")
    }
  }catch(error){
    console.error('Request failed:', error);
    ElMessage.error('编辑失败');
    throw error;
  }
    
  }else{
    try{
    const response = await fetch(`${BaseUrl}/department/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.getToken}`
      },
      body: JSON.stringify({
        id: editForm.id,
        pId: editForm.pId,
        name: editForm.name,
        description: editForm.description,
        image:editForm.image,
        stationId:editForm.stationId,
      })
    })
    let data = await response.json()
    if(data.code == 200) {
      ElMessage.success("编辑成功")
      getPermission()
      console.log(data)
    }else{
      ElMessage.error("编辑失败")
    }
  }catch(error){
    console.error('Request failed:', error);
    ElMessage.error('编辑失败');
    throw error;
  }
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


/* 弹窗通用样式 */
.department, .editForm, .station {
  /* 固定定位确保弹窗在屏幕中间 */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  /* 弹窗外观样式 */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 24px;
  min-width: 500px;
  
  /* 确保弹窗在最上层 */
  z-index: 1000;
}

/* 弹窗关闭时隐藏 */
.department[v-if="!setDepartment"],
.editForm[v-if="!ifEdit"],
[v-if="!setStation"] {
  display: none;
}

/* 背景遮罩层 */
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* 当弹窗显示时显示遮罩层 */
.department[v-if="setDepartment"] ~ body::before,
.editForm[v-if="ifEdit"] ~ body::before,
[v-if="setStation"] ~ body::before {
  opacity: 1;
  pointer-events: auto;
}

/* 上传区域样式优化 */
.upload-square {
  width: 200px;
  height: 200px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-square:hover {
  border-color: #409eff;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.plus-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 14px;
}

.image-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

/* 表单样式微调 */
.demo-ruleForm {
  width: 100%;
}

.el-form-item {
  margin-bottom: 20px;
}

.index{
  width: 50%;
  border: 1px solid #0e0101;
  border-radius: 8px;
  margin-left: 20%;
  margin-top: 5%;

}

.permissionTable{
  width: 50%;
  margin-left: 20%;
  border: 1px solid #0e0101;
  margin-top: 5%;

}


.search {
  display: flex; /* 启用弹性布局 */
  align-items: center; /* 垂直居中对齐元素 */
  gap: 16px; /* 元素之间的间距，可根据需要调整 */
  padding: 10px 0; /* 可选：添加上下内边距 */
}

/* 可选：调整标题样式，避免过大影响布局 */
.search h2 {
  margin: 0;
  font-size: 1.5rem;
}

.search-input {
  width: 300px;
  margin-left: 20%;
}

</style>
