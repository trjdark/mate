/**
 * desc: 工具
 * Date: 2018/8/15
 * Time: 上午10:04
 */
import {Base64Util} from "./crypto";
import moment from 'moment';
import Big from 'big.js';

class CommonUtils {
    /**
     * 路由参数加密
     * @param {object} params
     * @returns {string}
     */
    static stringify(params: object) {
        return Base64Util.stringify(JSON.stringify(params));
    }

    /**
     * 是否有路由参数
     * @param props
     * @returns {any}
     */
    static hasParams(props: any) {
        return props.match && props.match.params && props.match.params.params;
    }

    /**
     * 路由参数解密
     * @param props
     * @returns {any}
     */
    static parse(props: any) {
        const params = Base64Util.parse(props.match.params.params);
        return JSON.parse(params);
    }

    /**
     * 过滤请求参数
     * @param {object} params
     * @returns {{}}
     */
    static filterParams(params: object) {
        let filterObj = {};
        for (let key in params) {
            const val = params[key];
            const DateKeys = [
                'signTime', 'delayTo', 'approvalStartDate', 'approvalEndDate',
                'birthday', 'beginDate', 'endDate', 'entryDate', 'leaveDate',
                'expectFinancialTime','inquireDate', 'approvalEndTime', 'approvalStartTime'
            ];
            if (DateKeys.includes(key)) {
                val ? filterObj[key] = moment(val).valueOf() : filterObj[key] = null;
                continue;
            }

            if (val || val === 0 || val === false || val === '') {
                if (typeof val === 'object' && !(val instanceof Array)) {
                    filterObj[key] = CommonUtils.filterParams(val);
                } else if (typeof val === 'string') {
                    // @todo 空字符串设置null
                    filterObj[key] = val.trim();
                } else {
                    filterObj[key] = val;
                }
            }
        }
        return filterObj;
    }

    /**
     * 替换数组某个元素
     * @param {Array<any>} arr
     * @param {number} index
     * @param object
     * @returns {(any)[]}
     * @constructor
     */
    static EditArrayElementByIndex(arr: Array<any>, index: number, object: any) {
        return [
            ...arr.slice(0, index),
            object,
            ...arr.slice(index + 1)
        ]
    }

    /**
     * 数组删除某个元素
     * @param {Array<any>} arr
     * @param {number} index
     * @returns {(any)[]}
     * @constructor
     */
    static DelectArrayElementByIndex(arr: Array<any>, index: number) {
        return [
            ...arr.slice(0, index),
            ...arr.slice(index + 1)
        ]
    }

    /**
     * 深度遍历对象，为定义的值为null
     * @param {object} obj
     * @returns {any}
     * @constructor
     */
    static TraversalObject(obj: object) {
        let newObj = {};
        for (let key in obj) {
            const val = obj[key];
            if (val && typeof val === "object") {
                if (val instanceof Array) {//数组直接转换为字符串
                    newObj[key] = JSON.stringify(val);
                } else {
                    CommonUtils.TraversalObject(val); //递归遍历
                }
            } else {
                if (!val) {
                    newObj[key] = null;
                } else {
                    newObj[key] = val;
                }
            }
        }
        return newObj;
    }
    static PlainObj(obj){
        const newObj={};
        const traversal=(obj)=>{
            for (let key in obj) {
                const val = obj[key];
                if(!(typeof val==='undefined' || val===null)){//值为非空(排除0)
                    if (typeof val === "object") {
                        if (val instanceof Array && val.length) {//数组直接转换为字符串
                            newObj[key] = JSON.stringify(val);
                        } else {
                            traversal(val); //递归遍历
                        }
                    }else{
                        newObj[key]=val;
                    }
                }
            }
        };
        traversal(obj);
        return newObj;
    }


    /**
     * 时间戳转时间-format:年-月-日
     * @param {date} date
     * @returns {any}
     */

    static transferDate(date: Date) {
        let formDate = new Date(date);
        let y = formDate.getFullYear(), m = formDate.getMonth() + 1, d = formDate.getDate();
        let mm = m < 10 ? "0" + m : m;
        let dd = d < 10 ? "0" + d : d;
        return `${y}-${mm}-${dd}`;

    }

    /**
     * 判断数组是否包含有一个或多个元素
     * @param {Array<string>} parentArray
     * @param {any} child
     * @returns {any}
     */

    static isInclude(parentArray, child) {
        if (typeof child != "object" && parentArray instanceof Array) {//单个字符
            return parentArray.includes(child)
        } else if (child instanceof Array) {//判断是否包含数组
            for (let i = 0; i < child.length; i++) {
                if (CommonUtils.isInclude(parentArray, child[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 将权限树不完全选择选项加上
     * @param {Array<string>} funsArr
     * @returns {Array<string>}
     */

    static fullfillPermission(funsArr) {
        let treeNode = funsArr;
        funsArr.map((func) => {
            const zero = func.substring(4, 6);
            const first = func.substring(6, 8);
            const second = func.substring(8, 10);
            const third = func.substring(10);
            if (third !== '00') {//三级菜单
                const secondNode = `FUNC${zero}${first}${second}00`;
                const firstNode = `FUNC${zero}${first}0000`;
                const zeroNode = `FUNC${zero}000000`;
                treeNode = treeNode.concat([firstNode, secondNode, zeroNode]);
            } else {
                if (second !== '00') {//二级菜单
                    const firstNode = `FUNC${zero}${first}0000`;
                    const zeroNode = `FUNC${zero}000000`;
                    treeNode = treeNode.concat([firstNode, zeroNode]);
                } else {
                    if (first !== '00') {//一级菜单
                        const zeroNode = `FUNC${zero}000000`;
                        treeNode = treeNode.concat([zeroNode]);
                    }
                }
            }
        });
        const setArr = new Set(treeNode);
        return [...setArr];
    }

    /**
     * 打印页面内容
     * @param {html<string>} printHtml
     * @returns undefined
     */
    static printPage(printHtml, container) {
        const href = window.location.href;
        const iframe = window.document.createElement('iframe');
        iframe.src = href;
        iframe.style.display = 'none';
        if(container){
            container.appendChild(iframe);
        }else {
            window.document.body.appendChild(iframe);
        }
        iframe.contentWindow.onload = function () {
            iframe.contentDocument.body.innerHTML = printHtml;
            iframe.contentWindow.print();
        }
    }

    /**
     * 数字格式化
     * @param {number} num
     */
    static toThousands(num:number){
        let _num = (num || 0).toFixed(2).toString();
        let integter = _num.slice(0,_num.indexOf('.'));
        let float = _num.slice(_num.indexOf('.')+1);
        let result = '';
        while (integter[0] === '-' ? integter.length > 4 : integter.length > 3) {
            result = ',' + integter.slice(-3) + result;
            integter = integter.slice(0, integter.length - 3);
        }
        if (integter) {
            result = `${integter + result}.${float}`;
        }
        return result;
    };

    /**
     * 千分位逗号隔离（不带小数，四舍五入）
     * @param {number} num
     */
    static formatThousand(num:number){
        if(!num){return 0;}
        if(isNaN(Number(num))){return num}
        let newValue = Math.round(Number(num)).toString();
        const pattern = /\B(?=(\d{3})+(?!\d))/g;
        if(pattern.test(newValue)){
            return newValue.toString().replace(pattern, ',');
        }
        return newValue;
    }
    /**
     * 生成一个随机数
     */
    static S4(){
        return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1);
    }
    static generateGuid (){
        const sign = `${this.S4()}${this.S4()}-${this.S4()}${this.S4()}-${this.S4()}${this.S4()}-${this.S4()}${this.S4()}-${this.S4()}${this.S4()}`;
        return sign
    }
    /**
     * 文字益处处理
     * @param {string} str
     * @param {number} len
     * @returns {string}
     */
    static cutstr(str:string, len:number){
        if(!str){
            return '';
        }
        let _str = str, _len = len, strLen =  _str.length, strCut = '', strLength = 0, a;
        for( let i:number = 0; i < strLen; i++){
            strLength++;
            a = _str.charAt(i);
            escape(a).length > 4 && strLength++; // 中文字符编码大于4
            strCut = strCut.concat(a);
            if(strLength >= _len) {
                strCut = strCut.concat("...");
                return strCut;
            }
        }
        return strCut;
    }
    /**
     * 重写 window.open
     * @param {string} url
     */
    static newWin(url:string, id:string){
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('target','_blank');
        a.setAttribute('id', id);
        // 防止反复添加
        if(!document.getElementById(id)) {
            document.body.appendChild(a);
        }
        a.click();
    }
    /**
     * 重写 window.open 当前页
     * @param {string} url
     */
    static newWinSelf(url:string, id:string){
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('id', id);
        // 防止反复添加
        if(!document.getElementById(id)) {
            document.body.appendChild(a);
        }
        a.click();
    }
    /**
     * 获取元素绝对定位
     * @param {HTMLElement} element
     * @returns {number}
     */
    static getElementTop = (element:HTMLElement) => {
        let actualLeft:number = element.offsetLeft;
        let current:any = element.offsetParent;

        while (current !== null){
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    }
    /**
     * 手机号脱敏
     * @param {string} str
     * @returns {string}
     */
    static desMobile(str:string){
        const pat = /(\d{3})\d*(\d{4})/
        const b = str.replace(pat,'$1****$2');
        return b;
    }
    /**
     * 两个元素是否含有相同
     * @param arr1
     * @param arr2
     * @returns {boolean}
     */
    static hasEqualElement(arr1, arr2) {
        if (arr1 instanceof Array && arr2 instanceof Array) {
            for (let i = 0, l = arr1.length; i < l; i++) {
                if (arr2.includes(arr1[i])) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    }
    /**
     * url search string to obj
     * @param {String<any>} str
     * @returns {Object}
     * @constructor
     */
    static urlSearchStringToObj (str) {
        let searchArr = str.substring(1).split('&')
        let obj = {};
        searchArr.forEach(str => {
            obj[str.split('=')[0]] = str.split('=')[1]
        })
        return obj
    }

    /**
     * 获取系统型号，浏览器版本，
     * @returns {{browser: string; system: string; version: string}}
     */
    static getBrowserInfo () {
        const agent = navigator.userAgent.toLowerCase();
        let browser = 'unknown', system = 'unknown', version = '';
        if(agent.indexOf('mise') > 0) {
            browser = 'IE'
        }else if(agent.indexOf('firefox') > 0){
            browser = 'firefox'
        }else if(agent.indexOf('chrome') > 0){
            browser = 'chrome'
        }else if((agent.indexOf('safari') > 0) &&  (agent.indexOf('chrome') < 0)  ){
            browser = 'safari'
        }else if(agent.indexOf("edge") > 0) {
            browser = 'edge'
        }else if(agent.indexOf("opera") > 0) {
            browser = 'opera'
        }

        if (agent.indexOf('win') > -1) {
            system = 'windows'
            if (agent.indexOf('windows nt 5.0') > -1) {
                version = 'Windows 2000';
            } else if (agent.indexOf('windows nt 5.1') > -1 || agent.indexOf('windows nt 5.2') > -1) {
                version = 'Windows XP';
            } else if (agent.indexOf('windows nt 6.0') > -1) {
                version = 'Windows Vista';
            } else if (agent.indexOf('windows nt 6.1') > -1 || agent.indexOf('windows 7') > -1) {
                version = 'Windows 7';
            } else if (agent.indexOf('windows nt 6.2') > -1 || agent.indexOf('windows 8') > -1) {
                version = 'Windows 8';
            } else if (agent.indexOf('windows nt 6.3') > -1) {
                version = 'Windows 8.1';
            } else if (agent.indexOf('windows nt 6.2') > -1 || agent.indexOf('windows nt 10.0') > -1) {
                version = 'Windows 10';
            }else {
                version = 'unknown';
            }
        }else if (agent.indexOf('iphone') > -1) {
            system = 'iPhone';
        } else if (agent.indexOf('mac') > -1) {
            system = 'Mac';
        } else if (agent.indexOf('x11') > -1 || agent.indexOf('unix') > -1 || agent.indexOf('sunname') > -1 || agent.indexOf('bsd') > -1) {
            system = 'Unix';
        } else if (agent.indexOf('linux') > -1) {
            if (agent.indexOf('android') > -1) {
                system = 'Android';
            }else {
                system = 'Linux';
            }
        }
        return {browser, system, version}
    };

    /**
     * 判断非空
     * @param inObj
     */
    static myFalse (inObj):boolean {
        if(inObj === undefined || inObj === null){
            return true;
        }else{
            return false;
        }
    }
}

class SafeCalculate {

    static getDecimalsLen(obj) {
        let decimalsLen = 0;
        for (let value of obj) {
            const decimalsPart = (value || 0).toString().split('.')[1];
            if (decimalsPart && decimalsPart.length > decimalsLen) {
                decimalsLen = decimalsPart.length;
            }
        }
        return decimalsLen;
    }
    /**
     * 两个浮点数求和
     * @param {string | number}
     * @returns {number}
     */
    static add(...rest) {
        let sum = 0;
        const decimalsLen = SafeCalculate.getDecimalsLen(rest);
        const pow = Math.pow(10, decimalsLen);
        for (let value of rest) {
            sum += (Number(value) * pow);
        }
        return sum / pow;
    }

    /**
     * 新浮点相加
     */
    static newPlus(...rest) {
        let sum = new Big(0);
        for (let value of rest){
            if(isNaN(value) || !value){
                value = 0;
            }
            sum = sum.plus(new Big(value));
        }
        return sum.toNumber()
    }
    /**
     * 新浮点相减法
     */
    static newMinus(...rest) {
        if(isNaN(rest[0])){
            return 0;
        }
        let sum = new Big(rest[0]);
        for (let value of rest.slice(1)){
            if(isNaN(value) || !value){
                value = 0;
            }
            sum = sum.minus(new Big(value));
        }
        return sum.toNumber()
    }

    // 两个浮点数相减
    static sub(...rest) {
        let sub = rest[0];
        const decimalsLen = SafeCalculate.getDecimalsLen(rest);
        const pow = Math.pow(10, decimalsLen);
        sub *= pow;
        for (let value of rest.slice(1)) {
            sub -= (value * pow);
        }
        return sub / pow;
    }

    // 两数相除
    static divide(...rest) {
        let divNum = rest[0];
        const decimalsLen = SafeCalculate.getDecimalsLen(rest);
        const pow = Math.pow(10, decimalsLen);
        divNum *= pow;
        for (let value of rest.slice(1)) {
            divNum /= (value * pow);
        }
        return divNum;
    }

    static mul(...rest) {
        let decimalsLen = 0, mul = 1;
        for (let value of rest) {
            const decimalsPart = (value || 0).toString().split('.')[1];
            if (decimalsPart) {
                decimalsLen += decimalsPart.length;
            }
        }
        for (let value of rest) {
            mul *= (value || 0).toString().replace(".", "")
        }
        return mul / Math.pow(10, decimalsLen)
    }

    /**
     * 自动补零
     * @param {number} num
     * @returns {any}
     */
    static autoZero(num:number){
        if(typeof num !== 'number' && !num){
            return ''
        }else{
            return num.toFixed(2)
        }
    }
}

export {CommonUtils, SafeCalculate}
