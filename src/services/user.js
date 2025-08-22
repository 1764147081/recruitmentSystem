import { da } from 'element-plus/es/locales.mjs';
import service from './request'
import axios from "axios";

// 获取用户信息
export function getUserInfo() {
  return service({
    url: '/user/info',
    method: 'get',
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}
export function getUserInfoByUsername(username) {
  return service({
    url: `/user/info?username=${username}`,
    method: 'get',
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}


// 更新用户信息
export function updateUserInfo(data) {
  return service({
    url: '/user/update/info',
    method: 'put',
    data
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}

// 上传头像
export function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  return service({
    url: '/user/upload/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}


// 更新密码
export function updatePassword(data) {
  return service({
    url: '/user/update/password',
    method: 'post',
    data
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}

// 获取问卷状态
export function getQuestionnaireStatus() {
  return service({
    url: '/questionnaire/view/status',
    method: 'get'
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}

// 展开站点
export function unfoldStation(stationId) {
  return service({
    url: `/station/unfold?id=${stationId}`,
    method: 'get'
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}

// 获取部门详细信息
export function getDepartmentInfo(departmentId) {
  return service({
    url: `/department/view?stationId=${departmentId}`,
    method: 'get'
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}

export function getStationInfo(stationId){
  return service({
    url: `/station/view?id=${stationId}`,
    method: 'get'
  }).then(res=>{
    return res.data;
  }).catch(err=>{
    throw err;

  })
}



export function createQuestionnaire(departmentId,data) {
  return service({
    url: `/questionnaire/edit?departmentId=${departmentId}`,
    method: 'post',
    data

  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;

  });
}
export function getQuestionnaire(departmentId) {
  return service({
    url: `/department/view/questionnaire?departmentId=${departmentId}`,
    method: 'get'
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}

export function getQuestionnaireDetailedById(departmentId){
  return service({
    url: `/department/view/questions?departmentId=${departmentId}`,
    method: 'get'
  }).then(
    res=>{
      return res.data;
    }

  ).catch(
    err=>{
      throw err;
    }
  )
}


export function addQuestion(question) {
  return service({
    url: `/questionnaire/edit/questions`,
    method: 'post',
    data:question
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}

export function getDepartmentIdByStationId(stationId){
  return service({
    url: `/department/view?stationId=${stationId}`,
    method: 'get'
  }).then(res=>{
    return res.data;
  }).catch(err=>{
    throw err;

  })
}

export function publishQuestionnaire(questionnaireId) {
  return service({
    url: `/questionnaire/publish?questionnaireId=${questionnaireId}`,
    method: 'post'
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}

export function deleteQuestionnaire(departmentId) {
  return service({
    url: `/questionnaire/delete?departmentId=${departmentId}`,
    method: 'post'
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}

export function getFinishedQuestionnaire(departmentId) {
  return service({
    url: `/answer/view/department?departmentId=${departmentId}`,
    method: 'get'
  }).then(res => {
    return res.data;
  }).catch(err => {
    throw err;
  });
}





