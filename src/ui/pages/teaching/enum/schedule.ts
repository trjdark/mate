import _ from "lodash";

/**
 * Desc: 教学常量
 * User: Debby.Deng
 * Date: 2018/11/29,
 * Time: 下午8:02
 */

let timeLine = [];
for (let i = 7; i < 22; i++) {
    if (i < 10) {
        timeLine.push(`0${i}:00`)
    } else {
        timeLine.push(`${i}:00`)
    }
}
export default timeLine;
export const weekSquareWidth = 80;  // 固定排课表格宽度
export const scheduleWeekDay = [
    {name: '星期一', value: 1},
    {name: '星期二', value: 2},
    {name: '星期三', value: 3},
    {name: '星期四', value: 4},
    {name: '星期五', value: 5},
    {name: '星期六', value: 6},
    {name: '星期日', value: 7},
];

export const leaveType = [
    {name: '事假', value: '29001'},
    {name: '病假', value: '29002'},
];
export const signInStatus = [
    {name: '未上', value: '25001'},
    {name: '已上', value: '25002'},
    {name: '请假', value: '25003'},
    {name: '旷课', value: '25004'},
];

export const bookWay = [
    {name: 'R', value: '26001'},
    {name: 'M', value: '26002'},
    {name: 'P', value: '26003'},
];
export const bookWayValue = _.keyBy(bookWay, (item) => {
    return item.value
});
export const bookWayName = _.keyBy(bookWay, (item) => {
    return item.name
});
