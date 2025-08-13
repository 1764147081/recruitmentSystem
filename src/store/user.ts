import { defineStore } from 'pinia'

export  const useUserStore = defineStore('user', {
   actions:{
      changeStudentNumber(value:string){
         this.studentNumber=value
      },
      changePassword(value:string){
         this.password=value
      },
      changeToken(value:string){
         this.token=value
         
         // 同时更新到存储中
         const autoLogin = localStorage.getItem('autoLogin') === 'true';
         if (autoLogin) {
           localStorage.setItem('token', value);
         } else {
           sessionStorage.setItem('token', value);
         }
      },
      changeIsLogin(){
         this.isLogin=true
      },
      changeAutoLogin(value:boolean){
         this.autoLogin=value
      },
      changeUserInfo(value:object){
         this.userInfo = value;
      },
      logout(){
         this.studentNumber='--'
         this.password='--'
         this.token='--'
         this.isLogin=false
         this.autoLogin=false
         this.userInfo = {
            name: '',
            email: '',
            phone: '',
            avatar: ''
         };
         
         // 清除存储
         localStorage.removeItem('token');
         sessionStorage.removeItem('token');
         localStorage.removeItem('autoLogin');
      }


   },
   getters:{
      getStudentNumber():string{
         return this.studentNumber
      },
      getPassword():string{
         return this.password
      },
      getToken():string{
         return this.token
      },
      getIsLogin():boolean{
          return this.isLogin
      },
      getAutoLogin():boolean{
          return this.autoLogin
      },
      getUserInfo():object{
          return this.userInfo
      }


   }, 
   state(){
      // 从存储中读取初始值
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token') || '--';
      const storedAutoLogin = localStorage.getItem('autoLogin') === 'true';
      
      return {
          studentNumber:'--',
          password:'--',
          token: storedToken,
          isLogin: storedToken !== '--',
          autoLogin: storedAutoLogin,
          userInfo: {
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
          }

      } 
   },
})
export default useUserStore