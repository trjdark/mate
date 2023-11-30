import React,{Component,Fragment} from 'react';
import {Input} from "@/ui/component/input";
import {Icon} from "@/ui/component/icon";

class CourseHarvest extends Component<any, any>{
    constructor(props) {
        super(props);
    }
    addInput = () => {
        const {values} = this.props;
        this.props.emitChange([...values, ''])
    }
    changeInput = (e, idx) => {
        const value = e.target.value;
        const {values} = this.props;
        this.props.emitChange( [...values.slice(0, idx), value, ...values.slice(idx + 1)])
    }
    deleteInput = (idx) => {
        const {values} = this.props;
        this.props.emitChange(values.filter((item,index) => index !== idx));

    }

    render(){
        const {values} = this.props;
        return <Fragment>
            <p>课程收获</p>
            {
                (values || []).map((item, idx) => (<div key={`index_${idx}`} className='mb5'>
                    <Input value={item} onChange={(e) => this.changeInput(e, idx)}/>
                    <Icon type='close' className='size18 ml5 c-error' onClick={() => this.deleteInput(idx)}/>
                </div>))
            }
            <button className='gym-button-default gym-button-xxs' onClick={this.addInput}>+</button>
        </Fragment>
    }
}

export {CourseHarvest}
