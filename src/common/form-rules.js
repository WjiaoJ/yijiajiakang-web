const handleCb = (cb, err) => {
  err ? cb(new Error(err)) : cb()
}

export const required = () => ({
  required: true,
  message: '请输入',
  trigger: ['change', 'blur']
})

export const lengthRange = (min, max) => ({
  min,
  max,
  message: `长度在 ${min} 到 ${max} 个字符`,
  trigger: ['change', 'blur']
})

export const greaterThan = num => ({
  validator: (rule, value, callback) => {
    let err
    if (value !== '' && value !== null && value <= num) {
      err = `数字必须大于${num}`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const greaterOrEqualThan = num => ({
  validator: (rule, value, callback) => {
    let err
    if (value !== '' && value !== null && value < num) {
      err = `数字不能小于${num}`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const lessOrEqualThan = num => ({
  validator: (rule, value, callback) => {
    let err
    if (value !== '' && value !== null && value > num) {
      err = `数字不能大于${num}`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const rulesNormalCeiling = e => ({
  validator: (rule, value, callback) => {
    let err
    if (!e) {
      err = `必须先输入小于值`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const maxDecimalCount = count => ({
  validator: (rule, value, callback) => {
    let err
    const [, decimal] = value.toString().split('.') //3.141592654
    if (decimal && decimal.length > count) {
      err = `精度最大为小数点后${count}位`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const validId = () => ({
  validator: (rule, value, callback) => {
    let err
    const reg = /^[A-Za-z0-9_\-]+$/
    if (value !== '' && value !== null && !reg.test(value)) {
      err = `只能包含字母、数字、横杠和下划线`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const emailFormat = () => ({
  validator: (rule, value, callback) => {
    let err
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (value !== '' && value !== null && !reg.test(value)) {
      err = `请输入正确的邮箱格式XXX@XX.XX`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})

export const longitudeFormat = () => ({
  validator: (rule, value, callback) => {
    let err
    const reg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
    if (value !== '' && value !== null && !reg.test(value)) {
      err = `请输入正确经度`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})
export const latitudeFormat = () => ({
  validator: (rule, value, callback) => {
    let err
    const reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
    if (value !== '' && value !== null && !reg.test(value)) {
      err = `请输入正确的纬度`
    }
    handleCb(callback, err)
  },
  trigger: ['change', 'blur']
})
