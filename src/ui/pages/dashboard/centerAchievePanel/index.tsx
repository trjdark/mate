/**
 * desc: CD仪表盘
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/8/2
 * Time: 上午11:15
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PerformancePanelTable} from "@/ui/pages/dashboard/centerAchievePanel/part/performancePanelTable";
import {ConsumePanelTable} from "@/ui/pages/dashboard/centerAchievePanel/part/consumePanelTable";
import {ChannelPanelTable} from "@/ui/pages/dashboard/centerAchievePanel/part/channelPanelTable";
import {getMonthPerformances, getMonthChannel, getMonthConsumeCource} from "@redux-actions/report/dashboard";
import {User} from "@/common/beans/user";

class CenterAchievePanel extends Component<any, any> {
    routerConfig = [
        {name: '工作台',path: '', link: '#', id: 'dashboard'},
        {name: 'CD工作台',path: '', link: '#', id: 'dashboard_cd'},
    ]
    constructor(props) {
        super(props)
        this.state = {
            performanceDataSource : [],
            channelPanelDataSource : [],
            consumePanelDataSource: [],
        }
    }
    componentDidMount(){
        const param = {
            currentCenterId: User.currentCenterId,
            centerId: User.currentCenterId,
        };
        Promise.all([
            getMonthPerformances(param),
            getMonthChannel(param),
            getMonthConsumeCource(param)
        ]).then((res) => {
            const [performanceDataSource, channelPanelDataSource, consumePanelDataSource] = res;
            this.setState({
                performanceDataSource:[performanceDataSource],
                channelPanelDataSource: [channelPanelDataSource],
                consumePanelDataSource: [consumePanelDataSource]
            })
        })
    }

    /**
     * 获取本月业绩
     */
    queryPerformances = () => {
        const param = {
            currentCenterId: User.currentCenterId,
            centerId: User.currentCenterId,
        };
        getMonthPerformances(param).then((res) => {
            this.setState({performanceDataSource: [res]})
        });
    };
    /**
     * 获取本月渠道跟进
     */
    queryChannelPanel = () => {
        const param = {
            currentCenterId: User.currentCenterId,
            centerId: User.currentCenterId,
        };
        getMonthChannel(param).then((res) => {
            this.setState({channelPanelDataSource: [res]})
        });
    };
    /**
     * 获取本月会员耗课
     */
    queryConsumePanel = () => {
        const param = {
            currentCenterId: User.currentCenterId,
            centerId: User.currentCenterId,
        };
        getMonthConsumeCource(param).then((res) => {
            this.setState({consumePanelDataSource: [res]})
        });
    };
    /**
     * 刷新数据
     */
    refresh = (type:string) => {
        switch (type) {
            case 'performance':
                this.queryPerformances();
                break;
            case 'channel':
                this.queryChannelPanel();
                break;
            case 'consume':
                this.queryConsumePanel();
                break;
        }
    };

    render() {
        const {performanceDataSource, channelPanelDataSource, consumePanelDataSource} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routerConfig}/>
                <div className='text-r'>
                    <a className='cDefault' href="http://wiki.gymbomate.com/pages/viewpage.action?pageId=27363006" target="_blank">本页数据是如何统计的？</a>
                    <span>本页数据30~40分钟刷新一次，且点击蓝色数字后可显示明细</span>
                </div>
                <div className='page-wrap'>
                    <PerformancePanelTable
                        dataSource={performanceDataSource}
                        emitGetData={this.refresh}
                    />
                    <ChannelPanelTable
                        dataSource={channelPanelDataSource}
                        emitGetData={this.refresh}
                    />
                    <ConsumePanelTable
                        dataSource={consumePanelDataSource}
                        emitGetData={this.refresh}
                    />
                </div>
            </Fragment>
        )
    }
}

export {CenterAchievePanel}
