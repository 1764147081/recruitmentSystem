import service from './request'
import qs from "qs";

function getUserRouters(uid){
    return service({
        url: '/api/user/getUserRouters',// 获取用户权限路由,接口未定
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
            uid
        }).then(res => {
            return res.data;
        }).catch(err => {
            throw err;
        })
    })
}
export {
    getUserRouters
}