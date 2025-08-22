import { defineStore } from 'pinia'

// 定义UserInfo接口，明确用户信息的结构
export interface UserInfo {
  username: string;
  gender: string;
  depart: string;
  major: string;
  name: string;
  email: string;
  type: number;
  avatar: string;
  qq: string;
  profile: string;
  password: string;
  phone: string;
}

export const useUserStore = defineStore('user', {
  actions: {
    changeStudentNumber(value: string) {
      this.studentNumber = value
    },
    changePassword(value: string) {
      this.password = value
    },
    changeToken(value: string) {
      this.token = value
      
      // 同时更新到存储中
      const autoLogin = localStorage.getItem('autoLogin') === 'true';
      if (autoLogin) {
        localStorage.setItem('token', value);
      } else {
        sessionStorage.setItem('token', value);
      }
    },
    changeIsLogin() {
      this.isLogin = true
    },
    changeAutoLogin(value: boolean) {
      this.autoLogin = value
    },
    // 这里将参数类型从object改为UserInfo，更精确
    changeUserInfo(value: UserInfo) {
      this.userInfo = value;
    },
    logout() {
      this.studentNumber = '--'
      this.password = '--'
      this.token = '--'
      this.isLogin = false
      this.autoLogin = false
      this.userInfo = {
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
        password: '',
        phone: ''
      };
      
      // 清除存储
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('autoLogin');
    }
  },
  getters: {
    getStudentNumber(): string {
      return this.studentNumber
    },
    getPassword(): string {
      return this.password
    },
    getToken(): string {
      return this.token
    },
    getIsLogin(): boolean {
      return this.isLogin
    },
    getAutoLogin(): boolean {
      return this.autoLogin
    },
    // 这里将返回类型从object改为UserInfo，更精确
    getUserInfo(): UserInfo {
      return this.userInfo
    }
  },
  state() {
    // 从存储中读取初始值
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token') || '--';
    const storedAutoLogin = localStorage.getItem('autoLogin') === 'true';
    
    return {
      studentNumber: '--',
      password: '--',
      token: storedToken,
      isLogin: storedToken !== '--',
      autoLogin: storedAutoLogin,
      // 明确指定userInfo的类型为UserInfo
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
        password: '',
        phone: ''
      } as UserInfo
    }
  },
})

export default useUserStore
    