/**
 * Desc: 公用方法
 * User: Lyon
 */

/*把数字表示定星期转换成汉字*/
export function transWeekday(int) {
    const weekDay = ['一', '二', '三', '四', '五', '六', '日'];
    return weekDay[int - 1];
}
