/**
 * desc: 导出按钮
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/7/11
 * Time: 下午4:17
 */
import  React, {Component, Fragment} from "react";
import {User} from "@/common/beans/user";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Modal} from 'antd'
import {PageTitle} from "@/ui/component/pageTitle";
import {searchConditionMap} from "@/ui/pages/customer/clientCenter/enum";
import {TextArea} from "@/ui/component/input";
import {
    navConfig, intentionLevel, birthdayMonthList, genderList,
    appearanceType, channelTypeList, assignSource
} from "@/ui/pages/customer/enum/assign";
import moment from 'moment';

class ExportButton extends Component<any, any>{
    state = {
        exportFlag: false,
        approvalReason: '',
        searchCondition: {},
    };
    /**
     * 弹出导出弹层
     */
    showExport = () => {
        const {searchComponent} = this.props;
        this.setState({
            exportFlag: true,
            searchCondition:searchComponent.search()
        })
    };
    /**
     * 关闭导出弹层
     */
    close = () => {
        this.setState({
            exportFlag: false,
            searchCondition:{}

        })
    };
    /**
     * 渲染查询条件
     * @param {Array<any>} arr
     */
    renderSearch = (obj:any) => {
        let result = [];
        const {gaList, gbList, promotorList, tmkList, packageList} = this.props;
        for(let key in obj){
            // 如果值为零，或者空字符串，或者存在
            if(obj[key] || obj[key] === '' || obj[key] === 0){
                const dateArr = [
                    'birthdayBegin', 'firstInquireDateBegin', 'lastInquireDateBegin',
                    'createDateBegin', 'lastRecycleTimeBegin', 'lastDistributeTimeBegin', 'lastReceiveTimeBegin',
                    'firstContactTimeBegin', 'lastContactTimeBegin', 'appTimeBegin', 'oppTimeBegin', 'lastVisitTimeBegin',
                    'toVisitTimeBegin', 'lastPreviewTimeBegin', 'lastAssessTimeBegin',
                    'firstFinacialTimeBegin', 'contractExpireTimeBegin','birthdayEnd', 'firstInquireDateEnd', 'lastInquireDateEnd',
                    'createDateEnd', 'lastRecycleTimeEnd', 'lastDistributeTimeEnd', 'lastReceiveTimeEnd',
                    'firstContactTimeEnd', 'lastContactTimeEnd', 'appTimeEnd', 'oppTimeEnd', 'lastVisitTimeEnd',
                    'toVisitTimeEnd', 'lastPreviewTimeEnd', 'lastAssessTimeEnd',
                    'firstFinacialTimeEnd', 'contractExpireTimeEnd', 'recycleCause'
                ];
                let k = searchConditionMap[key];
                let v;
                // 特殊值格式化
                switch (key){
                    case 'ga':
                        let ga = [
                            {staffId:'', englishName: 'ALL', chineseName: ''},
                            {staffId:'toAllocate', englishName: '未分配', chineseName: ''},
                            ...gaList].filter(item => item.staffId === obj[key])[0];
                        v = ga ? `${ga.englishName} ${ga.chineseName}` : null;
                        break;
                    case 'gb':
                        let gb = [
                            {staffId:'', englishName: 'ALL', chineseName: ''},
                            {staffId:'toAllocate', englishName: '未分配', chineseName: ''},
                            ...gbList
                        ].filter(item => item.staffId === obj[key])[0];
                        v = gb ? `${gb.englishName} ${gb.chineseName}` : null;
                        break;
                    case 'phase':
                        let phase = navConfig.filter((item:any) => obj[key].includes(item.phaseId)).map(item => item.title);
                        v = phase.join(',');
                        break;
                    case 'promotor':
                        let promotor = promotorList.filter(item => item.promotorId === obj[key])[0];
                        v = promotor ? promotor.promotorName : null;
                        break;
                    case 'tmk':
                        let tmk = tmkList.filter(item => item.staffId === obj[key])[0];
                        v = tmk ? `${tmk.englishName} ${tmk.chineseName}` : null;
                        break;
                    case 'lastGb':
                        let lastGb = gbList.filter(item => item.staffId === obj[key])[0];
                        v = lastGb ? `${lastGb.englishName} ${lastGb.chineseName}` : null;
                        break;
                    case 'intentionLevel':
                        let intention = intentionLevel.filter((item:any) => obj[key].includes(item.code))[0];
                        v = intention ? intention.name : null
                        break;
                    case 'birthdayMonth':
                        let birthdayMonth = birthdayMonthList.filter(item => item.postCode === obj[key])[0];
                        v = birthdayMonth ? birthdayMonth.postName : null;
                        break;
                    case 'gender':
                        let gender = genderList.filter(item => item.postCode === obj[key])[0];
                        v = gender ? gender.postName : null;
                        break;
                    case 'appearanceType':
                        let appearance = appearanceType.filter((item:any) => obj[key].includes(item.value)).map(item => item.label);
                        v = appearance.join(',')
                        break;
                    case 'channelType':
                        let channel = channelTypeList.filter((item:any) => obj[key].includes(item.value)).map(item => item.label);
                        v = channel.join(',')
                        break;
                    case 'toAllocateSource':
                        let source = assignSource.filter(item => item.value === obj[key])[0];
                        v = source ? source.name : null;
                        break;
                    case 'packageId':
                        let pkg = packageList.filter(item => item.id === obj[key])[0];
                        v = pkg ? pkg.packageName : null;
                        break;
                    case 'isIntoRecycle':
                        let option = [
                            {postCode:'', postName:'ALL'},
                            {postCode:0, postName:'否'},
                            {postCode:1, postName:'是'}
                            ].filter(item => item.postCode === obj[key])[0];
                        v = option ? option.postName : null;
                        break;
                    default:
                        v = obj[key];
                }
                // 时间值格式化
                if(dateArr.includes(key)){
                    v = moment(obj[key]).format('YYYY-MM-DD')
                }
                result.push(`${k}:${v}`)
            }
        }
        return result.join('，')
    };
    handleExport = () => {
        const {searchCondition} = this.state;
        this.props.emitExport(this.state.approvalReason, this.renderSearch(searchCondition));
        this.setState({exportFlag: false})
    };
    /**
     *
     * @param e
     */
    handleChange = (e) => {
        this.setState({approvalReason: e.target.value})
    };
    render(){
        const {selectedDataFieldList} = this.props;
        const {exportFlag, approvalReason, searchCondition} = this.state;
        return (
            <Fragment>
                <button className='gym-button-xs gym-button-default mr25' onClick={this.showExport}>导出</button>
                <Modal
                    visible={exportFlag}
                    onCancel={this.close}
                    footer={false}

                >
                    <PageTitle title='申请导出'/>
                    <div className='gym-client-center-export-modal-item'>
                        <div><span className='c333'>中文名：</span>{User.chineseName}</div>
                        <div><span className='c333'>英文名：</span>{User.englishName}</div>
                        <div><span className='c333'>角色：</span>{CommonUtils.cutstr((User.roleName || []).join('/'), 10)}</div>
                    </div>
                    <div className='gym-client-center-export-modal-item'>
                        <div><span className='c333'>申请事项：</span>数据导出</div>
                    </div>
                    <div className='gym-client-center-export-modal-item'>
                        <div>
                            <span className='c333'>查询条件：</span>
                            <span>{this.renderSearch(searchCondition)}</span>
                        </div>
                    </div>
                    <div className='gym-client-center-export-modal-item'>
                        <div><span className='c333'>涉及中心（1）：</span>{User.centerCode}-{User.currentCenterName}</div>
                    </div>
                    <div className='gym-client-center-export-modal-item block'>
                        <div><span className='c333'>导出字段：</span></div>
                        <div>{selectedDataFieldList}</div>
                    </div>
                    <div className='gym-client-center-export-modal-item block'>
                        <div><span className='c-error'>*</span>请填写申请理由</div>
                        <TextArea value={approvalReason} onChange={this.handleChange}/>
                    </div>
                    <div className='text-c'>
                        <button className='gym-button-xs gym-button-default' onClick={this.handleExport}>确定</button>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}

export {ExportButton}
