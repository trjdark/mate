/**
 * Desc: 签到打印列表（有联系方式，无联系方式）
 * User: Debby.Deng
 * Date: 2018/12/13,
 * Time: 下午1:33
 */
import * as React from "react";
import {Table} from "@/ui/component/tablePagination";
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import {singlePrint} from "@redux-actions/teaching/scheduleAction";
import moment from 'moment';
import _ from "lodash";

interface PropSet {
    withContact: boolean,

    [propsName: string]: any,
}

interface RouteSet {
    lessonId: string,    // 临时ID
    scheduleId: string,  // 固定ID
    courseInfo: any,     // 课程详情
    id: number,          // 有无联系方式
}

class SigninListPrint extends React.Component<PropSet, any> {
    routeParams: RouteSet = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props) : {};
    status = {
        有联系方式: 1,
        无联系方式: 2,
    };
    columns = [
        {
            title: '序号',
            dataIndex: 'rowNum',
            key: 'rowNum',
            align: 'center',
        }, {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            align: 'center',
            width: '10%',
            render: (text, record) => {
                return <div><p>{text}</p><p>{moment(record.birthday).format('YYYY-MM-DD')}</p></div>
            }
        }, {
            title: '昵称',
            dataIndex: 'nickName',
            key: 'nickName',
            align: 'center',

        }, {
            title: '联系人',
            dataIndex: 'contact',
            key: 'contact',
            render: (text, record) => {
                if (this.routeParams.id === this.status.有联系方式) {
                    return (
                        <div>
                            <p>{record.contactName} </p>
                            <p>{record.primaryContactTel}</p>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <p>{record.contactName}  </p>
                        </div>
                    )
                }
            },
            align: 'center',
        }, {
            title: '排课类型',
            dataIndex: 'bookWay',
            key: 'bookWay',
            align: 'center',
            width: '10%',
            render: (text, record) => {
                // 如果处于等位状态，显示排课类型为W，如果不是等位状态，则显示真实的排课类型
                return record.isWaiting === '1' ? 'W' : text;
            }
        }, {
            title: 'GB/GA',
            dataIndex: 'staffGbName',
            key: 'staffGbName',
            align: 'center',
            render: (text, record) => (this.getGBGAlist(text, record))

        }, {
            title: '连续未到',
            dataIndex: 'serialAbcentNum',
            key: 'serialAbcentNum',
            align: 'center',
            width: '10%'

        }, {
            title: '签到',
            dataIndex: 'attendanceStatus',
            key: 'attendanceStatus',
            align: 'center',
            width: '12%',
            render: (text) => {
                return text === '请假' ? text : '';
            }
        },
    ];
    state = {
        dataSource: [],
    };
    getGBGAlist = (text, record) => {
        const ga = record.staffGaName;
        if (!ga) {
            return `${text}`;
        } else {
            return `${text}/${ga}`
        }
    };

    componentDidMount() {
        const {lessonId, scheduleId} = this.routeParams;
        const params = {
            currentCenterId: User.currentCenterId,
            lessonId: lessonId,
            classScheduleId: scheduleId
        };
        singlePrint(params).then((res) => {
            this.setState({dataSource: res})
        });
    }

    handlePrint = () => {
        const href = window.location.href;
        const printHtml = window.document.getElementById('printContent').innerHTML;
        const iframe = window.document.createElement('iframe');
        iframe.src = href;
        iframe.style.display = 'none';
        window.document.body.appendChild(iframe);
        iframe.contentWindow.onload = function () {
            iframe.contentDocument.body.innerHTML = printHtml;  // 把要打印的部分放入iframe中, 生成html结构
            const tbody = iframe.contentDocument.querySelector('tbody');
            const len = tbody.getElementsByTagName('tr').length;
            let html = iframe.contentDocument.createDocumentFragment();    // 创建一个文档片段，暂存新生成的node节点

            // 生成最多18个空行
            for (let i = len + 1; i <= 18; i++) {
                let tr = iframe.contentDocument.createElement('tr');
                tr.setAttribute('height', '50px');

                // 每个空行里面有8个单元格
                for (let j = 0; j < 8; j++) {
                    let td = iframe.contentDocument.createElement('td');
                    if (j === 0) {
                        td.innerHTML = String(i);
                        td.style.textAlign = 'center';
                    }
                    tr.appendChild(td);
                }
                // 生成的node节点放入文档片段中
                html.appendChild(tr);
            }
            // 把新生成的空行插入到表格中
            tbody.appendChild(html);
            // 开始打印
            iframe.contentWindow.print();
        };
        setTimeout(
            () => {
                iframe.remove();
            },
            10000
        )
    };

    render() {
        const {dataSource} = this.state;
        const {courseInfo} = this.routeParams;
        const {courseCode, classroomName, teacherName, assistantInsStaffName} = courseInfo;
        return (
            <div className='p10 bgWhite gym-teaching-schedule-signin-print'>
                <button
                    className='gym-button-xs gym-button-default'
                    onClick={_.throttle(this.handlePrint, 500, {trailing: false})}
                >打印
                </button>
                <div id="printContent" className="pos_rel">
                    <span className="gym-teaching-schedule-signin-print-course">{courseCode}</span>
                    <h1 className="text-c gym-teaching-print-title">{(dataSource[0] || {}).centerName || User.currentCenterName}</h1>
                    <p className='text-c size18'>签到表</p>
                    <p className='mb10'><span>课程时间： {(dataSource[0] || {}).lessonDate} </span>
                        <span className='mlr15'>教室：{classroomName}</span>
                        <span className="mlr15">主教: {teacherName}</span>
                        {
                            assistantInsStaffName ? <span>助教: {assistantInsStaffName}</span> : null
                        }
                    </p>
                    <Table
                        columns={this.columns}
                        rowKey={`babyId`}
                        dataSource={this.state.dataSource}
                        scroll={{x: true}}
                    />
                </div>
            </div>
        )
    }
}

export {SigninListPrint}
