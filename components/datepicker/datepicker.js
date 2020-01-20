// components/datepicker/datepicker.js
import { getSelectedDay } from '../calendar/main.js'

let date = handleDate() + ' ~ ' + handleDate()
function handleDate ({...date}) {
  if (!date.year) {
    var date = new Date()
    date = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }
  if (typeof date.month == 'number' && date.month < 10) {
    date.month = `0${date.month}`
  }
  if (typeof date.day == 'number' && date.day < 10) {
    (date.day = `0${date.day}`)
  }
  return `${date.year}-${date.month}-${date.day}`
}

Component({
  /* Properties */
  properties: {

  },
  /* Init data */
  data: {
    chooseDate: date,
    hide: true,
    calendarConfig: {
      theme: 'default', // 设置主题
      defaultDay: true, // 默认选中当天
      chooseAreaMode: true, // 开启范围选择
      highlightToday: true, // 高亮显示当天
      disableLaterDay: true // 禁选当天之后的日期
    }
  },
  /* Function List */
  methods: {
    toggleCalendar: function (e) {
      let {hide} = this.data
      this.setData({
        hide: !hide
      })
      if (!hide) {
        const dates = getSelectedDay()
        if (getSelectedDay().length > 0) {
          let begin = handleDate(dates[0]),
            end = handleDate(dates[dates.length - 1])
          date = begin + ' ~ ' + end
        }
        this.setData({
          chooseDate: date
        })
        this.triggerEvent('datefresh', {date: date})
      }
    }
  }
})
