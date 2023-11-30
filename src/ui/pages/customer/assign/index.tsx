import * as React from "react";
import Navigation from "../../../component/navigation/index";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {QueryList} from "./part/queryList";
import {AdvancedSearch} from "./part/advancedSearch";
import {
    selectAdvanceButtons,
    selectAssignList,
    selectNavNum
} from "@/saga/selectors/customer/assignSelector";
import {
    downloadLeads,
    getAdanceSearchBtns,
    getAssignList, getAssignStatus, hasLeadsImport
} from "@redux-actions/customer/assignActions";
import {connect} from "@/common/decorator/connect";
import {User} from "@/common/beans/user";
import {StatusTable} from "./routePage/statusTable";
import {CommonUtils} from "@/common/utils/commonUtils";
import {form} from "@/common/decorator/form";
import {Provider} from "@/common/decorator/context";
import {CustomerRoutes} from "@/router/enum/customerRoutes";

const {isInclude} = CommonUtils;
import history from "@/router/history";
import {ListModal} from "@/ui/component/listModal";
import {selectAdvanceButtonId} from "@/saga/selectors/customer/assignSelector";
import {Success} from "@/ui/component/customerCreateModal";
import {commonQlist, navConfig} from "@/ui/pages/customer/enum/assign";
import {Message} from "@/ui/component/message/message";
import {Routes} from "@/router/enum/routes";

@form()
@connect(
    (state) => ({
        advanceBtns: selectAdvanceButtons(state),
        navList: selectNavNum(state),
        dataSource: selectAssignList(state),
        buttonId: selectAdvanceButtonId(state),
    }),
    {getAdanceSearchBtns, getAssignList, getAssignStatus}
)
class AssignCustomer extends React.Component<any, any> {
    routeParams = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props) : {};
    private routes: Array<any> = [
        {
            name: '客户',
            path: '',
            link: '#',
        }, {
            name: '客户信息管理',
            path: '',
            link: '#',
        }, {
            name: '客户中心',
            path: '',
            link: '#',
        }
    ];

    constructor(props) {
        super(props);
        let role = User.role;
        const isGB = isInclude(role, 'GB');
        const isCD = isInclude(role, 'CD');
        const isGA_HGA = isInclude(role, ['GA', 'HGA']);
        let initConfig;
        let condition = {};
        let gbStaffIdList = [];
        let gaStaffIdList = [];
            // dashboard跳转含有：leads状态，出现方式，渠道来源
        if (this.routeParams.queryId || this.routeParams.phaseId || this.routeParams.appearanceType || this.routeParams.channelType) {
            let navIndex,
                phaseId = this.routeParams.phaseId,
                commonQueryId,
                queryId = this.routeParams.queryId,
                customer = {},
                appearanceType = this.routeParams.appearanceType,
                channelType = this.routeParams.channelType,
                postName = this.routeParams.postName,
                staffId = this.routeParams.staffId;
            if (phaseId) {
                navIndex = Number(this.routeParams.phaseId) - 1;
            } else {
                phaseId = "1";
            }
            if (queryId) {
                commonQueryId = `${this.routeParams.queryId}`
            } else {
                commonQueryId = null;
            }
            // 出现方式，渠道来源
            if (appearanceType){
                customer = {appearanceType:[appearanceType]}
            }
            if (channelType){
                customer = Object.assign({}, customer, {channelType:[channelType]})
            }
            // 员工
            if(postName && staffId){
                const post = postName[0];
                if(post === 'GB' || post === "HGB"){
                    gbStaffIdList = [staffId];
                } else if(post === 'GA' || post === "HGA"){
                    gaStaffIdList = [staffId]
                }
            }
            condition = {customer :customer};
            initConfig = {
                navIndex,
                phaseId,
                commonQueryId,
                queryId,
                ...this.getInitQuery(this.routeParams.phaseId)
            };
            setTimeout(() => {
                this.props.history.replace(Routes.分配客户.link);
            });
        } else {
            // GB角色初始化进入已分配，CD进入新会员，HGA/GA新会员，其他角色待分配
            if (isCD) {
                initConfig = {
                    navIndex: 6, phaseId: '7', sortName: 'signTime',
                    sortOrder: 'descend',
                };
            } else if (isGB) {
                initConfig = {
                    navIndex: 1, phaseId: '2', sortName: 'distributeTime',
                    sortOrder: 'descend'
                };
            } else if (isGA_HGA) {
                initConfig = {
                    navIndex: 6, phaseId: '7', sortName: 'signTime',
                    sortOrder: 'descend',
                };
            } else {
                initConfig = {
                    navIndex: 0, phaseId: '1', sortName: 'monthValue',
                    sortOrder: 'ascend',
                };
            }
        }
        this.state = {
            showAdvancedSearch: false,
            reset: false,
            navIndex: initConfig.navIndex,// 待分配，已分配...activeIndex
            advanceQueryIndex: null,// 高级查询高亮index
            advanceQueryId: null,
            // 常用查询高亮index
            commonQueryId: typeof initConfig.commonQueryId === 'string' ? initConfig.commonQueryId : null,
            queryIndex: null,// 高级查询点击index
            clickCondition: {},// 点击的当前condition
            assignLeads: [],// 选中table行leads id Arr
            assignLeadsName: [], // 选中table行 leads Name Arr
            queryName: '',
            selectedRowKeys: '',
            query: {
                currentCenterId: User.currentCenterId,
                condition: condition,// 高级查询详细信息
                gaStaffIdList: gaStaffIdList,
                gbStaffIdList: gbStaffIdList,
                infoType: 'key',
                pageNo: 1,
                pageSize: 10,
                phaseId: initConfig.phaseId,
                queryId: initConfig.queryId || "",
                sortName: initConfig.sortName,
                sortOrder: initConfig.sortOrder,
                phone: ''
            },
        }
    }

    componentDidMount() {
        const {getAdanceSearchBtns} = this.props;
        const params = {currentCenterId: User.currentCenterId};
        getAdanceSearchBtns(params);// 获取高级查询列表
        hasLeadsImport({currentCenterId: User.currentCenterId}).then((res) => {
            if (res instanceof Array && res.length > 0) {
                const content = res.map((item, index) => {
                    return (
                        <p key={index}>{item.centerCode} {item.centerName}给本中心转入了
                            <span className='cDefault'>{item.leadsNum}</span>
                            条leads信息</p>
                    )
                });
                Success({
                    content: (<div>{content}<p className='size18 mt15'>请去待分配中查看</p></div>),
                    okButtonProps: {className: 'gym-button-white-xs'},
                })
            }
        })
    }

    handleClick = (condition, id, name, index) => {// 常用查询，高级查询按钮点击事件(id:按钮ID，name:高级查询按钮名称，index:按钮index)
        const {advanceQueryIndex, commonQueryId} = this.state;
        if (condition === 'advanced') {// '高级查询'按钮
            const query = Object.assign(
                {},
                this.state.query,
                {pageNo: 1, pageSize: 10}
            );
            this.setState({
                showAdvancedSearch: true, query: query,
                queryName: '', queryIndex: null, advanceQueryId: null
            });

        } else if (typeof condition === 'object') {// 高级查询传入查询详细信息
            let settings = {};
            if (advanceQueryIndex === index) {// 清空高级查询条件
                settings = {condition: {}, queryId: ''};
                const query = Object.assign({}, this.state.query, settings, {pageNo: 1, pageSize: 10});
                this.setState({
                    showAdvancedSearch: false, query: query, queryName: '',
                    queryIndex: '', advanceQueryId: '', advanceQueryIndex: ''
                });
                const navParams = {
                    currentCenterId: User.currentCenterId,
                    condition: {},
                    queryId: null,
                };
                this.handleSearch(query, navParams);// 重新查询表格数据
            } else {// 选中高级查询
                settings = {queryId: ''};
                const query = Object.assign({}, this.state.query, settings, {pageNo: 1, pageSize: 10});
                this.setState({
                    showAdvancedSearch: true, query: query, queryName: name,
                    queryIndex: index, advanceQueryId: id, clickCondition: condition
                });
            }

        } else if (!condition) {// 常用查询
            let query = {};
            if (commonQueryId === id) {// 清空常用查询条件
                query = Object.assign(
                    {}, this.state.query,
                    {condition: {}, queryId: ''},
                    {pageNo: 1, pageSize: 10}
                );
                this.setState({query: query, queryName: '', commonQueryId: null, advanceQueryId: null});
            } else {// 选中常用查询
                query = Object.assign(
                    {}, this.state.query,
                    {condition: {}, queryId: id},
                    {pageNo: 1, pageSize: 10}
                );
                this.setState({
                    query: query, queryName: '',
                    commonQueryId: id, advanceQueryIndex: null, advanceQueryId: null
                });
            }

            this.handleSearch(query);
        }
    };
    getInitQuery = (id) => {
        switch (parseInt(id, 10)) {

            case 1: {// 待分配
                return {
                    sortName: 'appearanceType',
                    sortOrder: 'ascend',
                }
            }
            case 2: {// 已分配
                return {
                    sortName: 'appearanceType',
                    sortOrder: 'ascend',
                }
            }
            case 3: {// 已领取
                return {
                    sortName: 'appearanceType',
                    sortOrder: 'ascend',
                }
            }
            case 4: {// 已联络
                return {
                    sortName: "appearanceType",
                    sortOrder: "ascend",
                }
            }
            case 5: {// 诺访
                return {
                    sortName: 'lastContactDate',
                    sortOrder: 'descend',
                }
            }
            case 6: {// 已到访
                return {
                    sortName: 'oppTime',
                    sortOrder: 'descend',
                }
            }
            case 7: {// 新会员
                return {
                    sortName: 'signTime',
                    sortOrder: 'descend',
                }
            }
            case 8: {// 老会员
                return {
                    sortName: 'signTime',
                    sortOrder: 'descend',
                }
            }
            case 9: {// 待续会员
                return {
                    sortName: 'endDate',
                    sortOrder: 'ascend',
                }
            }
            default: {
                return {
                    sortName: '',
                    sortOrder: '',
                }
            }
        }
    };
    changeRoute = (i, id) => {// 点击待分配、已分配....
        // 10 为历史名单
        if (id !== '10') {
            const query = Object.assign(
                {}, this.state.query,
                {
                    phaseId: id,
                    pageNo: 1,
                    pageSize: 10
                },
                this.getInitQuery(id)
            );
            this.setState({query: query});
        } else {// 点击历史名单
            history.push(CustomerRoutes.历史名单.path)
        }

    };

    handleHideSearch = () => {// 隐藏高级搜索弹框,
        this.setState({showAdvancedSearch: false});
    };
    /**
     * 高级搜索确定按钮点击事件
     * @param condition:{}
     * @param isSetAindex:是否自动保存自定义查询
     * @returns {any}
     */
    setCondition = (condition, isSetAindex?) => {
        let {queryIndex} = this.state;
        if (isSetAindex) {
            queryIndex = this.getAdIndex();
        }
        const query = Object.assign({}, this.state.query, {condition: condition, pageNo: 1, pageSize: 10});
        // 隐藏高级搜索弹框,设置查询条件
        this.setState({showAdvancedSearch: false, query: query, advanceQueryIndex: queryIndex, commonQueryId: null});
        const navParams = {
            currentCenterId: User.currentCenterId,
            condition: condition,
            queryId: null,
        };
        this.handleSearch(query, navParams);
    };
    getNavPrams = (params) => {
        return Object.assign({}, params, {currentCenterId: User.currentCenterId,});
    };
    handleSearch = (settings, navParams?) => {// 获取table列表,更新nav数据
        const {getAssignList, getAssignStatus} = this.props;
        if (this.getGaGbList()) {
            const params = Object.assign({}, this.getGaGbList(), settings, );
            getAssignList(params);
            this.setState({åselectedRowKeys: [], assignLeads: [], assignLeadsName: []});// 清空表格选中项
            const navP = navParams || this.getNavPrams(params);
            getAssignStatus(Object.assign({}, this.getGaGbList(), navP));
        } else {
            getAssignList(null);
            getAssignStatus(null);
        }

    };
    refreshData = () => {
        const {getAssignList, getAssignStatus} = this.props;
        getAssignList(this.state.query);
        getAssignStatus(this.getNavPrams(this.state.query));
        this.setState({assignLeads: [], selectedRowKeys: [], assignLeadsName: []});
    };
    /**
     * 导出leads
     * @returns {any}
     *
     *
     */
    downloadLeads = () => {
        const {query} = this.state;
        if (this.getGaGbList()) {
            const params = Object.assign(
                {},
                query,
                this.getGaGbList(),
                {pageNo: null, pageSize: null, infoType: null}
            );
            downloadLeads(params)
        }

    };
    changeInfoType = (id) => {// 点击关键信息，基本信息....按钮
        const query = Object.assign({}, this.state.query, {infoType: id});
        this.setState({query: query});
        this.handleSearch(query);
    };
    getGaGbList = () => {// 获取GA,GB筛选条件
        let gagbForm = {};
        this.props.form.validateFields((err, value) => {
            if (!err) {
                const {phone} = value;
                if (phone) {
                    const phoneReg = /^1[3456789]\d{9}$/;
                    if (!phoneReg.test(phone)) {
                        Message.error('请输入11位数的手机号码');
                        gagbForm = false;
                        return false;
                    }
                }
                gagbForm = {gaStaffIdList: value.GA, gbStaffIdList: value.GB, phone, callType: value.callType}
            }
        });
        return gagbForm;
    };
    handleGaGbSearch = (value) => {// 点击GA/GB 查询按钮
        const query = Object.assign(
            {},
            this.state.query,
            {
                gaStaffIdList: value.GA,
                gbStaffIdList: value.GB,
                phone: value.phone,
                callType: value.callType,
                pageNo: 1
            })
        ;
        this.handleSearch(query);
        this.setState({query: query});

    };
    handlePageChange = (pageInfo) => {
        const query = Object.assign(
            {},
            this.state.query,
            pageInfo
        );
        this.handleSearch(query);
        this.setState({query: query});
    };
    handleTableSort = (sorter) => {// 点击table排序
        const query = Object.assign({}, this.state.query, {
            // 如果是宝宝姓名排序，则变为leads重复排序
            sortName: sorter.field === 'babyName' ? 'rouseFlag' : sorter.field,
            sortOrder: sorter.order,
        });
        this.handleSearch(query);
        this.setState({query});
    };
    handleLeadsArrChange = (keys, names) => {// TABLE行选中事件
        this.setState({assignLeads: keys, selectedRowKeys: keys, assignLeadsName: names});
    };
    /**
     * 得到匹配的高级查询按钮ID对应的INDEX
     * @returns {any}
     */
    getAdIndex = () => {
        const {advanceBtns, buttonId} = this.props;
        let activeIndex = null;
        advanceBtns.map((item, index) => {
            if (item.queryId === buttonId) {
                activeIndex = index;
            }
        });
        return activeIndex;
    };

    render() {
        let {
            showAdvancedSearch, query, queryName, advanceQueryIndex, advanceQueryId, clickCondition,
            commonQueryId, assignLeads, assignLeadsName,
        } = this.state;
        const {gaStaffIdList, gbStaffIdList} = query;
        const {advanceBtns, navList, form} = this.props;
        let commonList;
        // 如果中心包含tmk中心，添加一个标签
        if(User.tmkStatus.status){
            commonList = (commonQlist).map((item:any, index:number) => {
                if(index === 0){
                    return {title: item.title, data: [...item.data, {
                            name:'TMK转leads',
                            queryId:'402'
                        }]}
                }
                return {title: item.title, data: item.data}
            })
        }else{
            commonList = commonQlist;
        }
        const sortedInfo = {
            sortName: query.sortName,
            sortOrder: query.sortOrder,
        };
        navConfig.map((nav: any) => {
            return nav.number = navList[nav.name];
        });
        const providerValue = {callback: this.refreshData, exportLeads: this.downloadLeads};
        return (
            <Provider value={providerValue}>
                <BreadCrumb routes={this.routes}/>
                <div className='flex'>
                    <QueryList
                        activeId={commonQueryId}
                        type='commonQuery'
                        commonList={commonList}
                        onQueryClick={this.handleClick}
                        width={`calc(60% - 10px)`}
                        className='mr20'
                    />
                    <QueryList
                        activeIndex={advanceQueryIndex}
                        type='highQuery'
                        list={advanceBtns}
                        width={`calc(40% - 10px)`}
                        onQueryClick={this.handleClick}
                    />
                </div>
                <Navigation
                    className='mtd20'
                    navList={navConfig.filter(item => item.phaseId !== '0')}
                    activeIndex={this.state.navIndex}
                    onClick={this.changeRoute}
                />
                <StatusTable
                    status={query.phaseId}
                    onSubmitGaGb={this.handleGaGbSearch}
                    onPageChange={this.handlePageChange}
                    onTableSort={this.handleTableSort}
                    sortedInfo={sortedInfo}
                    onLeadsArrChange={this.handleLeadsArrChange}
                    selectedRowKeys={this.state.selectedRowKeys}
                    assignLeads={assignLeads}
                    assignLeadsName={assignLeadsName}
                    form={form}
                    isIncludeTmk={User.tmkStatus.status}
                    onTabClick={this.changeInfoType}
                    defaultGAList={gaStaffIdList}
                    defaultGBList={gbStaffIdList}
                />
                <ListModal
                    visible={showAdvancedSearch}
                    footer={null}
                    destroyOnClose={true}
                    closable={false}
                    maskClosable={true}
                    onCancel={this.handleHideSearch}
                >
                    <AdvancedSearch
                        onSearch={this.setCondition}
                        onHideSearch={this.handleHideSearch}
                        id={advanceQueryId}
                        queryName={queryName}
                        condition={clickCondition}
                    />
                </ListModal>
            </Provider>
        )
    }
}

export default AssignCustomer
