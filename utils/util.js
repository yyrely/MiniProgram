const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const judgeDate = ({start, end}) => {
  (typeof start !== 'string') && (start = handleDate(start))
  (typeof end !== 'string') && (end = handleDate(end))
  start = new Date(start.replace(/-/g, '/'))
  end = new Date(end.replace(/-/g, '/'))
  if (start > end) return false
  return true
};

function handleDate ({...date} = {}) {
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

module.exports = {
  formatTime,
  judgeDate,
  handleDate
}
