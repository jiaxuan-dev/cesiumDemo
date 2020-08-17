/*
 * @Descripttion: 后台接口
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-04-22 10:07:08
 * @LastEditors: hxl
 * @LastEditTime: 2020-07-23 14:53:43
 */

import axios from 'axios'
import Vue from 'vue'
// 框架数据接口
export const getModelLists = paras => {
  return axios.get(`${Vue.prototype.apiUrl}api/TinData/GetAllDataSetName`, {
    params: paras
  })
}
export const getLayerInfoByName = paras => {
  return axios.get(`${Vue.prototype.apiUrl}api/TinData/GetLayerInfoByName`, {
    params: paras
  })
}
export const getLayerDataByName = paras => {
  return axios.get(`${Vue.prototype.apiUrl}api/TinData/GetLayerDataByName`, {
    params: paras
  })
}
export const getLayerJson = paras => {
  return axios.get(`${Vue.prototype.apiUrl}api/TinData/GetLayerJson`, {
    params: paras
  })
}
export const drill = paras => {
  return axios.post(`${Vue.prototype.apiUrl}api/TinWGS84Data/Drill`, paras)
}
export const verticalSection = paras => {
  return axios.post(`${Vue.prototype.apiUrl}api/TinWGS84Data/VerticalSectionClip`, paras)
}
export const horizontalSection = paras => {
  return axios.post(`${Vue.prototype.apiUrl}api/TinWGS84Data/HorizontalSectionClip`, paras)
}
export const digHoleClip = paras => {
  return axios.post(`${Vue.prototype.apiUrl}api/TinWGS84Data/DigHoleClip`, paras)
}
export const digRoamClip = paras => {
  return axios.post(`${Vue.prototype.apiUrl}api/TinWGS84Data/DigRoamClip`, paras)
}
export const digRoamClipFace = paras => {
  return axios.post(`${Vue.prototype.apiUrl}api/TinWGS84Data/DigRoamClipFace`, paras)
}
