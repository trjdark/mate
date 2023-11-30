/**
 * desc: 坐席分配
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/5
 * Time: 下午2:07
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Routes} from "@/router/enum/routes";
import {Link} from "react-router-dom";
import {Table} from "@/ui/component/tablePagination";
import {User} from "@/common/beans/user";
import {getLandLineList} from "@redux-actions/telephone/callLeads";
import {CommonUtils} from "@/common/utils/commonUtils";

class LandLine extends React.Component<any, any>{
    constructor(props:any){
        super(props)
        this.state = {
            dataSource: []
        }
    }
    private routes:Array<any> = [
        {
            name: '云语音',
            path: '',
            link: '#',
            id: 'setting'
        },{
            name: '坐席分配',
            path: '',
            link: '#',
            id: 'tmk'
        }
    ];
    columns = [
        {
            title: '用户名',
            dataIndex: 'tmkStaffName',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
        },
        {
            title: '分机号',
            dataIndex: 'exNumber',
        },
        {
            title: '操作',
            dataIndex: 'id',
            render: (text) => <Link to={`${Routes.编辑坐席.link}${CommonUtils.stringify({id: text})}`}>
                <button className="gym-button-white gym-button-xxs">编辑</button>
            </Link>

        },
    ];
    componentDidMount(){
        getLandLineList({
            currentCenterId:User.currentCenterId
        }).then((res:any) => {
            this.setState({dataSource: res.list})
        })
    }
    render(){
        const {dataSource} = this.state;
        return(
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div id="gym-telephone-landline" className="gym-telephone-landline page-wrap">
                    <div className='ml30'>
                        <Link to={`${Routes.添加坐席.path}`}>
                            <button className='gym-button-xs gym-button-default mb20'>+ 新建</button>
                        </Link>
                    </div>
                    <Table
                        columns={this.columns}
                        rowKey={'id'}
                        dataSource={dataSource}
                    />
                </div>
            </Fragment>
        )
    }
}

export {LandLine}
