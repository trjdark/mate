/**
 * desc: 客户中心（新）
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/1/18
 * Time: 下午2:19
 */
import  React, {Component, Fragment} from "react";
import {Link} from 'react-router-dom';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchDiv} from "@/ui/pages/customer/clientCenter/part/searchDiv";
import {DateField} from "@/ui/pages/customer/clientCenter/part/dateField";
import './style/index.scss';
import {User} from "@/common/beans/user";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {TableDiv} from "@/ui/pages/customer/clientCenter/part/tableDiv";
import {
    getClientCenterQuery, exportClientCenterQuery, getCurrentCenterBingTmkAndHtmk,
    getClientCenterQuickQuery, newAssignLeadsToGAGB, newReceiveLeads, newReturnLeads,
    newTransToTmk, newRecycleLeads, newTransToCenter
} from "@redux-actions/customer/assignActions";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Message} from "@/ui/component/message/message";
import {dateFields} from "@/ui/pages/customer/clientCenter/enum";
import moment from "moment";
import {Routes} from "@/router/enum/routes";
import {ExportButton} from "@/ui/pages/customer/clientCenter/part/exportButton";
import {
    getValidPromotorInCurrentCenter, getQueryPhaseNums, getPhaseNums
} from "@redux-actions/client360";
import {getCourseListByCourseType} from "@redux-actions/contract";
import {ActionButton} from "@/ui/pages/customer/clientCenter/part/actionButton";
import {Modal} from "@/ui/component/customerCreateModal";
import {recordTelephoneMembers} from "@redux-actions/telephone/callLeads";




const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）']);
const gbOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ["GB","HGB"]
    }
    :{
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GB","HGB"]
    };
const gaOption = isPostTransRole
    ? {
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        roleList: ["GA","HGA"]
    }
    :{
        leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
        postName: ["GA","HGA"]
    };


@connect((state) => ({
    gbList: selectTotalEmployeeList(state, gbOption),
    gaList: selectTotalEmployeeList(state, gaOption),

}))
class ClientCenter extends Component <any, any> {
    search:any = React.createRef();
    private routes: Array<any> = [
        {name: '客户', path: '', link: '#',},
        {name: '客户信息管理', path: '', link: '#',},
        {name: '客户搜索', path: '', link: '#',}
    ];
    private defaultDateField = ['monthValue', 'phase', 'appearanceType', 'channelType', 'lastInquireDate', 'lastContactTime', 'ga', 'gb'];
    private mustField = ['babyName', 'nickname'];
    private type:string = null;
    private value: string = null;
    constructor(props){
        super(props);
        if(CommonUtils.hasParams(props)){
            const {type, value} = CommonUtils.parse(props);
            this.type = type;
            this.value = value;
        }
        this.state = {
            selectedDataField: [...this.defaultDateField],
            query: {},
            searchType: this.type ? true : false, // 搜索类型 true:快速搜索；false:普通搜索
            pageNo: 1,
            pageSize: 10,
            totalSize: 0,
            dataSource: [],
            errorLeads: [],                   // 报错leads
            searchCondition: {},              // 查询条件
            sortName: '',                     // 排序字段
            sortOrder: '',                    // 降序升序
            promotorList: [],                 // promotor列表
            tmkList: [],                      // tmk列表
            packageList: [],                  // 课程包列表
            leadsNum: [],                     // leads阶段数量
            selectedRowKeys: [],
            reShowLeadsAssign: false,
            role: '',
            showCallModal: false,             // 批量外呼弹层开关
            callList: []

        }
    }
    componentDidMount(){
        const param = {currentCenterId: User.currentCenterId};
        Promise.all([
            getValidPromotorInCurrentCenter(param),
            getCurrentCenterBingTmkAndHtmk(param),
            getCourseListByCourseType(param),
        ]).then((res) => {
            this.setState({
                promotorList: res[0],
                tmkList: res[1],
                packageList: res[2]
            })
        });
        // 如果有参数，则搜索
        if(this.type && this.value){
            this.handleQuickSearch()
        }
    }
    /**
     * 查看
     */
    handleSearch = () => {
        this.setState({
            pageNo: 1,
            query: this.search.search(),
            searchType: false,
            errorLeads: [],
        }, this.queryDate);
    };
    /**
     * 快速查询
     */
    handleQuickSearch = () => {
        const query = this.search.search();
        if(query.babyName || query.phoneNumber || query.contactName){
            this.setState({
                pageNo: 1,
                query: this.search.search(),
                searchType: true,
                errorLeads: [],
            }, this.queryDate);
        }else{
            this.search.error(['babyName', 'phoneNumber', 'contactName']);
            Message.error('如需进行快捷查询，宝宝名、手机号、联系人至少一项需为必填', 3)
        }
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState(pageInfo, () => {
            this.queryDate()
        })
    };
    /**
     * 排序
     * @param name
     * @param order
     */
    handleSort = (name, order) => {
        this.setState({
            sortName: name,
            sortOrder: order
        }, () => {
            this.queryDate()
        })
    };
    /**
     * 提交结果
     * @param param
     */
    queryDate = () => {
        const {
            pageNo, pageSize, selectedDataField, query, sortName, sortOrder,
            searchType
        } = this.state;

        const param = Object.assign({}, {query: query}, {
            currentCenterId: User.currentCenterId,
            pageNo, pageSize,
            sortName,
            sortOrder: sortOrder === 'descend' ? 'desc' : sortOrder === 'ascend' ? 'asc' : ''
        });

        const params = Object.assign({}, param, {columns: [...this.mustField, ...selectedDataField]});
        // 如果type为真则快速搜索，如果为假则标准搜索
        if(searchType){
            getClientCenterQuickQuery(params).then((res) => {
                this.setState({
                    dataSource: res.list,
                    // totalSize: res.totalSize,
                    selectedRowKeys: []
                })
            })
        }else{
            getClientCenterQuery(params).then((res) => {
                this.setState({
                    dataSource: res.list,
                    // totalSize: res.totalSize,
                    selectedRowKeys: []

                })
            })
        }
        this.queryPhaseNum();

    };
    /**
     * 获取各个阶段leads数量
     */
    queryPhaseNum = () => {
        const {searchType} = this.state;
        const query = this.search.search();
        // Todo
        const param = {currentCenterId:User.currentCenterId, query};
        if(searchType){
            getQueryPhaseNums(param).then(res => {this.setState({
                leadsNum: res,
                totalSize: res.total,

            })});
        }else{
            getPhaseNums(param).then(res => {this.setState({
                leadsNum: res,
                totalSize: res.total,

            })});
        }
    };
    /**
     * 改变数据项查询
     * @param fields
     */
    selectDateField = (fields) => {
        this.setState({selectedDataField:fields})
    };

    /**
     * 关闭批量外呼弹层
     */
    close = () => {
        this.setState({showCallModal: false})
    };
    jumpCall = () => {
        const leadsIdList = this.state.callList;
        if(leadsIdList.length > 0){
            recordTelephoneMembers(this.state.callList);
            window.open(Routes.语音拨打.path, 'call');
        }
        this.close();
    };
    /**
     *
     * @param e
     */
    handleChange = (e) => {
        this.setState({approvalReason: e.target.value})
    };
    /**
     * 导出
     */
    handleExport = (str:string, selectParams:string) => {
        const {selectedDataField} = this.state;
        if(!str){
            Message.warning('请填写申请理由');
            return ;
        }
        const param = Object.assign({}, {requestParams: {query: this.search.search()}}, {
            currentCenterId: User.currentCenterId,
            columns: [...this.mustField, ...selectedDataField],
            approvalReason: str,
            selectParams:selectParams
        });
        exportClientCenterQuery(param).then((res) => {
            Message.success("提交审核通过后请前往“单中心报表--其他—下载已审批导出报表”页面进行查看和下载", 10)
            this.setState({approvalReason: '', exportFlag: false})
        }, () => {
            this.setState({approvalReason: '', exportFlag: false})
        })
    };
    /**
     * 字段转换位
     * @param {Array<any>} arr
     */
    selectDateFieldName = (arr:Array<any>) => {
        const result = [
            {label: '宝宝名', dataIndex: 'babyName'},
            {label: '昵称', dataIndex: 'nickname'},
            ...dateFields()
        ].filter((item) => arr.includes(item.dataIndex)).map(item => item.label);
        return result;
    };
    /**
     * 多选
     * @param arr
     */
    selectKeys = (arr) => {
        this.setState({selectedRowKeys: arr});
    };
    /**
     * leads操作
     */
    handleAction = (param:any, type:string) => {
        const arg = Object.assign({}, param, {currentCenterId:User.currentCenterId})
        switch (type){
            case 'gb':
            case 'ga':
                newAssignLeadsToGAGB(arg).then(res => {
                    const {failLeads, successNum} = res;
                    successNum > 0 && Message.success('分配成功');
                    this.queryDate();
                    this.setState({errorLeads:failLeads})
                });
                break;
            case 'receive':
                newReceiveLeads(arg).then(res => {
                    const {failLeads, successNum} = res;
                    successNum > 0 && Message.success('领取成功');
                    this.queryDate();
                    this.setState({errorLeads:failLeads})
                });
                break;
            case 'return':
                newReturnLeads(arg).then(res => {
                    const {failLeads, successNum} = res;
                    successNum > 0 && Message.success('操作成功');
                    this.queryDate();
                    this.setState({errorLeads:failLeads})
                });
                break;
            case 'recycle':
                newRecycleLeads(arg).then(res => {
                    const {failLeads, successNum} = res;
                    successNum > 0 && Message.success('操作成功');
                    this.queryDate();
                    this.setState({errorLeads:failLeads})
                });
                break;
            case 'call':
                const {dataSource} = this.state;
                const callPhases = ['已领取', '已联络', '诺访', '已到访', '新会员', '老会员', '待续会员', '历史会员'];
                let errList = [], callList = []
                for(let i = 0, l = dataSource.length; i < l; i++){
                    if(param.includes(dataSource[i].leadsId)){
                        if(callPhases.includes(dataSource[i].phase)){
                            callList.push(dataSource[i].leadsId)
                        }else{
                            errList.push({leadsId:dataSource[i].leadsId,cause: '待分配、已分配和回收站Leads无法批量外呼！'})
                        }
                    }
                }
                this.setState({errorLeads: errList, callList: callList, showCallModal:true});
                break;
            case 'center':
                newTransToCenter(arg).then(res => {
                    const {failLeads, successNum} = res;
                    successNum > 0 && Message.success('操作成功');
                    this.queryDate();
                    this.setState({errorLeads:failLeads})
                });
                break;
            case 'tmk':
                newTransToTmk(arg).then(res => {
                    const {failLeads, successNum} = res;
                    successNum > 0 && Message.success('操作成功');
                    this.queryDate();
                    this.setState({errorLeads:failLeads})
                });
                break;
        }
    };
    render(){
        const {gaList, gbList} = this.props;
        const {
            pageNo, pageSize, totalSize, dataSource, errorLeads, selectedDataField,
            sortName, sortOrder, promotorList, tmkList, packageList, leadsNum,
            selectedRowKeys, showCallModal, callList
        } = this.state;

        return (
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className='text-r'>
                    功能需求反馈请邮件：<span className='cDefault'>mate.report@gymboglobal.com</span>，
                    本页使用说明请点击上方<span className='cDefault'>【帮助】</span>
                </div>

                <div className='page-wrap gym-client-center no-padding'>
                    <SearchDiv
                        gaList={gaList}
                        gbList={gbList}
                        promotorList={promotorList}
                        tmkList={tmkList}
                        packageList={packageList}
                        wrappedComponentRef={(inst) => this.search = inst}
                        type={this.type}
                        value={this.value}
                        phaseNum={leadsNum}
                    />
                    <DateField
                        defaultSelect={this.defaultDateField}
                        selectedDateField={selectedDataField}
                        emitCheckData={this.selectDateField}
                    />
                    <div className='flex flex-jc-end flex-ai-center pb15 pt15 pr15'>
                        <button className='gym-button-xs gym-button-blue mr25' onClick={this.handleQuickSearch}>快捷查询</button>
                        <button className='gym-button-xs gym-button-default mr25' onClick={this.handleSearch}>查询</button>
                        <ExportButton
                            gaList={gaList}
                            gbList={gbList}
                            promotorList={promotorList}
                            tmkList={tmkList}
                            packageList={packageList}
                            searchComponent={this.search}
                            selectedDataFieldList={this.selectDateFieldName([...this.mustField, ...selectedDataField]).join('，')}
                            emitExport={this.handleExport}
                        />
                        <div>
                            <p>使用技巧：</p>
                            <p>1.【快捷查询】能搜索全中心范围的信息，在搜索时宝宝名、手机号、联系人至少一项需为必填</p>
                            <p>2.查看报表导出的申请进度，请点击：<Link to={Routes.查看报表导出审批进度.path}>待审批的报表导出</Link></p>
                        </div>
                    </div>
                </div>
                <div className='page-wrap'>
                    <ActionButton
                        selectedRowKeys={selectedRowKeys}
                        emitAction={this.handleAction}
                    />
                    <TableDiv
                        errorLeads={errorLeads}
                        selectedColumns={selectedDataField}
                        emitChangePage={this.handleChangePage}
                        emitSort={this.handleSort}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        totalSize={totalSize}
                        dataSource={dataSource}
                        sortName={sortName}
                        sortOrder={sortOrder}
                        rowKey='leadsId'
                        selectedRowKeys={selectedRowKeys}
                        emitSelectRowKeys={this.selectKeys}
                    />
                </div>
                <Modal
                    visible={showCallModal}
                    handleOk={this.jumpCall}
                    handleCancel={this.close}
                    contentTitle={`注意：待分配、已分配和回收站Leads无法批量外呼`}
                    contentText={`已选择${errorLeads.length + callList.length}个Leads，将操作${callList.length}个Leads`}
                />
            </Fragment>
        )
    }
}

export {ClientCenter}
