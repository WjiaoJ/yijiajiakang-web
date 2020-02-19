import axios from 'axios'
import { Notification } from 'element-ui'
import { AuthToken, toQueryStr } from './utils'

const http = axios.create({ baseURL: 'http://29n1t43158.wicp.vip/' })

const nitifyErr = err => {
  Notification({
    title: '请求失败',
    message: err,
    type: 'error'
  })
}

http.interceptors.request.use(
  req => {
    Object.assign(req.headers, {
      authorization: AuthToken.get()
    })
    return req
  },
  err => {
    throw err
  }
)

http.interceptors.response.use(
  res => {
    if (res.headers['content-type'].includes('application/vnd.ms-excel')) {
      return res.data
    }
    if (res.data.success || res.data.connectionString) return res.data
    else {
      nitifyErr(res.data.msg)
      throw res.data.success
    }
  },
  err => {
    if (err.response.status === 401) {
      AuthToken.clean()
      location.href = '/login'
    } else {
      nitifyErr(err.response.data.message)
    }
    throw err
  }
)

export const login = body => http.post(`/user/in/gxly/user/v3.0/login`, body)

export const modifyPassword = data =>
  http.put(`/user/in/gxly/user/v3.0/user/password`, data)

// 用户管理
export const getUsers = params =>
  http.get(`/user/in/gxly/user/v3.0/user/info?${toQueryStr(params)}`)

export const getUserDevice = params =>
  http.get(`device/in/gxly/device/v3.0/user/device/info?${toQueryStr(params)}`)

export const addUser = data => http.post(`/user/in/gxly/user/v3.0/save`, data)

export const updateUser = data =>
  http.put(`/user/in/gxly/user/v3.0/user/update`, data)

export const deleteUser = data =>
  http.delete(`/user/in/gxly/user/v3.0/user/${data.id}`)

// 场站管理
export const getStations = params =>
  http.get(`/device/in/gxly/device/v3.0/group/info?${toQueryStr(params)}`)

export const addStations = data =>
  http.post(`/device/in/gxly/device/v3.0/group/save`, data)

export const updateStations = data =>
  http.put(`/device/in/gxly/device/v3.0/group/update`, data)

export const deleteStations = data =>
  http.delete(`/device/in/gxly/device/v3.0/group/${data.id}`)

// 设备管理
export const getDevice = params =>
  http.get(`/device/in/gxly/device/v3.0/device/info?${toQueryStr(params)}`)

export const getStationsName = id =>
  http.get(`/device/in/gxly/device/v3.0/group/imei?userId=${id}`)

export const addDevice = data =>
  http.post(`/device/in/gxly/device/v3.0/device/save`, data)

export const updateDevice = data =>
  http.put(`/device/in/gxly/device/v3.0/device/update`, data)

export const deleteDevice = data =>
  http.delete(`/device/in/gxly/device/v3.0/device/${data.id}`)

// 交费管理
export const getPay = params =>
  http.get(`/deposit/in/gxly/deposit/v3.0/deposit/info?${toQueryStr(params)}`)

export const getPayMoney = params =>
  http.get(`/deposit/in/gxly/deposit/v3.0/deposit/money?${toQueryStr(params)}`)

export const updatePay = data =>
  http.put(`/deposit/in/gxly/deposit/v3.0/deposit/reserve`, data)

// 押金查询
export const getDeposit = params =>
  http.get(`/order/in/gxly/order/v3.0/pay/info?${toQueryStr(params)}`)

export const getDepositMoney = params =>
  http.get(`/order/in/gxly/order/v3.0/order/money?${toQueryStr(params)}`)

export const updateDeposit = data =>
  http.put(`/order/in/gxly/order/v3.0/order/reserve`, data)

// 使用管理
export const getUse = params =>
  http.get(`/device/in/gxly/device/v3.0/used/info?${toQueryStr(params)}`)

export const addUse = data =>
  http.post(`/device/in/gxly/device/v3.0/lock/save`, data)

export const stopTime = data =>
  http.put(`device/in/gxly/device/v3.0/lock/stop/${data.phone}`)

export const updateUse = data =>
  http.put(`/device/in/gxly/device/v3.0/order/reserve`, data)

export const deleteUse = data =>
  http.delete(`/device/in/gxly/device/v3.0/lock/${data.id}`)

//历史管理
export const getHistory = params =>
  http.get(`/order/in/gxly/order/v3.0/used/history/info?${toQueryStr(params)}`)

// 设备概况
export const getStationsDevice = id =>
  http.get(`/device/in/gxly/device/v3.0/group/${id}`)
// 设备远程开锁/重新识别/重启
export const openLock = data =>
  http.put(`device/in/gxly/device/v3.0/openLock`, data)
