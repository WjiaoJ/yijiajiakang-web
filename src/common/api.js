import axios from 'axios'
import { Notification } from 'element-ui'
import { AuthToken, toQueryStr } from './utils'

const http = axios.create({ baseURL: 'http://a283d30696.qicp.vip/api/' })



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
      nitifyErr(res.data.message)
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

export const login = body =>
  http.post(`auth/login`, body)

export const modifyPassword = (id, pass) => http.put(`common/${id}`, pass)

// 用户管理
export const getUsers = params => http.get(`user/list?${toQueryStr(params)}`)

export const addUser = data => http.post(`user/register`, data)

export const updateUser = data => http.put(`user/update`, data)

export const deleteUser = data => http.delete(`user/delete/${data.id}`)

// 设备管理
export const getDevice = params => http.get(`device/?${toQueryStr(params)}`)

export const addDevice = data => http.post(`device/`, data)

export const updateDevice = data => http.put(`device/${data.id}`, data)

export const deleteDevice = data => http.delete(`device/${data.id}`)


// 导出
export const getReportFormsExport = params =>
  http.get(`reportForms/export?${toQueryStr(params)}`, { responseType: 'blob' })



// 报警

export const getPollingMonitor = () => http.get(`notify/pollingMonitor`)

