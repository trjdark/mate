/**
 * Desc: 对后台数据进行处理，添加style样式
 * User: Debby.Deng
 * Date: 2018/12/25,
 * Time: 上午10:36
 */
import moment from "moment";

interface ParamsSet {
    table?: any,                    // table DOM元素
    originalTop?: number,           // table thead高度
    display?: 'inline' | 'bigSize', // inline表示固定宽高，bigSize表示按照屏幕宽度计算-临时排课
    xAxisArr: Array<any>,           // x轴数组
    width?: number,                 // 绘画元素的宽度
    height: number,                 // 绘画元素的高度
    defaultSquareColor?: string,    // 绘画元素的默认颜色(单一颜色)
    [propsName: string]: any,
}

export class ColorTableStyle { // 对后台数据进行处理，加上style属性
    options: any;

    constructor(params: ParamsSet) {
        const options = Object.assign({}, params, {
            courseColor: {
                'play': '#EF7421',
                'music': '#009CBD',
                'art': '#40C1AC',
                'gk': '#FFA0BC ',
                'default': params.defaultSquareColor
            },
            computeWidth: null,
        });
        const {table, xAxisArr, display, width} = options;
        if (display === 'bigSize' && table) {
            const title = document.querySelectorAll('.gym-teaching-slide-title')[0];
            table.style.width = width * (xAxisArr.length) + 'px';
            if (title.clientWidth >= width * (xAxisArr.length)) {
                title.style.width = width * (xAxisArr.length) + 'px';
            }
        }
        this.options = options;

    }

    getColor(text) {
        const {courseColor} = this.options;
        if (!text) {
            return courseColor.default;
        }
        const type = text.substring(0, 1);
        let content = null;
        switch (type.toUpperCase()) {
            case 'L': {
                content = courseColor.play;
                break;
            }
            case 'A': {
                content = courseColor.art;
                break;
            }
            case 'M': {
                content = courseColor.music;
                break;
            }
            case 'G': {
                content = courseColor.gk;
                break;
            }
            default : {
                content = courseColor.default;
            }
        }
        return content;
    }

    getXposition(xInfo) {
        let xPos = null;
        const {width, xAxisArr} = this.options;
        xAxisArr.map((item, index) => {
            if (xInfo === item) {
                xPos = index * (width);
            }
        });
        return xPos && (xPos.toFixed(2) + "px");
    }

    getYpositionAndHeight(startTime, endTime) {
        const {height, originalTop} = this.options;
        const squreHeightPerPcs = (height / 12);// 格子高度50px, 5分钟一个间隔，分成12等分；
        const top = Math.abs(moment(startTime, 'HH-mm').diff(moment('7:00', 'HH-mm')) / 1000 / 60) / 5;
        const colorPcs = Math.abs(moment(endTime, 'HH-mm').diff(moment(startTime, 'HH-mm')) / 1000 / 60) / 5;
        return {
            top: (squreHeightPerPcs * top + originalTop).toFixed(2) + 'px',
            height: (squreHeightPerPcs * colorPcs).toFixed(2) + 'px',
        };
    }

    setStyle(dayCourseList) {
        const {width, defaultSquareColor, display} = this.options;
        if (!(dayCourseList instanceof Array) || !dayCourseList.length) {
            return dayCourseList
        }
        return dayCourseList.map((item) => {
            item.style = {
                position: 'absolute',
                width: width + 'px',
                left: this.getXposition(item.classroomId),
                top: this.getYpositionAndHeight(item.startTime, item.endTime).top,
                height: this.getYpositionAndHeight(item.startTime, item.endTime).height,
                background: display === 'bigSize' ? defaultSquareColor : this.getColor(item.courseCode),
                color: display === 'bigSize' ? '#333' : '#fff',
                fontSize: '10px',
            }
        });
    }
}
