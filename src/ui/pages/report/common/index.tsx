/**
 * desc: 存放多个页面共同用到的静态方法
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/10
 * Time: 上午10:38
 */

import React, {ReactNode} from "react";
import {cloneDeep} from 'lodash';
import {message} from "antd";
import {Tooltip} from '@/ui/component/toolTip';
import {Icon} from "@/ui/component/icon";
import {User} from "@/common/beans/user";
import {getGaInAndOutJobSList, getGbInAndOutJobSList, getExecutorInAndOutJobSList} from "@redux-actions/report/serviceReport";

// 日期格式化
export const formatter = 'YYYY-MM-DD';

// 表格宽度
export const tdWidth = 160;

/**
 * 计算表头，根据选中的数据项来动态显示表头
 * @params selectedList 选中的数据项
 * @params list 数据项
 */
export const countTableHead = (selectedList, dataList) => {
    return (selectedList).map(item => {
        for (let val of dataList) {
            const {value, label, remark} = val;
            if (item === value) {
                return {
                    title: () => {
                        return remark
                            ? (
                                <div className="gym-report-result-remark">
                                    <Tooltip
                                        title={remark}
                                        mouseEnterDelay={0}
                                        mouseLeaveDelay={0}
                                    >
                                        {label}
                                        <Icon className="gym-report-result-remark-icon" type="beizhu"/>
                                    </Tooltip>
                                </div>
                            )
                            : label
                    },
                    dataIndex: value,
                }
            }
        }
    });
};

/**
 * 计算城市，中心，月份等合并单元格的范围
 * @param dataSource Array<any> 表格的数据列表
 */
export const countRowRange = (dataSource: Array<any>) => {
    let city = '';          // 城市名字
    let center = '';        // 中心名字
    let timeTypeName = '';  // 时间数据类型
    let channelTypeName = ''; // 渠道来源
    let cityRange = [];     // 相同名字的城市范围
    let centerRange = [];   // 相同中心的范围
    let typeRange = [];     // 相同时间数据类型的范围
    let channelTypeRange = [];  // 渠道来源类型范围
    (dataSource || []).forEach((item, index, arr) => {
        const {cityId, centerId, typeName} = item;
        const channelName = item.channelName || item.channelTypeName;   // 从后台返回的渠道名称有两种字段名，按同一变量处理

        // 当城市发生变化时，记录下当前的index，并且替换掉城市名
        if (city !== cityId) {
            cityRange.push(index);
            city = cityId;
        }

        // 如果城市一直没有变化，而且已经循环到最后一项，把最后一项的索引记录下
        if (city === cityId && index === arr.length - 1) {
            cityRange.push(arr.length - 1);
        }

        // 当中心发生变化时，记录下当前的index，并且替换掉中心名
        if (center !== centerId) {
            centerRange.push(index);
            center = centerId;
        }

        // 如果中心一直没有变化，而且已经循环到最后一项，把最后一项的索引记录下
        if (center === centerId && index === arr.length - 1) {
            centerRange.push(arr.length - 1);
        }

        // 当时间数据名称发生变化时，记录下当前的index，并且替换掉事件数据名称
        if (typeName !== timeTypeName) {
            typeRange.push(index);
            timeTypeName = typeName;
        }
        // 如果事件数据一直没有变化，而且已经循环到最后一项，把最后一项的索引记录下
        if (typeName === timeTypeName && index === arr.length - 1) {
            typeRange.push(arr.length - 1);
        }

        // 当渠道名称发生变化时，记录下当前的index，并且替换掉渠道名称
        if (channelName !== channelTypeName) {
            channelTypeRange.push(index);
            channelTypeName = channelName;
        }

        // 如果渠道名称一直没有变化，而且已经循环到最后一项，把最后一项的索引记录下
        if (channelName === channelTypeName && index === arr.length - 1) {
            channelTypeRange.push(arr.length - 1);
        }
    });

    return {
        cityRange,
        centerRange,
        typeRange,
        channelTypeRange,
    };
};

/**
 * 计算跨行的单元格，从这个发生变化的位置合并单元格
 * 合并的数量等于列表中下一个值与当前值之差
 * 列表中最后一个值是dataSource的索引，前一个值到这里
 * 没有发生变化，合并的数量等于两个值之差再加上1
 * @param range Array<number> 用来标记合并位置的列表
 * @param text string 合并单元格后显示的文本
 * @param index number 表格的当前行号
 */
interface TdContent {
    children: string | ReactNode,

    [propName: string]: any
}

/* 合并单元格 */
export const countRowSpan = (range: Array<number>, text: string, index: number) => {
    const obj: TdContent = {
        children: text,
        props: {rowSpan: 0},
    };
    const length = range.length;
    for (let i = 0; i < length; i++) {
        if (range[i] === index) {
            if (i + 1 <= length - 2) {
                obj.props.rowSpan = range[i + 1] - range[i];
            } else if (i + 1 === length - 1) {
                obj.props.rowSpan = range[i + 1] - range[i] + 1;
            }
            break;
        }
    }

    return obj;
};

/*计算表格字段，组件的生命周期，仅用于中心业绩和市场业绩两个模块*/
export const getDerivedStateFromProps = (nextProps, prevState) => {
    const {selectedData, dataSource, dataOptionList} = nextProps;
    const condition1 = JSON.stringify(selectedData) !== JSON.stringify(prevState.selectedData);
    const condition2 = JSON.stringify(dataSource) !== JSON.stringify(prevState.dataSource);
    if (condition1 || condition2) {
        // 如果选中的数据项有变化，或者表格数据有变化或者备注字段有变化需要重新计算表格字段，滚动条等
        const length = selectedData.length;
        let newBaseColumns = prevState.baseColumns;
        if (length < 5) {
            // 选中的数据项小于5时，不需要固定列
            newBaseColumns = prevState.baseColumns.map(item => {
                let obj = cloneDeep(item);
                obj.fixed = undefined;
                obj.width = 'auto';
                return obj;
            });
        }

        // 计算表头和scrollX
        const columns = newBaseColumns.concat(countTableHead(selectedData, dataOptionList));
        // 给每个数据项添加一个宽度，防止加纵向滚动条后，表头跟内容对不齐的问题
        columns.forEach((item, index) => {
            if (index > newBaseColumns.length - 1) {
                item.width = tdWidth;
            } else {
                item.width = newBaseColumns[index].width;
            }
        });
        const scrollX = columns.reduce((prev, item) => prev + item.width, 0);

        // 计算范围
        const ranges = countRowRange(dataSource);

        return {
            columns,
            selectedData,
            scrollX: length < 5 ? 0 : scrollX,
            ...ranges
        }
    }

    return null;
};

/*判断当前页面是否可下载*/
export function couldDownLoad(data) {
    if (data.length === 0) {
        message.error('暂无数据！');
        return false;
    } else {
        return true;
    }
}

/*验证开始时间是否小于结束时间*/
export function timeIsCorrect(startDate, endDate) {
    if (startDate > endDate) {
        message.error('开始时间不能小于结束时间');
        return false;
    }

    return true;
}

/*
 * 查询用户职位
 * @return promise
 */
export function getStaffPosition() {
    // 根据返回的员工岗位，设置标识值
    let jurisdiction = '';  // 岗位标志值
    const postObj = {
        CD: false,
        GB: false,
        HGB: false,
        GA: false,
        HGA: false,
        GI: false
    };

    // 把用户职位列表转为映射，方便判断
    for (let item of User.role) {
        switch (item) {
            case 'CD':
                postObj.CD = true;
                break;
            case 'GB':
                postObj.GB = true;
                break;
            case 'HGB':
                postObj.HGB = true;
                break;
            case 'GA':
                postObj.GA = true;
                break;
            case 'HGA':
                postObj.HGA = true;
                break;
            case 'GI':
                postObj.GI = true;
                break;
            default:
        }
    }

    if (postObj.CD || postObj.GI || postObj.HGB || postObj.HGA) {
        jurisdiction = '0';
    } else if (postObj.GB) {
        jurisdiction = '1';
    } else if (postObj.GA) {
        jurisdiction = '2';
    }

    return jurisdiction;
}

/*
 * 获取GB数据，并根据用户职位进行处理
 * @params jurisdiction 用户的职位
 * @return promise
 */
export function getGbList(jurisdiction) {
    const data = {
        currentCenterId: User.currentCenterId,
    };
    const userId = User.userId;

    return getGbInAndOutJobSList(data).then(res => {
        let gbList = [];
        let initialValue = undefined;   // gb初始值
        // 设置到表单配置项
        if (jurisdiction === '0') {
            // CD和HGB可以查看所有的GB数据
            gbList = res;
        } else if(jurisdiction === '1') {
            for (let val of res) {
                if (val.postCode === userId) {
                    gbList.push(val);
                    break;
                }
            }
        }
        return Promise.resolve({gbList, initialValue});
    }).catch(err => {
        message.error('读取GB列表失败，请稍后重试！');
        return Promise.reject(err);
    });
}

/*
 * 获取GA数据，并根据用户职位进行处理
 * @params jurisdiction 用户的职位
 * @return promise
 */
export function getGaList(jurisdiction) {
    const data = {
        currentCenterId: User.currentCenterId,
    };
    const userId = User.userId;

    return getGaInAndOutJobSList(data).then(res => {
        let gaList = [];
        let initialValue = undefined;   // ga初始值
        // 设置到表单配置项
        if (jurisdiction === '0') {
            // CD和HGA可以查看所有的GA数据
            gaList = res;
        } else if(jurisdiction === '2') {
            for (let val of res) {
                if (val.postCode === userId) {
                    gaList.push(val);
                    break;
                }
            }
        }
        return Promise.resolve({gaList, initialValue});
    }).catch(err => {
        message.error('读取GA列表失败，请稍后重试！');
        return Promise.reject(err);
    });
}

/*
 * 查询中心所有员工信息
 * @params jurisdiction 用户的职位
 * @return promise
 */
export function getExecutorList(jurisdiction) {
    const data = {
        staffId: User.userId,
        currentCenterId: User.currentCenterId
    };
    return getExecutorInAndOutJobSList(data).then(res => {
        let initialValue = undefined;   // ga初始值
        let getExecutorList = res;

        return Promise.resolve({getExecutorList, initialValue});
    }).catch(err => {
        message.error('读取GA列表失败，请稍后重试！');
        return Promise.reject(err);
    });
}

/*
* 把传入的数据格式化成保留两位小数的形式
* @params text 数字或者字符串形式的数据
* @return 保留两位小数形式的字符串
*/
export function formatNum(text: number | string) {
    const num = Number(text);
    return Number.isNaN(num) ? '' : num.toFixed(2);
}

/*监听表格滚动, 分步加载表格数据，用于不分页的业绩类报表，解决大数据量下页面卡顿的问题*/
export function watchTableScroll(page) {
    // 分页加载table数据
    const handleTableData = (e) => {
        const target: any = e.target;                               // 事件对象
        const {scrollHeight, scrollTop, clientHeight} = target;     // 表格总高度，表格滚动条高度，表格可视区高度
        const {dataSource, allDataSource} = this.state;
        const len = allDataSource.length;       // 分页数据的长度，即多少页
        let list = cloneDeep(dataSource);

        // 当表格滑动到底部时，加载下一页的数据
        if ((scrollHeight - scrollTop === clientHeight) && page < len - 1) {
            if (page >= 2) {
                // 如果数据已加载三屏，把第一屏的数据删除掉，始终保持3屏，防止数据越来越多页面越来越卡
                const oldDataIdList = allDataSource[page - 2].map(item => item.id);
                list = list.filter(item => !oldDataIdList.includes(item.id));
            }
            list.push(...allDataSource[++page]);
            this.setState({
                dataSource: list,
            });
        }

        // 当表格滑动到顶部时，加载从当前页向前数3屏的数据
        if (scrollTop === 0 && page >= 3) {
            if (page <= len - 1) {
                // 删除当前屏的数据，始终保持三屏的数据
                const oldDataIdList = allDataSource[page].map(item => item.id);
                list = list.filter(item => !oldDataIdList.includes(item.id));
            }
            list.unshift(...allDataSource[page - 3]);
            page--;
            this.setState(
                {
                    dataSource: list,
                },
                () => {
                    e.target.scrollTop = clientHeight;
                }
            );
        }
    };

    const tbody = window.document.querySelector('.ant-table-body');

    // @ts-ignore
    tbody.onscroll = function (e) {
        handleTableData(e);
    };
}

export const formatterMoney = (value: number | string) => {
    const _value = typeof value !== 'string' ? value.toString() : value;
    let _num = (Number.parseFloat(_value) || 0).toFixed(2).toString();
    let integter = _num.slice(0,_num.indexOf('.'));
    let float = _num.slice(_num.indexOf('.') + 1);
    let result = '';
    while (integter.length > 3) {
        result = ',' + integter.slice(-3) + result;
        integter = integter.slice(0, integter.length - 3);
    }
    if (integter) {
        result = `${integter + result}.${float}`;
    }
    return result;
};

/*如果文字过长则截断，鼠标点击会显示一个浮窗*/
export const thumbText = (text:string, num:number = 20) => {
    if (text) {
        text = (text || '').trim();   // 有时候从text的值可能是undefined
        const tdContent:any = {
            children: text,
        };

        if (text.length > num) {
            tdContent.children = (
                <Tooltip
                    title={text}
                >
                    {`${text.slice(0, num)}...`}
                </Tooltip>
            );
        }
        return tdContent;
    }
    return '';
};
