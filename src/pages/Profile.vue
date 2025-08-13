<template>
  <div class="profile-container">
    <h1>个人信息</h1>
    <div class="profile-content">
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <div class="profile-info" v-if="!isEditing">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="profile-avatar">
                <el-avatar :size="100" :src="userInfo.avatar" />
                <div class="avatar-upload" v-if="!isEditing">
                  <el-button size="small" @click="handleAvatarUpload">修改头像</el-button>
                  <input type="file" ref="avatarInputRef" style="display: none" @change="onAvatarChange" accept="image/*" />
                </div>
              </div>
            </el-col>
            <el-col :span="16">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
                <el-descriptions-item label="姓名">{{ userInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ userInfo.gender }}</el-descriptions-item>
                <el-descriptions-item label="学院">{{ userInfo.depart }}</el-descriptions-item>
                <el-descriptions-item label="专业">{{ userInfo.major || '未填写' }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
                <el-descriptions-item label="QQ">{{ userInfo.qq }}</el-descriptions-item>
                <el-descriptions-item label="类型">{{ userInfo.type === 0 ? '学生' : '教师' }}</el-descriptions-item>
                <el-descriptions-item label="个人简介">{{ userInfo.profile }}</el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </div>
        <div class="profile-edit" v-else>
          <el-form :model="editForm" label-width="100px" ref="editFormRef">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="editForm.name" disabled />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="editForm.gender" placeholder="请选择性别" disabled>
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
            <el-form-item label="学院">
              <el-input v-model="editForm.depart" disabled />
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="editForm.major" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="editForm.email" />
            </el-form-item>
            <el-form-item label="QQ">
              <el-input v-model="editForm.qq" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="editForm.profile" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button @click="cancelEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <span>操作</span>
          </div>
        </template>
        <div class="profile-actions">
          <el-button type="primary" @click="handleEdit" v-if="!isEditing">编辑信息</el-button>
          <el-button @click="handleChangePassword">修改密码</el-button>
          <el-button @click="handleLogout">退出登录</el-button>
        </div>
      </el-card>
      
      <!-- 修改密码对话框 -->
      <el-dialog v-model="passwordDialogVisible" title="修改密码" width="500px">
        <el-form :model="passwordForm" label-width="100px" ref="passwordFormRef">
          <el-form-item label="旧密码">
            <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="如果没有旧密码可不填" />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="passwordForm.newPassword" type="password" show-password />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="passwordDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="savePassword">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { getUserInfo, updateUserInfo, uploadAvatar, updatePassword } from '../services/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const baseURL="https://i.sdu.edu.cn/XSZX/NXXT/api"

// 用户信息
const userInfo = ref({
  username: '',
  gender: '',
  depart: '',
  major: '',
  name: '',
  email: '',
  type: 0,
  avatar: '',
  qq: '',
  profile: '',
  password: ''
})

// 编辑状态
const isEditing = ref(false)
// 编辑表单
const editForm = ref({
  username: '',
  gender: '',
  depart: '',
  major: '',
  name: '',
  email: '',
  qq: '',
  profile: '',
  password: ''
})
// 编辑表单引用
const editFormRef = ref()
// 头像上传输入框引用
const avatarInputRef = ref()

// 修改密码对话框显示状态
const passwordDialogVisible = ref(false)
// 修改密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
// 修改密码表单引用
const passwordFormRef = ref()
// 是否有密码
const hasPassword = ref(false)

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    // 从store获取用户信息
    const storedUserInfo = userStore.getUserInfo;
    console.log('store中的用户信息:', storedUserInfo);
    if (storedUserInfo && storedUserInfo.name) {
      // 如果store中有用户信息，直接使用
      userInfo.value = storedUserInfo;
      // 检查是否有密码
      hasPassword.value = storedUserInfo.password && storedUserInfo.password !== '';
    } else {
      // 如果store中没有用户信息，通过接口获取
      const res = await getUserInfo();
      console.log('接口获取的用户信息:', res);
      if (res.code === 200) {
        // 更新store中的用户信息
        userStore.changeUserInfo(res.data);
        // 更新页面显示的用户信息
        userInfo.value = res.data;
        // 检查是否有密码
        hasPassword.value = res.data.password && res.data.password !== '';
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
}

// 编辑信息
const handleEdit = () => {
  isEditing.value = true
  // 初始化编辑表单
  editForm.value = { ...userInfo.value }
}

// 保存编辑
const saveEdit = async () => {
  try {
    const res = await updateUserInfo(editForm.value)
    console.log('更新用户信息成功:', res)
    // 更新store中的用户信息
    userStore.changeUserInfo(editForm.value)
    // 更新页面显示的用户信息
    userInfo.value = { ...editForm.value }
    // 退出编辑状态
    isEditing.value = false
    ElMessage.success('信息更新成功')
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('信息更新失败')
  }
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
}

// 修改头像
const handleAvatarUpload = () => {
  // 触发文件选择
  avatarInputRef.value.click()
}

// 头像文件选择回调
const onAvatarChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  try {
    // 上传头像
    const res = await uploadAvatar(file)
    console.log('上传头像成功:', res)
    
    // 更新store中的用户信息
    const updatedUserInfo = { ...userStore.getUserInfo, avatar: res.data.url }
    userStore.changeUserInfo(updatedUserInfo)
    
    // 更新页面显示的用户信息
    userInfo.value = updatedUserInfo
    
    ElMessage.success('头像更新成功')
  } catch (error) {
    console.error('上传头像失败:', error)
    ElMessage.error('头像更新失败')
  } finally {
    // 清空input的value，确保下次选择同一文件也能触发change事件
    e.target.value = ''
  }
}

// 修改密码
const handleChangePassword = () => {
  // 重置表单
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  // 显示对话框
  passwordDialogVisible.value = true
}

// 保存密码
const savePassword = async () => {
  try {
    // 验证密码
    if (!passwordForm.value.newPassword) {
      ElMessage.error('请输入新密码')
      return
    }
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      ElMessage.error('两次输入的密码不一致')
      return
    }
    
    // 准备数据
    const data = {
      // 只有当旧密码不为空时才传递旧密码
      ...(passwordForm.value.oldPassword && { oldPassword: passwordForm.value.oldPassword }),
      newPassword: passwordForm.value.newPassword
    }
    
    // 调用接口更新密码
    const res = await updatePassword(data)
    console.log('更新密码成功:', res)
    
    if (res.code === 200) {
      ElMessage.success('密码修改成功')
      // 关闭对话框
      passwordDialogVisible.value = false
      
      // 如果用户之前没有密码，更新hasPassword状态
      if (!hasPassword.value) {
        hasPassword.value = true
      }
    } else {
      ElMessage.error(res.message || '密码修改失败')
    }
  } catch (error) {
    console.error('更新密码失败:', error)
    ElMessage.error('密码修改失败')
  }
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push({ name: 'login' })
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  width: 100%;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.profile-info {
  padding: 20px 0;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.avatar-upload {
  margin-top: 10px;
}

.profile-actions {
  display: flex;
  gap: 10px;
  padding: 20px 0;
}
</style>