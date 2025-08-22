import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
    actions: {
        changeStudentNumber(value) {
            this.studentNumber = value;
        },
        changePassword(value) {
            this.password = value;
        },
        changeToken(value) {
            this.token = value;
            // 同时更新到存储中
            const autoLogin = localStorage.getItem('autoLogin') === 'true';
            if (autoLogin) {
                localStorage.setItem('token', value);
            }
            else {
                sessionStorage.setItem('token', value);
            }
        },
        changeIsLogin() {
            this.isLogin = true;
        },
        changeAutoLogin(value) {
            this.autoLogin = value;
        },
        changeUserInfo(value) {
            this.userInfo = value;
        },
        logout() {
            this.studentNumber = '--';
            this.password = '--';
            this.token = '--';
            this.isLogin = false;
            this.autoLogin = false;
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
    getters: {
        getStudentNumber() {
            return this.studentNumber;
        },
        getPassword() {
            return this.password;
        },
        getToken() {
            return this.token;
        },
        getIsLogin() {
            return this.isLogin;
        },
        getAutoLogin() {
            return this.autoLogin;
        },
        getUserInfo() {
            return this.userInfo;
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
        };
    },
});
export default useUserStore;
//# sourceMappingURL=user.js.map