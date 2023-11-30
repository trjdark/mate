/**
 * desc: 八大领域设置
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/9/5
 * Time: 下午1:52
 */
import React, { Component,Fragment } from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {getScopesList, updateScope} from "@redux-actions/teaching/scopesSet";
import {User} from "@/common/beans/user";
import {Table} from "@/ui/component/tablePagination";
import {Switch} from 'antd';
import {Message} from "@/ui/component/message/message";
import './index.scss';

class ScopesSet extends Component <any, any>{
    BREAD_CRUMB = [
        {id: 'teach', name: '教学'},
        {id: 'teach-manage', name: '教学管理'},
        {id: 'eight-scopes-set', name: '八大领域管理设置'}
    ];
    constructor(props){
        super(props)
        this.state = {
            columns : [{title: <div className='gym-teach-scope-set-line'>
                                    <div className='gym-teach-scope-set-top'>八大领域</div>
                                    <div className='gym-teach-scope-set-bottom'>学阶</div>
                                </div>, dataIndex: 'name', width: 500, className: 'p0'}],
            dataSource: []
        }
    }
    componentDidMount(){
        getScopesList({currentCenterId:User.currentCenterId}).then((res) => {
            // 设置表头
            const columns = res.courseList.map(item => ({
                title: item.courseCode,
                dataIndex: item.courseId,
                render: (text, record) => (text === 0 || text )
                    ?  <Switch size='small' defaultChecked={!!text} onChange={(e) => this.handleChange(e, record, item.courseId)}/>
                    : null
            }));
            let source = {}, sourceArr = [], domain = {}, dataSource = [];
            res.measureLists.forEach(item => {
                if(source[item.measureId]){
                    source[item.measureId] = Object.assign({}, source[item.measureId], {[item.level]: item.enabled})
                }else{
                    source[item.measureId] = {
                        id: item.measureId,
                        name: item.measureName,
                        [item.level]:item.enabled,
                        parentId: item.domainId
                    }
                }
            });
            for( let key in source){
                sourceArr.push(source[key])
            }
            res.domainLists.forEach(item => {
                if(domain[item.domainId]){

                }else{
                    domain[item.domainId] = {
                        id: item.domainId,
                        name: item.domainName,
                        children:[]
                    }
                }
            })
            sourceArr.forEach(item => {
                domain[item.parentId].children.push(item)
            })
            for( let key in domain){
                dataSource.push(domain[key])
            }
            this.setState(preState => {
                return {
                    columns: [...preState.columns, ...columns],
                    dataSource: dataSource
                }
            })
        })
    }

    /**
     * 设置词条是否展示
     * @param value
     * @param record
     * @param key
     */
    handleChange = (value, record, key) => {
        const param = {
            measureId: record.id,
            level: key,
            enabled: value ? 1 : 0,
            currentCenterId: User.currentCenterId
        }
        updateScope(param).then(() => {
            Message.success('编辑成功！')
        })
    }
    render(){
        const {columns, dataSource} = this.state
        return(
            <Fragment>
                <BreadCrumb routes={this.BREAD_CRUMB}/>
                <div className="page-wrap gym-teach-scope-set">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowKey='id'
                        bordered={true}
                    />

                </div>
            </Fragment>
        )
    }
}

export {ScopesSet}
