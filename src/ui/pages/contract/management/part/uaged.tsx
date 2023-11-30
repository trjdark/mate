/**
 * desc: 使用情况
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/12/5
 * Time: 下午5:37
 */
import React from 'react';
import {Table} from "@/ui/component/tablePagination";
import {connect} from "@/common/decorator/connect";
import {selectUsageTypes} from "@/saga/selectors/contract";
import {SafeCalculate} from "@/common/utils/commonUtils";

@connect((state:any) => ({
    usgaeTypeList: selectUsageTypes(state)
}))
class Uaged extends React.Component<any, any> {
    render(){
        const {list, usgaeTypeList} = this.props;
        const contractColumns:any = [{
            title: '',
            dataIndex: 'usageType',
            key: 'usageType',
            align: 'left',
            className: 'gym-contract-info-usage-table-column',
            render: (text:string) => {
                const res = usgaeTypeList.filter((item:any) => item.code === text);
                return res.length > 0 ? `${res[0].codeValue}:` : '-';
            }
        }, {
            title: '课时数',
            dataIndex: 'courseNum',
            key: 'courseNum',
            className: 'gym-contract-info-usage-table-column-value'
        }, {
            title: '金额',
            dataIndex: 'coursePrice',
            key: 'coursePrice',
            render: (num:number) => SafeCalculate.autoZero(num)
        }, {
            title: '有效期',
            dataIndex: 'periodOfValidity',
            key: 'periodOfValidity',
        }, {
            title: '请假次数',
            dataIndex: 'leaveTimes',
            key: 'leaveTimes',
        }];
        return(
            <div className='gym-contract-usage-table'>
                <Table
                    columns={contractColumns}
                    pagination={false}
                    bordered={false}
                    dataSource={list}
                    rowKey='usageType'
                />
            </div>

        )
    }
}

export {Uaged}
