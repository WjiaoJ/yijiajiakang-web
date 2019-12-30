import queryString from 'query-string'

export const delay = ms => new Promise(res => setTimeout(res, ms))

export const AuthToken = {
  get() {
    return localStorage.appAuthToken
  },
  set(value) {
    localStorage.appAuthToken = value
  },
  clean() {
    AuthToken.set('')
  },
  exist() {
    return !!AuthToken.get()
  }
}

export const toQueryStr = queryString.stringify

export const downloadString = (strContent, fileName) => {
  var blob = new Blob([strContent])
  downloadBlob(blob, fileName)
}

export const downloadBlob = (blob, fileName) => {
  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  window.setTimeout(function() {
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  }, 0)
}
