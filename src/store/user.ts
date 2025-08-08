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

   }, 
   state(){
      return {
          studentNumber:'--',
          password:'--',
          token:'--'

      } 
   },
})
export default useUserStore