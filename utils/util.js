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
const formatDate = date => {
  if (typeof date != 'object') {
    const dateStr = date.split('-')
    date = {
      year: parseInt(dateStr[0]),
      month: parseInt(dateStr[1]),
      day: parseInt(dateStr[2])
    }
  }
  return date
}


const judgeDate = ({start, end}) => {
  start = formatDate(start)
  end = formatDate(end)
  if (start.year > end.year) return false
  if (start.month > end.month) return false
  if (start.day > end.day) return false
  return true
};

function handleDate() {
  let date = new Date()
  date = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
  if (typeof date.month == 'number' && date.month < 10) {
    date.month = `0${date.month}`
  }
  if (typeof date.day == 'number' && date.day < 10) {
    (date.day = `0${date.day}`)
  }
  let dateStr = `${date.year}-${date.month}-${date.day}`
  return [dateStr, dateStr]
}

module.exports = {
  formatTime,
  formatDate,
  judgeDate,
  handleDate
}
