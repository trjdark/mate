/**
 * desc: 打印
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {Button} from 'antd';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import {connect} from "react-redux";
import {getSignList, getActivityDetail, getActivityTypeDef} from "@redux-actions/activity/activityDetail";
import moment from 'moment';
import './style/index.scss';

class ActivityPrint extends Component<any, any> {
    private breadCrumbRoutes = [
        {
            name: '活动'
        },
        {
            name: '活动管理'
        },
        {
            name: '打印'
        }
    ];

    constructor(props) {
        super(props);
        this.state = {
            hasContract: false,   // 打印时是否带联系方式，默认不带
            activityId: '',         // 活动id
            currentCenterId: User.currentCenterId,
            currentCenterName: User.currentCenterName,
            pageNo: 1,      // 当前页码
            pageSize: 10000,   // 请求条数
        };
        this.handlePrint = this.handlePrint.bind(this);
        this.getSignList = this.getSignList.bind(this);
    }

    render() {
        const {hasContract, currentCenterName} = this.state;
        const {signList, theme, startDateTime, endDateTime, activityField, familyRelationObj = {}} = this.props;
        return (
            <Fragment>
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                <div className='page-wrap'>
                    <Button htmlType="button" className="gym-button-default-sm" onClick={this.handlePrint}>打印</Button>
                    <div id="printContent">
                        <div className="gym-print-wrap">
                            <h1>{currentCenterName}</h1>
                            <h2>会员活动签到表</h2>
                            <p className="gym-print-des">
                                <span>{theme}</span>
                                <span>活动时间: {moment(startDateTime).format('YYYY/MM/DD (ddd) HH:mm')} ~ {moment(endDateTime).format('HH:mm')}</span>
                                <span>{activityField}</span>
                            </p>
                            <table className="gym-print-table">
                                <colgroup>
                                    <col width="48px"/>
                                    <col width="auto"/>
                                    <col width="auto"/>
                                    <col width="auto"/>
                                    <col width="auto"/>
                                    <col width="auto"/>
                                    <col width="72px"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>宝宝姓名</th>
                                    <th>昵称</th>
                                    <th>联系人</th>
                                    <th>GB</th>
                                    <th>GA</th>
                                    <th>签到</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    signList.map((item, index) => {
                                        const {attendanceId, babyName, babyBirthday, babyNickName, gbFullName, gaFullName, contacts} = item;
                                        return (
                                            <tr key={attendanceId}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {babyName}<br/>{babyBirthday ? moment(babyBirthday).format('YYYY-MM-DD') : ''}
                                                </td>
                                                <td>{babyNickName}</td>
                                                <td>
                                                    <p>
                                                        {
                                                            (contacts || []).map(val => {
                                                                const {contactName, contactRelation, id} = val;
                                                                return (
                                                                    <span
                                                                        key={contactName + id}>{familyRelationObj[contactRelation]}: {contactName}</span>
                                                                )
                                                            })
                                                        }
                                                    </p>
                                                    {
                                                        // 需要打印联系方式时，渲染联系方式，否则不渲染
                                                        hasContract ? (
                                                            <p>
                                                                {
                                                                    (() => {
                                                                        let phone = (contacts || []).reduce(
                                                                            (acc, val) => {
                                                                                const {contactTelphone} = val;
                                                                                if (contactTelphone) {
                                                                                    return acc += contactTelphone + ','
                                                                                }
                                                                                return acc;
                                                                            },
                                                                            ''
                                                                        );
                                                                        return (
                                                                            phone ? <span>({phone.slice(0, -1)})</span> : null
                                                                        )
                                                                    })()
                                                                }
                                                            </p>
                                                        ) : null
                                                    }
                                                </td>
                                                <td>{gbFullName}</td>
                                                <td>{gaFullName}</td>
                                                <td/>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

    componentDidMount() {
        // 页面加载时判断url是否带有id值
        const {hasParams, parse} = CommonUtils;
        const props = this.props;
        if (hasParams(props)) {
            const {contract, activityId} = parse(props);
            const {currentCenterId} = this.state;
            // 查询分类定义
            props.getActivityTypeDef({currentCenterId: User.currentCenterId});
            // 把状态设置到state，然后查询列表和当前的活动详情
            this.setState({
                    hasContract: contract,
                    activityId
                }, () => {
                    props.getActivityDetail({
                        id: activityId,
                        currentCenterId
                    });
                    this.getSignList();
                });
        }
    }

    /*获取签到列表*/
    getSignList() {
        const {currentCenterId, activityId, pageNo, pageSize} = this.state;
        const {teachActivityAttendanceStatusEnum} = this.props;
        const params = {
            data: {
                activityId,
                currentCenterId,
                pageNo,
                pageSize,
                attendanceStatus: (teachActivityAttendanceStatusEnum.已报名 || '52001')
            }
        };
        this.props.getSignList(params);
    }

    /*打印页面*/
    handlePrint() {
        const printHtml = window.document.getElementById('printContent').innerHTML;
        const container = window.document.querySelector('.page-wrap');
        CommonUtils.printPage(printHtml, container);
    }
}

const mapStateToProps = state => {
    const {
        types,
        signList,           // 签到列表
        theme,              // 活动名称
        startDateTime,      // 活动开始时间
        endDateTime,        // 活动结束时间
        activityField,      // 活动地点
    } = state.activityDetail;

    const {
        teachActivityAttendanceStatusEnum,  // 客户出席状态
        familyRelationObj,  // 家庭关系枚举（用于取值）
    } = types;

    return {
        signList,
        theme,
        startDateTime,
        endDateTime,
        activityField,
        familyRelationObj,
        teachActivityAttendanceStatusEnum
    }
};
const mapDispatchProps = dispatch => ({
    getSignList(params) {
        dispatch(getSignList(params));
    },
    getActivityDetail(params) {
        dispatch(getActivityDetail(params));
    },
    getActivityTypeDef(params) {
        dispatch(getActivityTypeDef(params));
    }
});

export default connect(mapStateToProps, mapDispatchProps)(ActivityPrint);
