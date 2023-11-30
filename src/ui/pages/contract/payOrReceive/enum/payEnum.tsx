/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/21
 * Time: 14:35
 */
import {
    expensesStatus, payOthersReasons, receiveOthersReasons, approveStatus
} from "@/ui/pages/contract/enum/contract";
import {SafeCalculate} from "@/common/utils/commonUtils";
import moment from 'moment';
// 搜索设置
const searchConfigEnum = {
    contract : [
        {
            label: '宝宝姓名',
            type: 'text',
            placeholder: '请输入',
            name: 'babyName'
        },{
            label: '合同编号',
            type: 'text',
            placeholder: '请输入',
            name: 'contractCode'
        },{
            label: '收支状态',
            type: 'select',
            name: 'hasPayment',
            placeholder: '请选择',
            options: expensesStatus,
            popupContainer: '.gym-content'
        },{
            label: '付款日期',
            type: 'rangePicker',
            name: 'payDate'
        },{
            label: '记账日期',
            type: 'rangePicker',
            name: 'createDate'
        }
    ],
    other: [
        {
            label: '宝宝姓名',
            type: 'text',
            placeholder: '请输入',
            name: 'babyName'
        },{
            label: '合同编号',
            type: 'text',
            placeholder: '请输入',
            name: 'contractCode'
        },{
            label: '收支状态',
            type: 'select',
            name: 'hasPayment',
            placeholder: '请选择',
            options: expensesStatus,
            popupContainer: '.gym-content'

        },{
            label: '原由',
            type: 'select',
            name: 'financialContent',
            options: payOthersReasons,
            popupContainer: '.gym-content'
        },{
            label: '付款日期',
            type: 'rangePicker',
            name: 'payDate'
        },{
            label: '记账日期',
            type: 'rangePicker',
            name: 'createDate'
        }
    ],
    package : [
        {
            label: '宝宝姓名',
            type: 'text',
            placeholder: '请输入',
            name: 'babyName'
        },{
            label: '合同编号',
            type: 'text',
            placeholder: '请输入',
            name: 'contractCode'
        },{
            label: '收支状态',
            type: 'select',
            name: 'hasPayment',
            placeholder: '请选择',
            options: expensesStatus,
            popupContainer: '.gym-content'
        },{
            label: '付款日期',
            type: 'rangePicker',
            name: 'payDate'
        },{
            label: '记账日期',
            type: 'rangePicker',
            name: 'createDate'
        }
    ],
    trans: [
        {
            label: '宝宝姓名',
            type: 'text',
            placeholder: '请输入',
            name: 'babyName'
        },{
            label: '合同编号',
            type: 'text',
            placeholder: '请输入',
            name: 'contractCode'
        },{
            label: '收支状态',
            type: 'select',
            name: 'hasPayment',
            placeholder: '请选择',
            options: expensesStatus,
            popupContainer: '.gym-content'
        },{
            label: '付款日期',
            type: 'rangePicker',
            name: 'payDate'
        },{
            label: '记账日期',
            type: 'rangePicker',
            name: 'createDate'
        }
    ],
    partRefund:[
        {
            label: '宝宝姓名',
            type: 'text',
            placeholder: '请输入',
            name: 'babyName'
        },{
            label: '合同编号',
            type: 'text',
            placeholder: '请输入',
            name: 'contractCode'
        },{
            label: '收支状态',
            type: 'select',
            name: 'hasPayment',
            placeholder: '请选择',
            options: expensesStatus,
            popupContainer: '.gym-content'
        },{
            label: '付款日期',
            type: 'rangePicker',
            name: 'payDate'
        },{
            label: '记账日期',
            type: 'rangePicker',
            name: 'createDate'
        }
    ]
};
// 表格设置
const columnsEnum = {
    contract : [
        {
            title: '宝宝姓名',
            dataIndex: 'customerName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
        }, {
            title: '原由',
            dataIndex: 'financialContentType',
            render(text) {
                const option = new Map([
                    ['0', ''],
                    ['1', '新建合同'],
                    ['2', '改包'],
                    ['3', '转中心'],
                    ['4', '退课'],
                    ['5', '部分退费'],
                ]);
                return option.get(text) || '-';
            }
        }, {
            title: '应付金额',
            dataIndex: 'estimatedAmount',
            render: (num:number) => SafeCalculate.autoZero(num)
        }, {
            title: '付款金额',
            dataIndex: 'amount',
            render(text:number, record:any) {
                if(record.hasPayment === 1){
                    return SafeCalculate.autoZero(text);
                }else{
                    return '';
                }
            }
        }, {
            title: '收支状态',
            dataIndex: 'hasPaymentName',
        }, {
            title: '付款日期',
            dataIndex: 'financialDate',
            render(text) {
                if(text && text != null){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return '';
                }
            }
        }, {
            title: '记账日期',
            dataIndex: 'lastUpdateDate', // createDate
            key: 'lastUpdateDate',
            render(text:any, record:any) {
                if(text && record.hasPayment === 1){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return '';
                }
            }
        }, {
            title: 'GB',
            dataIndex: 'gbName',
            key: 'gbName',
            width: 150
        }, {
            title: 'GA',
            dataIndex: 'gaName',
            key: 'gaName',
            width: 150
        }],
    other: [
        {
            title: '宝宝姓名',
            dataIndex: 'customerName',
            key: 'customerName',
            width: 150
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
            className:'gym-contract-other-column-width'
        }, {
            title: '原由',
            dataIndex: 'financialContent',
            key: 'financialContent',
            width: 90,
            render: (text:string) => {
                const res = [...payOthersReasons, ...receiveOthersReasons].filter((item:any) => item.postCode.toString() === text);
                return res.length > 0 ? res[0].postName : '-';
            }
        }, {
            title: '应付金额',
            dataIndex: 'estimatedAmount',
            key: 'estimatedAmount',
            width: 150,
            render: (num:number) => SafeCalculate.autoZero(num)
        }, {
            title: '付款金额',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render(text:number, record:any) {
                if(record.hasPayment === 1){
                    return SafeCalculate.autoZero(text)
                }else{
                    return '';
                }
            }
        }, {
            title: '收支状态',
            dataIndex: 'hasPaymentName',
            key: 'hasPaymentName',
            width: 100
        }, {
            title: '付款日期',
            dataIndex: 'financialDate',
            key: 'financialDate',
            width: 150,
            render(text:string, record:any) {
                if(text && text !== ''){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return ''
                }
            }
        }, {
            title: '记账日期',
            dataIndex: 'lastUpdateDate', // createDate
            key: 'lastUpdateDate',
            width: 150,
            render(text:any, record:any) {
                if(text && record.hasPayment === 1){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return '';
                }
            }
        }, {
            title: 'GB',
            dataIndex: 'gbName',
            key: 'gbName',
            width: 150
        }, {
            title: 'GA',
            dataIndex: 'gaName',
            key: 'gaName',
            width: 150
        },],
    package :  [
        {
            title: '宝宝姓名',
            dataIndex: 'customerName',
            key: 'customerName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '原由',
            dataIndex: 'financialContentType',
            key: 'financialContentType',
            render(text) {
                const option = new Map([
                    ['0', ''],
                    ['1', '新建合同'],
                    ['2', '改包'],
                    ['3', '转中心'],
                    ['4', '退课'],
                    ['5', '部分退费'],
                ]);
                return option.get(text) || '-';
            }
        }, {
            title: '应付金额',
            dataIndex: 'estimatedAmount',
            key: 'estimatedAmount',
            render: (num:number) => SafeCalculate.autoZero(num)
        }, {
            title: '付款金额',
            dataIndex: 'amount',
            key: 'amount',
            render(text:number, record:any) {
                if(record.hasPayment === 1){
                    return SafeCalculate.autoZero(text)
                }else{
                    return '';
                }
            }
        }, {
            title: '收支状态',
            dataIndex: 'hasPaymentName',
            key: 'hasPaymentName',
        }, {
            title: '付款日期',
            dataIndex: 'financialDate',
            key: 'financialDate',
            render(text) {
                if(text && text != null){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return '';
                }
            }
        }, {
            title: '记账日期',
            dataIndex: 'lastUpdateDate', // createDate
            key: 'lastUpdateDate',
            render(text:any, record:any) {
                if(text && record.hasPayment === 1){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return '';
                }
            }
        }, {
            title: 'GB',
            dataIndex: 'gbName',
            key: 'gbName',
            width: 150
        }, {
            title: 'GA',
            dataIndex: 'gaName',
            key: 'gaName',
            width: 150
        }],
    trans: [
        {
            title: '宝宝姓名',
            dataIndex: 'customerName',
            key: 'customerName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '原由',
            dataIndex: 'financialContentType',
            key: 'financialContentType',
            render(text) {
                const option = new Map([
                    ['0', ''],
                    ['1', '新建合同'],
                    ['2', '改包'],
                    ['3', '转中心'],
                    ['4', '退课'],
                    ['5', '部分退费'],
                ]);
                return option.get(text) || '-';
            }
        }, {
            title: '应付金额',
            dataIndex: 'estimatedAmount',
            key: 'estimatedAmount',
            render: (num:number) => SafeCalculate.autoZero(num)
        }, {
            title: '付款金额',
            dataIndex: 'amount',
            key: 'amount',
            render(text:number, record:any) {
                if(record.hasPayment === 1){
                    return SafeCalculate.autoZero(text);
                }else{
                    return '';
                }
            }
        }, {
            title: '收支状态',
            dataIndex: 'hasPaymentName',
            key: 'hasPaymentName',
        }, {
            title: '付款日期',
            dataIndex: 'financialDate',
            key: 'financialDate',
            render(text) {
                if(text && text != null){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return '';
                }
            }
        }, {
            title: '记账日期',
            dataIndex: 'lastUpdateDate', // createDate
            key: 'lastUpdateDate',
            render(text:any, record:any) {
                if(text && record.hasPayment === 1){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return '';
                }
            }
        }, {
            title: 'GB',
            dataIndex: 'gbName',
            key: 'gbName',
            width: 150
        }, {
            title: 'GA',
            dataIndex: 'gaName',
            key: 'gaName',
            width: 150
        }],
    partRefund: [
        {
            title: '宝宝姓名',
            dataIndex: 'customerName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            className:'gym-contract-other-column-width'
        },{
            title: '原由',
            dataIndex: 'financialContentType',
            key: 'financialContentType',
            render(text) {
                const option = new Map([
                    ['0', ''],
                    ['1', '新建合同'],
                    ['2', '改包'],
                    ['3', '转中心'],
                    ['4', '退课'],
                    ['5', '部分退费'],
                ]);
                return option.get(text) || '-';
            }
        },{
            title: '应付金额',
            dataIndex: 'estimatedAmount',
            key: 'estimatedAmount',
            render: (num:number) => SafeCalculate.autoZero(num)
        }, {
            title: '付款金额',
            dataIndex: 'amount',
            key: 'amount',
            render(text:number, record:any) {
                if(record.hasPayment === 1){
                    return SafeCalculate.autoZero(text);
                }else{
                    return '';
                }
            }
        }, {
            title: '收支状态',
            dataIndex: 'hasPaymentName',
            key: 'hasPaymentName',
        }, {
            title: '付款日期',
            dataIndex: 'financialDate',
            key: 'financialDate',
            render(text) {
                if(text && text != null){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return '';
                }
            }
        }, {
            title: '记账日期',
            dataIndex: 'lastUpdateDate', // createDate
            key: 'lastUpdateDate',
            render(text:any, record:any) {
                if(text && record.hasPayment === 1){
                    return moment(text).format('YYYY-MM-DD');
                }else{
                    return '';
                }
            }
        }, {
            title: 'GB',
            dataIndex: 'gbName',
            key: 'gbName',
            width: 150
        }, {
            title: 'GA',
            dataIndex: 'gaName',
            key: 'gaName',
            width: 150
        }

    ]
}

const rowKeyEnum = {
    contract: 'aparId',
    other: 'financialRecordId',
    trans: 'aparId',
    package: 'aparId',
    partRefund: 'aparId',
}


export {searchConfigEnum, columnsEnum, rowKeyEnum}
