import { defineStore } from 'pinia'

export  const useUserStore = defineStore('user', {
   actions:{
      changeStudentNumber(value:string){
         this.studentNumber=value
      },
      changePassword(value:string){
         this.password=value
      },
   },
   getters:{
      getStudentNumber():string{
         return this.studentNumber
      },
      getPassword():string{
         return this.password
      }
   }, 
   state(){
      return {
          studentNumber:'--',
          password:'--'
      } 
   },
})
export default useUserStore