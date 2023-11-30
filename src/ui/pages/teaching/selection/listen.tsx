/**
 * Desc: 试听提交选课预定（可删除）
 * User: dave.zhang
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {ReserveRow} from '../component/selectCourseRow';
import {Button,Row,Radio, message } from 'antd';
import {CommonUtils} from '@/common/utils/commonUtils'
import {User} from "@/common/beans/user";import {
  preselectionList,
  previewBookingSave
} from '@redux-actions/teaching/chooseLesson';
import {crowdType} from '../enum/selectCourse';
import moment from 'moment';
import {modalWrapper} from '@/ui/pages/teaching/component/modalWrapper';
import {ReservationContent} from './part/reservationContent';
import history from '@/router/history';
const Modal=modalWrapper(ReservationContent)

class ListenSubmit extends React.Component<any,any>{
  constructor(props){
    super(props);
    const param=CommonUtils.parse(this.props)
    this.state={
      crumb: [
          {name:'客户360',path:'',link:'#',id:'client360'},
          {name:'试听',path:'',link:'#',id:'listen'},
      ],
      leadsId:param.leadsId||'',
      babyInfo:param.babyInfo||{},
      cacheCourseList:param.cacheCourseList||[],

      courseList:[],
      weeklist:[],

      // 提交
      submitVisible:false,
      submitlist:[]
    }
  }

  /**
   * Desc 查询
   * @param {any}
   * @returns {any}
   */
   search = ()=>{
     const {
       babyInfo,
       leadsId,
       cacheCourseList
     }=this.state;

     preselectionList({
       babyId:babyInfo.id,
       classScheduleIdList:cacheCourseList.map(i=>i.classScheduleId),
       currentCenterId:User.currentCenterId,
       leadsId
     }).then(res=>{
       this.setState({
         courseList:this.getCourseList(res),
         weeklist:this.getWeekList(res)
       })
     })
   }

   transWeekday = (str)=>{
     switch (str) {
       case 1:
         return '一';
       case 2:
         return '二';
       case 3:
         return '三';
       case 4:
         return '四';
       case 5:
         return '五';
       case 6:
         return '六';
       case 7:
         return '日';
     }
   }

   getCourseList = (res)=>{
     let {cacheCourseList}=this.state;
     return res.map(course=>{
       let courseMsg = cacheCourseList.filter(_c=>
         _c.classScheduleId===course.classScheduleId
       )[0]
       return {
         name:courseMsg.courseCode,
         date:`周${this.transWeekday(courseMsg.weekDay)}`,
         start:`${courseMsg.startTime}`,
         end:`${courseMsg.endTime}`,
         classroom:courseMsg.classroomName,
         teacher:courseMsg.primaryInsStaffName,
         classScheduleId:courseMsg.classScheduleId
       }
     })
   }

   /**
    * Desc 解析接口数据结构
    * @param {any}
    * @returns {any}
    */
   getWeekList = (list)=>{
     let maxWeek = 1,minWeek = 1;
     list.forEach(course=>{
       course.lessonList.forEach(lesson=>{
         if (lesson.weekIndex) {
           maxWeek = (lesson.weekIndex>maxWeek)?lesson.weekIndex:maxWeek;
           minWeek = (lesson.weekIndex<minWeek)?lesson.weekIndex:minWeek;
         }
       })
     })

     // 取 weekindex 的最大、最小值
     let range = {minWeek,maxWeek},_weeklist = [];

     for (let i=range.minWeek; i<=range.maxWeek; i++) {
       let weekItem = {weekIndex:'第'+this.toChineseNum(i)+'周',list:[]};

       // 遍历课程 list
       list.forEach(course=>{
         let classScheduleId = course.classScheduleId;

         // 匹配出课程周次list中weekIndex为当前周次的项
         let filtered = course.lessonList.filter(lesson=>lesson.weekIndex===i)[0]

         if (filtered) {
           // 时间戳转换
           filtered.date = moment(filtered.date).format('YYYY-MM-DD')

           // 设置各种情况下的 disabled
           if (
             filtered.selected ||
             filtered.isHoliday ||
             filtered.idDeleted===1
           ) {
             filtered.disabled = true;
             filtered.initDisabled = true;
           } else {
             filtered.disabled = false;
             filtered.initDisabled = false;
           }

           // 设置各种情况下的 checked
           if (filtered.selected) {
             filtered.checked=true
           } else {
             filtered.checked=false
           }

           // 处理完数组结构后放入 list
           weekItem.list.push(Object.assign({classScheduleId},filtered))
         } else {
           weekItem.list.push({classScheduleId})
         }
       })
       _weeklist.push(weekItem)
     }
     return _weeklist;
   }

   /**
    * Desc 数字转中文数字
    * @param {any}
    * @returns {any}
    */
   toChineseNum = (num)=>{
       const keys = ["零","一","二","三","四","五","六","七","八","九"];
       const count = ["","十","百","千"];
       var str = "",
           nums = num.toString().split("").reverse();
       nums.map((value, index)=>{
           str = keys[value] +
                 (value == 0 ? "" : count[ index > 3 ? index % 4 : index ]) +
                 (index == 4 ? "万" : "") +
                 str;
       })
       return str.replace(/零(?=零)|零$|零(?=万)/g,"");
   }

   getTagType = (course)=>{
     let color,text;
     if (course.isHoliday) {
       color=crowdType.filter(tp=>tp.value==='holiday')[0].color;
       text=crowdType.filter(tp=>tp.value==='holiday')[0].name;
     } else {
       color=crowdType.filter(tp=>tp.value===course.crowdType)[0].color;
       text=crowdType.filter(tp=>tp.value===course.crowdType)[0].name
     }
     return {color,text}
   }

   /**
    * Desc 提交预定
    * @param {any}
    * @returns {any}
    */
   preSubmit = ()=>{
     let submitlist=[],
         list=this.state.weeklist;

     list.forEach((row,rowIdx)=>{
       let _list=row.list;
       _list.forEach((course,idx)=>{
         let classScheduleId = course.classScheduleId

         // 判断是否要push
         if (
           !course.date||
           course.initDisabled||
           !course.checked
         ) {
           return;
         }

         // 判断 submitlist 中是否有当前遍历课程的 classScheduleId
         let filteredArr=submitlist.filter(col=>
           col.classScheduleId===classScheduleId
         )

         // course 的时间戳
         let courseCopy = Object.assign({},course);
         courseCopy.date=moment(courseCopy.date).valueOf()

         // 有则向list中push课程
         if (filteredArr.length>0) {
           let lessonDetailList=filteredArr[0].lessonDetailList
           lessonDetailList.push(courseCopy)
           submitlist.map(col=>{
             if (col.classScheduleId===courseCopy.classScheduleId) {
               col.lessonDetailList = lessonDetailList;
               return col;
             } else {
               return col;
             }
           })
         // 没有，新增对应的 id 和 list
         } else {
           submitlist.push({classScheduleId,lessonDetailList:[courseCopy]})
         }
       })
     })
     this.setState({submitVisible:true,submitlist})
   }

  onChange = ({weekidx,idx,e})=>{
    let list = this.state.weeklist;
    list.map((week,_weekidx)=>{
      return week.list.map((date,_idx)=>{
        if (weekidx===_weekidx) {
          if (idx===_idx) {
            date.checked = true
            return date
          } else {
            date.checked = false
            return date
          }
        } else {
          return date;
        }
      })
    })
    this.setState({weeklist:list})
  }

  handleOk = ()=>{
    // 提交后返回选课
    previewBookingSave({
      babyId:this.state.babyInfo.id,
      bookLessonList:this.state.submitlist,
      leadsId:this.state.leadsId,
      currentCenterId:User.currentCenterId
    }).then(res=>{
      message.success('选课成功!');
      history.goBack()
    })
  }
  handleCancel = ()=>{
    this.setState({submitVisible:false})
  }

  backToSelection = ()=>{
    history.goBack()
  }
  componentDidMount () {
    this.search()
  }
  render(){
    const {
      babyInfo,
      submitlist,
      courseList,
      submitVisible
    } = this.state;
    return(
      <React.Fragment>
        <Modal contentTitle="您要为预定的课程信息如下："
               contentText="xxxx"
               handleOk={this.handleOk}
               handleCancel={this.handleCancel}
               visible={submitVisible}
               width={600}
               data={{submitlist:submitlist,courseList:courseList,babyInfo}}
               okButtonProps={submitlist.length>0?{disabled:false}:{disabled:true}}
        />
        <BreadCrumb routes={this.state.crumb} />
        <div className="course-reserve-wrapper">
          <div className="row-title">
            <div className="name">宝宝姓名：张晓晓</div>
            <div className="monthage">月龄：30</div>
          </div>

          <ReserveRow name="课程："
                      render={()=>(
                        <div className="course col4flex">
                          {
                            courseList.map((course,idx)=>
                              <div className="checkboxWrapper " key={idx}>
                                  <div className="course-msg-wrapper">
                                    <p>{course.name}</p>
                                    <p>{course.date}&nbsp;{course.start}-{course.end}</p>
                                    <p>{course.classroom}&nbsp;{course.teacher}</p>
                                  </div>
                              </div>
                            )
                          }
                        </div>
                      )}
          />

          {
            this.state.weeklist.map((week,weekidx)=>
              <ReserveRow name={week.weekIndex+"："}
                          key={weekidx}
                          render={()=>(
                            <div className="course col4flex">
                              {
                                week.list.map((course,idx)=>
                                  <div className="checkboxWrapper" key={idx}>
                                    {
                                      course.date?(
                                        <Radio checked={course.checked}
                                               disabled={course.disabled}
                                               onChange={(e)=>{this.onChange({weekidx,idx,e})}}
                                        >
                                          <div className="checkboxContent">
                                            <span>{course.date}</span>
                                            <span className="status"
                                                  style={{
                                    backgroundColor:this.getTagType(course)['color']
                                                  }}
                                            >
                                              {this.getTagType(course)['text']}
                                            </span>
                                          </div>
                                        </Radio>
                                      ):(null)
                                    }
                                  </div>
                                )
                              }
                            </div>
                          )}
              />
            )
          }

          <br/>
          <Row type="flex" justify="center">
            <div className="btn-wrapper">
              <Button type="primary" onClick={this.preSubmit}>提交预定</Button>
              <Button style={{marginLeft:20}} onClick={this.backToSelection}>返回选课</Button>
            </div>
          </Row>
        </div>
      </React.Fragment>
    )
  }
}

export {ListenSubmit}
