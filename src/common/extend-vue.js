import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('dateformat', (date, format) => {
  if (!date) return '-'
  return dayjs(date).format(format)
})
