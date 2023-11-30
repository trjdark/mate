/**
 * desc: 升班报告详情表格
 * User: Katarina.Yuan
 * Date: 2021/7/27
 * Time: 10:00
 */
import React from 'react';
import '../style/detail.scss'

declare interface PromotionReportTableProps {
    comments:Array<any>,
    title: number, // 优势项/潜力项
}
class PromotionReportTable extends React.Component<PromotionReportTableProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            tableTitle: '',
            tableTitleStyle: '',
        }
    }
    render(){
        const {comments, title} = this.props
        let tableTitle = ''
        let tableTitleStyle = ''
        //  标题
        const m = new Map([
             ["1",'优势项'],
             ["2",'潜力项'],
             ["3",'待发展项'],
        ])
        // 标题样式
        const tableStyle = new Map([
             ["1", 'dark'],
             ["2", 'blue'],
             ["3", 'wBlue'],
        ])
        if (title) {
            tableTitle = m.get(title.toString())
            tableTitleStyle = tableStyle.get(title.toString())
        }
        return(
            <div className='gym-promotion-detail-table'>
                <div className={`gym-promotion-detail-table-head gym-promotion-detail-table-head-${tableTitleStyle}`}>
                    <div className="gym-promotion-detail-table-head-title">{tableTitle}</div>
                    <div className="gym-promotion-detail-table-head-item gym-promotion-detail-center">本阶段发展目标</div>
                    <div className="gym-promotion-detail-table-head-item gym-promotion-detail-center">与上阶段相比的发展点</div>
                    <div className="gym-promotion-detail-table-head-item gym-promotion-detail-center">评语</div>
                    <div className="gym-promotion-detail-table-head-item gym-promotion-detail-center">建议</div>
                </div>
                {
                    (comments || []).map((projectItem, index:number) => (
                        <div key={`projec_${index}`} className='gym-promotion-detail-table-project'>
                            <div className='gym-promotion-detail-table-project-title'>
                                {/*优势项*/}
                                {projectItem.domainInfo}
                            </div>
                            {/*本阶段发展目标*/}
                            <div className='gym-promotion-detail-table-project-item'>
                                {projectItem.target}
                            </div>
                            {/*与上阶段相比的发展点*/}
                            <div className='gym-promotion-detail-table-project-item'>
                                {projectItem.compare}
                            </div>
                            {/*评语*/}
                            <div className='gym-promotion-detail-table-project-item'>
                                {projectItem.comment}
                            </div>
                            {/*建议*/}
                            <div className='gym-promotion-detail-table-project-item'>
                                {projectItem.suggest}
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
}

export {PromotionReportTable}
