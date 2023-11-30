/**
 * desc: 试听申请查看
 * User: colin.lu
 * Date: 2019/01/02
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {PageTitle} from "../../../component/pageTitle";
import {User} from "../../../../common/beans/user";
import {CommonUtils} from "../../../../common/utils/commonUtils";
import {Button, message} from "antd";
import {getPreviewDetail} from "@redux-actions/teaching/applyManage";
import {BasicInfo} from "./part/basicInfo";
import {StepsInfo} from "./part/stepsInfo";
import {Table} from "../../../component/tablePagination";
import history from "../../../../router/history";
import {Routes} from "@/router/enum/routes";

declare interface ApplyProps {
    list: Array<any>,
    historyColumns: any
}

class MakeUpApplyDetail extends React.Component<ApplyProps, any> {
    //路由代码块
    private routes:Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '申请管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        },{
            name: '试听申请详情',
            path: '',
            link: '#',
            id: 'contractManagementPay'
        }
    ];
    leadsId:string;
    id:string;
    state:any;

    constructor(props: any) {
        super(props);

        if (CommonUtils.hasParams(props)) {
            this.leadsId = CommonUtils.parse(props).leadsId;
            this.id = CommonUtils.parse(props).id;
        }
        this.state = {
            list: [],
            applyContent: {}
        }
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail = () =>{
        /**
         * 校验用户名api
         * @param someParam<>
         * @method post
         * @response  res<>
         */
        let postData = {
            'id':this.id,
            'currentCenterId': User.currentCenterId
        };

        getPreviewDetail(postData).then((res) => {
            this.setState({
                applyContent:res
            })
        }, (err) => {
            //返回请求reject
            message.error(err.msg)
        })
    };

    /**
     *
     */
    returnToMakeUp = () => {
        history.push(Routes.试听申请.path);
    };

    render() {
        const { applyContent } = this.state;
        const historyColumns:any = [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        }, {
            title: '试听时间',
            dataIndex: 'previewTime',
            key: 'previewTime',
        }, {
            title: '试听课程',
            dataIndex: 'courseCode',
            key: 'courseCode',
        }, {
            title: '教室',
            dataIndex: 'classroom',
            key: 'classroom',
        }, {
            title: 'INS',
            dataIndex: 'ins',
            key: 'ins'
        }, {
            title: 'GB',
            dataIndex: 'gb',
            key: 'gb'
        }];


        return (
            <div id={`gym-contract-receive`}>
                <BreadCrumb routes={this.routes} />
                <div className='gym-contract'>
                    <div className='page-wrap gym-contract-content'>
                        <PageTitle title={`流转记录`}/>
                        <div className='gym-contract-step'>
                            <div>
                                <StepsInfo stepInfo={applyContent} />
                            </div>
                        </div>
                        <BasicInfo applyInfo={applyContent}/>
                        <div className='gym-contract-close-btn'>
                            <Button
                                htmlType="button"
                                className="gym-button-default gym-button-xs"
                                type="primary"
                                onClick={()=>this.returnToMakeUp()}
                            >
                                关闭
                            </Button>
                        </div>
                    </div>
                    <div className='page-wrap gym-contract-content gym-teaching-none-margin-bottom'>
                        <div>
                            <PageTitle title={`历史试听记录`}/>
                                <Table
                                    columns={historyColumns}
                                    pagination={false}
                                    bordered={false}
                                    dataSource={applyContent.history}
                                    rowKey={'id'}
                                />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export {MakeUpApplyDetail}
