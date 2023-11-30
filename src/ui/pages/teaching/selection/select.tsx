/**
 * Desc: 选课
 * User: dave.zhang
 */
import React from 'react'
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Search} from './part/search';
import {CourseTable} from './part/table';
import {Provider} from './context';
import {SelectedCourse} from './part/selected';
import {CommonUtils} from '@/common/utils/commonUtils'
import history from '@/router/history';
import {TeachingRoutes} from '@/router/enum/teachingRoutes';
import {connect} from "@/common/decorator/connect";
import {submitSelectionToReservation} from '@redux-actions/teaching/chooseLesson';
import {cloneDeep} from 'lodash';

// 定义课程表结构,横向是从周一到周日，纵向是时间
const tableList = {
    '07': [[], [], [], [], [], [], []],
    '08': [[], [], [], [], [], [], []],
    '09': [[], [], [], [], [], [], []],
    '10': [[], [], [], [], [], [], []],
    '11': [[], [], [], [], [], [], []],
    '12': [[], [], [], [], [], [], []],
    '13': [[], [], [], [], [], [], []],
    '14': [[], [], [], [], [], [], []],
    '15': [[], [], [], [], [], [], []],
    '16': [[], [], [], [], [], [], []],
    '17': [[], [], [], [], [], [], []],
    '18': [[], [], [], [], [], [], []],
    '19': [[], [], [], [], [], [], []],
    '20': [[], [], [], [], [], [], []],
    '21': [[], [], [], [], [], [], []],
};

// 时间列表，只有在此列表内时间段才能排课程，主要用于兼容老数据，避免报错
const startList = Object.keys(tableList);

@connect(state => ({}), {submitSelectionToReservation})
class CourseSelection extends React.Component<any, any> {
    constructor(props) {
        super(props);
        const {hasContract, currBabyInfo, leadsId} = CommonUtils.parse(this.props);
        this.state = {
            crumb: [
                {name: '客户360', path: '', link: '#', id: 'client360'},
                {
                    name: hasContract ? '选课' : '试听',
                    path: '', link: '#', id: 'selection'
                },
            ],
            arrange: {                 // 排课列表
                list: [],
                interval: '',
                weekday: ''
            },
            currIntervalWeek: {},       // 当前选中单元格
            cacheCourseList: [],        // 已选中的课程列表
            currCacheCourse: {},        // 当前点击的课程（标记为高亮显示）
            tableList: tableList,       // 课程表
            babyInfo: currBabyInfo,     // 宝宝信息
            leadsId: leadsId,
            hasContract: hasContract,   // 是否有合同
            currContract: null,         // 当前合同
            promoteType: 0,            // 选课类型
        }
    }

    /**
     * 排课列表
     */
    setArrangement = (arrange) => {
        this.setState({arrange})
    };

    /*
    * 把点击的课程加入到选中的课表列表内
    * @params  course  当前正在操作的课程项
    * */
    addCacheCourse = (course) => {
        this.setState((prevState, prevProps) => {
            let cache = prevState.cacheCourseList;
            let existed = cache.filter(_c => _c.classScheduleId === course.classScheduleId);

            // 当前点击的课程不在已选中的课程列表内，并且已选的课程数小于4，把当前点击的课程加入到选中的课程列表内
            if (cache.length < 4 && existed.length === 0) {
                cache.push(course);
            }

            return {
                cacheCourseList: cache,
                currCacheCourse: course,    // 设置当前点击的课程项
            }
        })
    };

    /*
    * 从选中的课程列表内删除一项
    * @params course 当前正在操作的课程
    * */
    removeCacheCourse = (course) => {
        this.setState((prevState, prevProps) => {
            const cache = prevState.cacheCourseList;
            return {
                cacheCourseList: cache.filter(_c => _c.classScheduleId !== course.classScheduleId)
            }
        })
    };

    /*跳转只提交选课界面*/
    submitSelection = () => {
        const {cacheCourseList, babyInfo, currContract, leadsId, promoteType} = this.state;
        const params = {cacheCourseList, babyInfo, currContract, leadsId, promoteType};

        // 可以走 saga
        history.push(TeachingRoutes.提交预定.link + CommonUtils.stringify(params))
    };

    /*生成课程表*/
    setTableList = ({list, currContract}) => {
        const table = cloneDeep(tableList);  // 先生成一个空的列表
        if (Array.isArray(list) && list.length > 0) {
            list.forEach((course, idx) => {
                let start = course.startTime.split(':')[0];
                // 老数据的保护处理
                if (startList.includes(start)) {
                    table[start][(course.weekDay - 1)].push(course);
                }
            });
        }
        this.setState({
            tableList: table,
            currContract
        });
    };

    /*
    * des: 获取条件查询框内的排课类型的值，后台排课接口添加了这个参数
    * @param: promoteType， 选课类型
    */
    getPromoteType = (promoteType) => {
        this.setState({
            promoteType
        });
    };

    render() {
        const {arrange, currCacheCourse, crumb, babyInfo, leadsId, hasContract, tableList, cacheCourseList} = this.state;
        return (
            <Provider
                value={{
                    setArrangement: this.setArrangement,
                    addCacheCourse: this.addCacheCourse,
                    arrange,
                    currCacheCourse,
                }}
            >
                <BreadCrumb routes={crumb}/>
                <Search
                    setTableList={this.setTableList}
                    babyInfo={babyInfo}
                    leadsId={leadsId}
                    hasContract={hasContract}
                    getPromoteType={this.getPromoteType}
                />
                <CourseTable
                    arrange={arrange}
                    tableList={tableList}
                />
                <SelectedCourse
                    list={cacheCourseList}
                    remove={this.removeCacheCourse}
                    submit={this.submitSelection}
                />
            </Provider>
        )
    }
}

export {CourseSelection}
