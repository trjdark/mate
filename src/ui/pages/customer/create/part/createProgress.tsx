/**
 * desc: 创建进度
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/1/4
 * Time: 下午3:02
 */
import React from 'react';
import '../style/createProgress.scss';

declare interface CreateProgressProps {
    step: number,
    textList: Array<any>,
    isEdit?:boolean
    emitClick?:(res:number) => void
}

class CreateProgress extends React.Component <CreateProgressProps,any> {
    handleClick = (step:number) => {
        const {isEdit} = this.props;
        if(!isEdit){
            return;
        }
        this.props.emitClick(step)
    };
    render(){
        const {step, textList} = this.props;
        return(
            <div className="gym-customer-create-progress-bar">
                {
                    textList.map((item, index) => (
                        <div
                            key={`step_${index}`}
                            className={`gym-customer-create-progress-bar-item ${index === step ? 'selected' : ''}`}
                            onClick={() => this.handleClick(index)}
                        >
                            {item}
                        </div>
                    ))
                }
            </div>
        )
    }
}

export {CreateProgress}

