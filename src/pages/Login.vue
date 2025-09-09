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
              <el-form-item class="captcha-container">
                <div class="captcha-input-group">
                  <el-input 
                    v-model="form2.captcha" 
                    placeholder="请输入验证码" 
                    :disabled="!captchaSent"
                    class="captcha-input"
                  ></el-input>
                  <el-button 
                    @click="sendCaptcha" 
                    :disabled="captchaLoading || !form2.studentNumber || !form2.password"
                    :loading="captchaLoading"
                    class="captcha-button"
                    type="info"
                  >
                    {{ captchaButtonText }}
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item class="auto-login-checkbox">
                <el-checkbox v-model="form2.autoLogin" label="自动登录" size="small"></el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button 
                  type="primary" 
                  @click="handleLoginTwo" 
                  class="login-button"
                  :disabled="!captchaSent || !form2.captcha"
                >
                  登录
                </el-button>
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
    autoLogin: false,
    captcha: ''
})

// 验证码相关状态
const captchaSent = ref(false)
const captchaLoading = ref(false)
const captchaButtonText = ref('发送验证码')
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
/**
 * 发送验证码函数
 * 向服务器请求验证码，处理成功和失败的情况
 */
async function sendCaptcha() {
  if (!form2.studentNumber || !form2.password) {
    ElMessage.error('请先输入学号和密码');
    return;
  }

  captchaLoading.value = true;
  captchaButtonText.value = '发送中...';

  try {
    const queryParams = new URLSearchParams({
      studentNumber: form2.studentNumber,
      password: form2.password,
      fingerprint: form2.studentNumber
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
      // 直接登录成功，不需要验证码
      user.changeStudentNumber(form2.studentNumber);
      user.changePassword(form2.password);
      user.changeAutoLogin(form2.autoLogin);
      user.changeToken(message.data);
      user.changeIsLogin();
      
      // 根据自动登录选项设置token存储
      if (form2.autoLogin) {
        localStorage.setItem('token', message.data);
        localStorage.setItem('autoLogin', 'true');
      } else {
        sessionStorage.setItem('token', message.data);
        localStorage.setItem('autoLogin', 'false');
      }
      
      router.push('/');
    } else if (message.code === 400) {
      // 需要验证码
      captchaSent.value = true;
      captchaButtonText.value = '重新发送';
      ElMessage.success('验证码已发送，请查收');
    } else if (message.code === 40002) {
      // 密码错误提示
      ElMessage.error('账号或密码错误，请检查后重试');
    } else {
      ElMessage.error('发送验证码失败，请重试');
    }
  } catch (err) {
    console.error("发送验证码失败:", err);
    ElMessage.error('发送验证码失败，请重试');
  } finally {
    captchaLoading.value = false;
    if (!captchaSent.value) {
      captchaButtonText.value = '发送验证码';
    }
  }
}

/**
 * 统一认证登录函数
 * 使用验证码进行登录
 */
async function handleLoginTwo(){
  if (!captchaSent.value || !form2.captcha) {
    ElMessage.error('请先获取验证码');
    return;
  }

  user.changeStudentNumber(form2.studentNumber);
  user.changePassword(form2.password);
  user.changeAutoLogin(form2.autoLogin);

  try {
    // 带验证码的登录请求
    const queryParams = new URLSearchParams({
      studentNumber: user.getStudentNumber,
      password: user.getPassword,
      fingerprint: user.getStudentNumber,
      captcha: form2.captcha
    });

    const response = await fetch(`${baseURL}/user/login/cas?${queryParams}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

    const message = await response.json();
    console.log(message);

    if (message.code === 200) {
      user.changeToken(message.data);
      user.changeIsLogin();
      
      // 根据自动登录选项设置token存储
      if (form2.autoLogin) {
        localStorage.setItem('token', message.data);
        localStorage.setItem('autoLogin', 'true');
      } else {
        sessionStorage.setItem('token', message.data);
        localStorage.setItem('autoLogin', 'false');
      }
      
      router.push('/');
    } else if (message.code === 401) {
      // 验证码错误提示
      ElMessage.error('验证码错误，请重新输入');
      // 清空验证码输入框
      form2.captcha = '';
    } else {
      // 其他错误提示
      ElMessage.error('登录失败，请重试');
    }
  } catch (err) {
    console.error("登录失败:", err);
    ElMessage.error('登录失败，请重试');
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
  min-height: 100vh;
  overflow-y: auto;
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

  /* 确保输入框宽度一致 */
  .demo-form-inline :deep(.el-form-item) {
  width: 100%;
  max-width: 200px;
}

.demo-form-inline :deep(.el-form-item:last-of-type) {
    max-width: 100%;
}

  .demo-form-inline :deep(.el-input) {
  width: 100%;
}

.login-button {
  display: block;
  width: 100%;
  max-width: 200px;
  margin: 20px auto 0;
}

/* 确保disabled状态的登录按钮也可见 */
.login-button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  background-color: #a0cfff !important;
  border-color: #a0cfff !important;
  color: #ffffff !important;
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
  padding-left: 0%;
  box-sizing: border-box;
}

.auto-login-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
  padding-left: 5px;
}

/* 验证码相关样式 */
.captcha-container {
  width: 100%;
  max-width: 200px;
}

.captcha-input-group {
  display: flex;
  gap: 8px;
  width: 100%;
}

.captcha-input {
  flex: 1;
}

.captcha-button {
  white-space: nowrap;
  font-size: 12px;
  padding: 0 12px;
  min-width: 80px;
}

.captcha-button:disabled {
  opacity: 0.6;
}

/* 响应式设计 - 小屏幕适配 */
@media (max-width: 768px) {
  .login {
    padding: 10px;
    padding-top: 80px;
  }
  
  .loginHeader {
    height: 80px;
    max-width: 100%;
    margin: 0 -10px;
  }
  
  .login-toggle {
    max-width: 100%;
    margin: 0 -10px;
  }
  
  .form-container {
    padding: 20px 15px;
  }
  
  .demo-form-inline :deep(.el-form-item) {
    max-width: 100%;
  }
  
  .captcha-input-group {
    flex-direction: column;
    gap: 10px;
  }
  
  .captcha-button {
    width: 100%;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .login {
    padding: 5px;
    padding-top: 70px;
  }
  
  .loginHeader {
    height: 70px;
  }
  
  #logo {
    height: 40px;
  }
  
  .form-container {
    padding: 15px 10px;
  }
  
  .login-type-header h3 {
    font-size: 18px;
  }
  
  .login-type-header p {
    font-size: 12px;
  }
}

</style>
