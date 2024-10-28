/**
 *格式化事件
 time可以是时间戳单位ms，也可以是new Date对象
 formatStr: YYYY-mm-dd HH:ii ss
 星期:W
 * @example
 * format(123432434234,'YYYY年mm月dd日 HH:ii');
 * format(new Date(1234324234),'YYYY年mm月dd日 HH:ii')
 * @param {any} time
 * @param {string} formatStr
 * @returns {string} time
 *
 */
export default function format(time, formatStr) {
  const date = new Date(Number(time));
  //格式化时间
  const arrWeek = ['日', '一', '二', '三', '四', '五', '六'];
  let str = formatStr
    .replace(/yyyy|YYYY/, date.getFullYear())
    .replace(/yy|YY/, addZero(date.getFullYear() % 100, 2))
    .replace(/mm|MM/, addZero(date.getMonth() + 1))
    .replace(/m|M/g, date.getMonth() + 1)
    .replace(/dd|DD/, addZero(date.getDate()))
    .replace(/d|D/g, date.getDate())
    .replace(/hh|HH/, addZero(date.getHours()))
    .replace(/h|H/g, date.getHours())
    .replace(/ii|II/, addZero(date.getMinutes()))
    .replace(/i|I/g, date.getMinutes())
    .replace(/ss|SS/, addZero(date.getSeconds()))
    .replace(/s|S/g, date.getSeconds())
    .replace(/w/g, date.getDay())
    .replace(/W/g, arrWeek[date.getDay()]);
  return str;
}

function addZero(time) {
  time = String(time);
  return (`0${time}`).substr(-2);
}