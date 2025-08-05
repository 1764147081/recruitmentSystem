<template>
    
    <div class="login">
      <div>
        <img src='@/assets/logo.png' alt="logo" id="logo"></img>
        <div class="name">yourName</div>
      </div>
         <div class="Login">
         <button @click="loginType=true">账号密码登录</button>
         <button @click="loginType=false">统一认证登录</button>
         </div>
         <div class="formOne" v-if="loginType">
            <el-form :model="form1":rules="rules" ref="formRef1" label-width="80px" class="demo-form-inline">
                <el-form-item label="用户名" prop="studentNumber">
                    <el-input v-model="form1.studentNumber" placeholder="请输入用户名"></el-input>
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
                <el-form-item label="用户名" prop="studentNumber">
                    <el-input v-model="form2.studentNumber" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form2.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLoginTwo">登录</el-button>
                </el-form-item>
            </el-form>
         </div>
    </div>
    
</template>

<script setup >
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router' 
import { ElHeader, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
const router = useRouter() 

const loginType =ref (true);
const form1 = reactive({
    studentNumber: '',
    password: ''
})
const form2 = reactive({
    studentNumber: '',
    password: ''
})
const user = useUserStore()

function handleLoginOne(){
   user.changeStudentNumber(form1.studentNumber)
   user.changePassword(form1.password)
   console.log(user.getStudentNumber);
   console.log(user.getPassword);
   router.push('/') 
}

function handleLoginTwo(){
   user.changeStudentNumber(form2.studentNumber)
   user.changePassword(form2.password)
   console.log(user.getStudentNumber);
   console.log(user.getPassword);
   router.push('/') 
}

</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
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

.Login button {
  margin: 0 10px;
  padding: 8px 16px;
  cursor: pointer;
}

.demo-form-inline {
  width: 400px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
