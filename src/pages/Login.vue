<template>
    
    <div class="login">
      <div class="loginHeader">
        <img src='@/assets/logo.png' alt="logo" id="logo"></img>
      </div>
         <div class="Login">
         <button @click="loginType=true">账号密码登录</button>
         <button @click="loginType=false">统一认证登录</button>
         </div>
         <div class="formOne" v-if="loginType">
            <el-form :model="form1":rules="rules" ref="formRef1" label-width="80px" class="demo-form-inline">
                <el-form-item label="学号" prop="studentNumber">
                    <el-input v-model="form1.studentNumber" placeholder="请输入学号"></el-input>
                </el-form-item> 
              <el-form-item label="密码" prop="password">
                    <el-input v-model="form1.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLoginOne">登录</el-button>
                </el-form-item>
            </el-form>
         </div>
          <div class="formTwo" v-else>
            <el-form :model="form2" :rules="rules" ref="formRef2" label-width="80px" class="demo-form-inline">
                <el-form-item label="学号" prop="studentNumber">
                    <el-input v-model="form2.studentNumber" placeholder="请输入学号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form2.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="text"  @click="handleLoginTwo">登录</el-button>
                </el-form-item>
            </el-form>
         </div>
    </div>
    
</template>

<script setup >
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router' 
import { ElMessageBox, ElMessage, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
const router = useRouter() 

const baseURL="https://i.sdu.edu.cn/XSZX/NXXT/api"
const loginType =ref (true);
const form1 = reactive({
    studentNumber: '',
    password: '',

})
const form2 = reactive({
    studentNumber: '',
    password: '',
})
const user = useUserStore()

// 登录
// 账号密码登录

function handleLoginOne(){
   user.changeStudentNumber(form1.studentNumber)
   user.changePassword(form1.password)

   console.log(user.getStudentNumber);
   console.log(user.getPassword);
   router.push('/') 
}
// 统一认证登录

async function handleLoginTwo(){
   user.changeStudentNumber(form2.studentNumber)
   user.changePassword(form2.password)

   console.log(user.getStudentNumber);
   console.log(user.getPassword);
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
      router.push('/');
      user.changeToken(secondMessage.data);
      user.changeIsLogin()
      console.log(user.getToken);
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
  justify-content: center;
  height: 100vh;
  border: 1px solid black;
}



#logo {
  height: 60px;
}

.name {
  font-size: 20px;
  margin-left: 10px;
}

.Login {
  margin: 20px 0;
}


.demo-form-inline {
  width: 400px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
