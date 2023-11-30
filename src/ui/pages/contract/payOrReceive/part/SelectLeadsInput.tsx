/**
 * desc: 选择leads 输入框
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/2
 * Time: 上午10:15
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Input, Modal, Form, message} from "antd";
import {form} from "@/common/decorator/form";
import {
    searchBaby
} from "@redux-actions/payOrReceiveContract";
import {User} from "@/common/beans/user";
import moment from "moment";
import {TablePagination} from "@/ui/component/tablePagination";
import {PageTitle} from "@/ui/component/pageTitle";

const FormItem = Form.Item;
@form()

class SelectLeadsInput extends React.Component <any, any>{
    input: any;
    state = {
        pager:{
            currentPage: 1,
            pageSize: 5,
            totalSize:0
        },
        data: null,
        dataList: [],
        visible:false,
        babyName:''
    };

    componentDidMount() {
        this.searchBaby();
    }

    /**
     * 选择leads
     */
    selectLeads = () => {
        this.setState({visible: true});
        this.props.form.resetFields();
        const inputElement:any = ReactDOM.findDOMNode(this.input);
        inputElement.blur();
    };
    /**
     * 关闭弹窗
     */
    closeModal = () => {
        this.setState({visible: false})
    };
    /**
     * 分页操作控制
     */
    handleChangePage = (pageInfo:any) => {
        this.setState({pager:{
                currentPage:pageInfo.pageNo,
                pageSize:pageInfo.pageSize
            }
        });
        searchBaby({
            key: this.props.form.getFieldsValue().babyName,
            currentCenterId: User.currentCenterId,
            pageNo:pageInfo.pageNo,
            pageSize:pageInfo.pageSize
        }).then((res:any) => {
            this.setState({
                data:res,
                dataList: res.list,
                pager: {
                    currentPage: res.pageNo,
                    pageSize: res.pageSize,
                    totalSize: res.totalSize
                }
            });
        }, (err:any) => {
            message.error(err.msg)
        })
    };

    /**
     * 查询宝宝
     */
    searchBaby = () => {
        searchBaby({
            key: this.props.form.getFieldsValue().babyName,
            currentCenterId: User.currentCenterId,
            pageNo:1,
            pageSize:5
        }).then((res:any) => {
            this.setState({
                data:res,
                dataList: res.list,
                pager: {
                    currentPage: res.pageNo,
                    pageSize: res.pageSize,
                    totalSize: res.totalSize
                }
            });
        }, (err:any) => {
            message.error(err.msg)
        })
    };

    /**
     * 选择一个宝宝
     */
    choose = (leads:any) => {
        let that = this;

        that.set(leads);
        that.setState({
            visible: false,
            babyName: leads.babyName
        });
    };

    /**
     * 赋值选中的宝宝信息
     */
    set = (leads:any) => {

        const { setChosenBabyInfo } = this.props;
        setChosenBabyInfo(leads);
    };

    /**
     * 阻止Enter事件
     */
    handleKeyDown = (event) => {
        if (event.keyCode === 13 ) {
            event.preventDefault();
        }
    };

    render(){
        const {visible, dataList, pager, babyName} = this.state;
        const { getFieldDecorator } = this.props.form;
        //表格column
        const columns:any = [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        }, {
            title: 'GB',
            dataIndex: 'gbName',
            key: 'gbName',
        }, {
            title: '父亲',
            dataIndex: 'father',
            key: 'father',
        }, {
            title: '母亲',
            dataIndex: 'mother',
            key: 'mother'
        }, {
            title: '生日',
            dataIndex: 'birthday',
            key: 'birthday',
            render: (text:string) => {
                return(
                    <div>
                        {
                            !text
                                ? ''
                                : <span>{moment(text).format('YYYY-MM-DD')}</span>
                        }
                    </div>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'left',
            render: (text: string, record: any) => {
                //选择某一个宝宝带出leadsId
                return (
                    <Button size={`small`} className='gym-contract-btn-default' onClick={() => this.choose(record)}>
                        选择
                    </Button>
                )
            }
        }];

        return (
            <div>
                <Modal
                    className='gym-select-leads-modal'
                    visible={visible}
                    footer={false}
                    onCancel={this.closeModal}
                    centered={true}
                >
                    <div>
                        <div className='mt5'>
                            <PageTitle title={`选择宝宝`}/>
                        </div>
                        <div className='mb30'>
                            <Form layout="inline" onKeyDown={this.handleKeyDown}>
                                <FormItem label={'关键字:'}>
                                    {
                                        getFieldDecorator('babyName', {
                                            initialValue: '',
                                        })(
                                            <Input  style={{width:'200px'}} placeholder={`请输入宝宝姓名/父亲/母亲`}/>
                                        )
                                    }
                                </FormItem>
                                <FormItem>
                                    <Button className='mt5 gym-float-right gym-button-xs gym-button-blue' onClick={this.searchBaby}>查询</Button>
                                </FormItem>
                            </Form>
                        </div>
                        <TablePagination
                            rowKey={'leadsId'}
                            totalSize={pager.totalSize}
                            pageNo={pager.currentPage}
                            pageSize={pager.pageSize}
                            handleChangePage={this.handleChangePage}
                            pageSizeOptions={['5','10','20']}
                            columns={columns}
                            dataSource={dataList}
                        />
                    </div>
                </Modal>
                <Input
                    style={{width:'250px'}}
                    ref={(ref:any) => {this.input = ref}}
                    autoComplete='off'
                    placeholder={'请输入'}
                    onFocus={this.selectLeads}
                    value={babyName}
                />
            </div>
        )
    }
}

export {SelectLeadsInput}
