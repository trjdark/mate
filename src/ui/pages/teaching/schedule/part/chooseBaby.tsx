/**
 * Desc: 选择宝宝
 * User: Debby.Deng
 * Date: 2018/12/10,
 * Time: 下午3:58
 */
import * as React from "react";
import {PageTitle} from "@/ui/component/pageTitle";
import {SearchForm} from "@/ui/component/searchForm";
import { TablePagination} from "@/ui/component/tablePagination";
import {User} from "@/common/beans/user";
import {bookCourse, bookWaiting, getBabyContract, getBabyList} from "@redux-actions/teaching/scheduleAction";
import {connect} from "@/common/decorator/connect";
import {selectGAlist, selectGBlist} from "@/saga/selectors/teaching/scheduleSelector";
import {selectApprovalPermission} from "@/saga/selectors/home";
import {form} from "@/common/decorator/form";
import {Validate, Validation} from "@/common/utils/validate";
import {Message} from "@/ui/component/message/message";
import {ListModal} from "@/ui/component/listModal";
import {ChooseContract} from "@/ui/pages/teaching/schedule/part/contracts";

interface PropSet {
    lessonId: string,
    restCapacity: number,
    onUpdateData: () => (void),
    onClose: () => (void),
    lessonStartTimeStamp: number,// 开课时间戳
    [propsName: string]: any,
    businessSource:string, // 业务来源（西格玛，金宝贝）

}

@form()
@connect(
    (state) => ({
        selectGAlist: selectGAlist(state),
        selectGBlist: selectGBlist(state),
        enabledGa: selectApprovalPermission(state).enabledGa,
    }),
    {}
)
class ChooseBaby extends React.Component<PropSet,any> {
    state = {
        dataObj: {list: [], pageNo: null, pageSize: null, totalSize: null},
        pageNo: 1,
        pageSize: 10,
        showContract:false,
        contractData:[],
        currentBabyInfo:{},//包含leadsId,babyId, lessonId, contractId
        arrangeCourse:false,//点击排课||等位
    };
    columns = [
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        },
        {
            title: '宝宝昵称',
            dataIndex: 'nickName',
            key: 'nickName',
        },
        {
            title: '课程包',
            dataIndex: 'packageName',
            key: 'packageName',
        },
        {
            title: '联系人',
            dataIndex: 'primaryContactName',
            key: 'primaryContactName',
        },
        {
            title: 'GB',
            dataIndex: 'gbStaffName',
            key: 'gbStaffName',
        },
        {
            title: 'GA',
            dataIndex: 'gaStaffName',
            key: 'gaStaffName',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            width:100,
            render: (text, record) => (
                this.props.restCapacity > 0 ? (
                    <button
                        className='gym-button-xs gym-button-white'
                        onClick={this.handleBookCourse.bind(this, record.leadsId, record.babyId)}
                    >
                        <span>排课</span>
                    </button>
                ) : (
                    <button
                        className='gym-button-xs gym-button-white'
                        onClick={this.handleBookWaiting.bind(this, record.leadsId, record.babyId)}
                    >
                        <span>排队</span>
                    </button>
                )
            )
        },
    ];

     /**
      * 排课后台保存
      * @param params
      * @returns {any}
      */

     saveBookCourse=(params)=>{
         const { onUpdateData, onClose} = this.props;
         bookCourse(params).then(
             (res) => {
                 onUpdateData();
                 onClose();
             },
             (err) => {
                 console.log(err)
             });
     }

    /**
     * 排课
     * @param leadsId
     * @param babyId
     * @returns {any}
     */
    handleBookCourse = async (leadsId, babyId) => {
        const {lessonId,businessSource} = this.props;

        const params:any = {
            currentCenterId: User.currentCenterId,
            babyId,
            leadsId,
            lessonId,
            businessSource,
        };
        const res=await this.getContractInfo(params);
        if(!res.status){
            const {contractId}:any = (this.state.contractData[0]||{});
            params.contractId = contractId;
            this.saveBookCourse(params);
        }else{
            this.setState({currentBabyInfo:params,arrangeCourse:true})
        }

    };
     /**
      * 排队后台保存
      * @param params
      * @returns {any}
      */
    saveBookWaiting=(params)=>{
        const {onUpdateData, onClose} = this.props;
        bookWaiting(params).then(
            res => {
                onUpdateData();
                onClose();
            },
            (err) => {
                console.log(err)
            }
        )
    }
    /**
     * 排队
     * @param leadsId
     * @param babyId
     * @returns {any}
     */

    handleBookWaiting =async (leadsId, babyId) => {
        const {lessonId, businessSource} = this.props;
        const params:any = {
            currentCenterId: User.currentCenterId,
            babyId,
            leadsId,
            lessonId,
            businessSource,
        };
        const res=await this.getContractInfo(params);
        if(!res.status) {
            const {contractId}:any = (this.state.contractData[0]||{});
            params.contractId=contractId;
            this.saveBookWaiting(params);
        }else{
            this.setState({currentBabyInfo:params,arrangeCourse:false})
        }

    };
    /**
     * 后台请求数据
     * @returns {any}
     */
    requestData = () => {
        const {pageNo, pageSize} = this.state;
        const {form, lessonId,businessSource} = this.props;
        const value = form.getFieldsValue();
        const params = {
            currentCenterId: User.currentCenterId,
            ...value,
            lessonId: lessonId,
            pageNo,
            pageSize,
            businessSource: businessSource
        };
        const {phone}=value;
        if(phone){
            if (!Validate.check(phone,Validation.手机号)) {
                Message.error('请输入11位数的手机号码');
                return false;
            }
        }
        getBabyList(params).then((res) => {
            this.setState({dataObj: res});
        })
    };
    /**
     * 点击查询事件
     * @returns {any}
     */
    handleSearch = (value) => {
        this.setState(
            {
                pageNo: 1
            },
            this.requestData
        )
    };
    /**
     * 页面跳转
     * @param pageInfo
     * @returns {any}
     */
    handlePageChange = (pageInfo) => {
        this.setState(pageInfo, this.requestData);
    };
    /**
     * 解析ga,gb数据为selectForm要求数据
     * @param options
     * @returns {any}
     */
    parseOptions = (options) => {
        return options.map((item) => ({
            postCode: item.staffId,
            postName: item.userName,
        }))
    };
    /**
     * 关闭选择合同
     * @returns {any}
     */
    handleContractCancel=()=>{
        this.setState({showContract:false})
    };

     /**
      * 选择合同确认
      * @returns {any}
      */

    handleContractOk=()=>{
        const {arrangeCourse,currentBabyInfo,contractData}:any = this.state;
        const {contractId}:any = currentBabyInfo;
        if(!contractId){
            currentBabyInfo.contractId = contractData[0].contractId;
        }
        const request=arrangeCourse? this.saveBookCourse : this.saveBookWaiting;
        this.setState({showContract:false},()=>{
            request(currentBabyInfo);
        });

    }
     /**
      * 调取合同信息
      * @param params
      * @returns {any}
      */
     getContractInfo=async (params)=>{
         const res= await getBabyContract(params);
         this.setState({contractData:res.list||[], showContract:res.status});
         return Promise.resolve(res);
     };
      /**
       * 选中合同
       * @param key
       * @returns {any}
       */
    getSelectedKey=(key)=>{
        const {currentBabyInfo}=this.state;
        this.setState({currentBabyInfo:{...currentBabyInfo,contractId:key[0]}});
    }
    render() {
        const {selectGAlist, selectGBlist, form,} = this.props;
        const searchItems:any = [
            {
                label: 'GA',
                name: 'gaStaffId',
                type: 'select',
                options: this.parseOptions(selectGAlist)
            },
            {
                label: 'GB',
                name: 'gbStaffId',
                type: 'select',
                options: this.parseOptions(selectGBlist),
            },
            {
                label: `${'关键字'}`,
                placeholder: '请输入关键字',
                name: 'key',
                type: 'text',
            },
            {
                label: '手机号',
                placeholder: '请输入11位手机号',
                name: 'phone',
                type: 'text',
            },

        ];
        /* todo 中心设置的启用GA选项暂时取消，这里注释掉，等以后再根据实际情况看是否需要
        if (!enabledGa) {
            searchItems.splice(0, 1);
        }*/
        const {dataObj,contractData} = this.state;
        return (
            <div className="gym-teaching-schedule-choose-baby">
                <PageTitle title={`选择宝宝`}/>
                <SearchForm form={form} items={searchItems} onSearch={this.handleSearch}/>
                <TablePagination
                    columns={this.columns}
                    rowKey={`babyId`}
                    dataSource={dataObj.list}
                    handleChangePage={this.handlePageChange}
                    totalSize={dataObj.totalSize}
                    pageNo={dataObj.pageNo}
                    pageSize={dataObj.pageSize}
                />
                <ListModal
                    visible={this.state.showContract}
                    destroyOnClose={true}
                    maskClosable={true}
                    handleOk={this.handleContractOk}
                    handleCancel={this.handleContractCancel}
                    okText={`确认`}
                    cancelText={`取消`}
                >
                    <ChooseContract dataSource={contractData} onKeyChange={this.getSelectedKey}/>
                </ListModal>

            </div>
        )
    }
}

export {ChooseBaby}
