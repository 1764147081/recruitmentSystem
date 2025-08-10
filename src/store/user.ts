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
      },
      changeIsLogin(){
         this.isLogin=true
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
      }


   }, 
   state(){
      return {
          studentNumber:'--',
          password:'--',
          token:'--',
          isLogin:false

      } 
   },
})
export default useUserStore