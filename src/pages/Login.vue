<template>
  <div class="login">
    <div class="loginHeader">
      <img src='@/assets/logo.png' alt="logo" id="logo" />
    </div>
    
    <div class="login-toggle">
      <el-tabs v-model="loginType" class="login-tabs">
        <el-tab-pane name="account">
          <template #label>
            <span class="tab-label account-tab">
              <el-icon><User /></el-icon>
              账号密码登录
            </span>
          </template>
          <div class="form-container account-login">
            <div class="login-type-header">
              <el-icon class="login-type-icon"><User /></el-icon>
              <h3>账号密码登录</h3>
              <p>使用您的账号和密码进行登录</p>
            </div>
            <el-form :model="form1" :rules="rules" ref="formRef1" label-width="0px" class="demo-form-inline">
              <el-form-item  prop="studentNumber">
                <el-input v-model="form1.studentNumber" placeholder="请输入学号"></el-input>
              </el-form-item>
              <el-form-item  prop="password">
                <el-input v-model="form1.password" placeholder="请输入密码" show-password></el-input>
              </el-form-item>
              <el-form-item class="auto-login-checkbox">
                <el-checkbox v-model="form1.autoLogin" label="自动登录" size="small"></el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleLoginOne" class="login-button">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        
        <el-tab-pane name="cas">
          <template #label>
            <span class="tab-label cas-tab">
              <el-icon><Key /></el-icon>
              统一认证登录
            </span>
          </template>
          <div class="form-container cas-login">
            <div class="login-type-header">
              <el-icon class="login-type-icon"><Key /></el-icon>
              <h3>统一认证登录</h3>
              <p>使用学校统一认证系统登录</p>
            </div>
            <el-form :model="form2" :rules="rules" ref="formRef2" label-width="0px" class="demo-form-inline">
              <el-form-item  prop="studentNumber">
                <el-input v-model="form2.studentNumber" placeholder="请输入学号"></el-input>
              </el-form-item>
              <el-form-item  prop="password">
                <el-input v-model="form2.password" placeholder="请输入密码" show-password></el-input>
              </el-form-item>
              <el-form-item class="auto-login-checkbox">
                <el-checkbox v-model="form2.autoLogin" label="自动登录" size="small"></el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleLoginTwo" class="login-button">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup >
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router' 
import { ElMessageBox, ElMessage, ElForm, ElFormItem, ElInput, ElButton, ElTabs, ElTabPane, ElIcon } from 'element-plus'
import { User, Key } from '@element-plus/icons-vue'
const router = useRouter() 

const baseURL="https://i.sdu.edu.cn/XSZX/NXXT/api"
const loginType = ref('account');
const form1 = reactive({
    studentNumber: '',
    password: '',
    autoLogin: false
})
const form2 = reactive({
    studentNumber: '',
    password: '',
    autoLogin: false
})
const user = useUserStore()

// 登录
// 账号密码登录

async function handleLoginOne(){
   user.changeStudentNumber(form1.studentNumber)
   user.changePassword(form1.password)
   user.changeAutoLogin(form1.autoLogin)

   console.log(user.getStudentNumber);
   console.log(user.getPassword);
   console.log(user.getAutoLogin);

  try {
    const queryParams = new URLSearchParams({
      studentNumber: user.getStudentNumber,
      password: user.getPassword
    });

    const response = await fetch(`${baseURL}/user/login?${queryParams}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' 
      }
    });
    
    const message = await response.json();
    console.log(message);

    if (message.code === 200) {
      user.changeToken(message.data);
      user.changeIsLogin()
      
      // 根据自动登录选项设置token存储
      if (form1.autoLogin) {
        // 长期存储
        localStorage.setItem('token', message.data);
        localStorage.setItem('autoLogin', 'true');
      } else {
        // 短期存储
        sessionStorage.setItem('token', message.data);
        localStorage.setItem('autoLogin', 'false');
      }
      
      router.push('/');
    } else {
      ElMessage.error('登录失败，请重试');
    }
  } catch (err) {
    console.error("登录失败:", err);
    ElMessage.error('登录失败，请重试');
  }
}
// 统一认证登录

async function handleLoginTwo(){
   user.changeStudentNumber(form2.studentNumber)
   user.changePassword(form2.password)
   user.changeAutoLogin(form2.autoLogin)

   console.log(user.getStudentNumber);
   console.log(user.getPassword);
   console.log(user.getAutoLogin);
   console.log(typeof user.getStudentNumber)

  try {
 const queryParams = new URLSearchParams({
  studentNumber: user.getStudentNumber,
  password: user.getPassword,
  fingerprint: user.getStudentNumber
});

const response = await fetch(`${baseURL}/user/login/cas?${queryParams}`, {
  method: "POST",
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded' 
  }
});
  
  const message = await response.json();
  console.log(message);

  if (message.code === 200) {
    router.push('/');
    user.changeToken(message.data);
  } else if (message.code === 400) {
    // 弹窗获取验证码
    const { value } = await ElMessageBox.prompt('请输入验证码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    });

    // 带验证码的第二次请求
    const queryParams2 = new URLSearchParams({
     studentNumber: user.getStudentNumber,
     password: user.getPassword,
     fingerprint: user.getStudentNumber,
     captcha: value

});
    const secondResponse = await fetch(`${baseURL}/user/login/cas?${queryParams2}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const secondMessage = await secondResponse.json();
    if (secondMessage.code === 200) {
      user.changeToken(secondMessage.data);
      user.changeIsLogin()
      console.log(user.getToken);
      
      // 根据自动登录选项设置token存储
      if (form2.autoLogin) {
        // 长期存储
        localStorage.setItem('token', secondMessage.data);
        localStorage.setItem('autoLogin', 'true');
      } else {
        // 短期存储
        sessionStorage.setItem('token', secondMessage.data);
        localStorage.setItem('autoLogin', 'false');
      }
      
      router.push('/');
    }
  }
} catch (err) {
  console.error("登录失败:", err);
  this.$message.error('登录失败，请重试');
}
}

</script>

<style scoped>
.loginHeader {
 position: fixed;
 
  background-color: rgba(159, 35, 26, 1);
  height: 100px;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  padding-top: 100px;
  box-sizing: border-box;
}

.loginHeader {
  position: static;
  background-color: rgba(159, 35, 26, 1);
  height: 100px;
  width: 100%;
  max-width: 500px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0px;
}

#logo {
  height: 60px;
}

.login-toggle {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-tabs {
  width: 100%;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__nav-wrap) {
  display: flex;
  justify-content: center;
}

:deep(.el-tabs__item) {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
  font-weight: 600;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-tab {
  color: #409eff;
}

.cas-tab {
  color: #67c23a;
}

.form-container {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.account-login {
  border-left: 5px solid #409eff;
}

.cas-login {
  border-left: 5px solid #67c23a;
}

.login-type-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.login-type-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.account-login .login-type-icon {
  color: #409eff;
}

.cas-login .login-type-icon {
  color: #67c23a;
}

.login-type-header h3 {
  margin: 10px 0;
  color: #333;
  font-size: 20px;
}

.login-type-header p {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.demo-form-inline {
  width: 100%;
  padding: 0;
  border: none;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-button {
  width: 100%;
  margin-top: 20px;
  align-self: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  height: 45px;
  border-radius: 6px;
}

.auto-login-checkbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding-left: 30%;
  box-sizing: border-box;
}

.auto-login-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
  padding-left: 5px;
}

</style>
