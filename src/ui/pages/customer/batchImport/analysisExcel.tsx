/**
 * desc: 解析excel组建
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/11/26
 * Time: 上午10:39
 */
import React  from "react";
import ReactDOM from 'react-dom';
import XLSX from "xlsx";
import {User} from "@/common/beans/user";
import moment from 'moment';

/**
 * 解析excel
 * @param obj
 * @returns {any[]}
 */
const formatExcel = (obj:any) => {
    const map = {
        A: "inquireDate",
        B: "activityCode",
        C: "Promoter",
        D: "childOneName",
        E: "childOneBirth",
        F: "childOneGender",
        G: "contactOneName",
        H: "contactOneFamilyRelation",
        I: "contactOneContactsInfo",
        J: "contactSecName",
        K: "contactSecFamilyRelation",
        L: "contactSecContactsInfo",
        M: "contactOneremark"
    };
    const _obj = {};
    let result = [];
    for(let key in obj){
        const lineNumber = key.substring(1);
        if(Number(lineNumber) === 1 || isNaN(Number(lineNumber))){
            continue;
        }
        const k = key.substring(0, 1);
        let m = {};
        if(map[k] === "childOneBirth" || map[k] === "inquireDate"){
            m[map[k]] = obj[key].w ? moment(obj[key].w).format('YYYY-MM-DD') : "";
        }else if(map[k] === 'childOneGender'){
            m[map[k]] = obj[key].w === "男" ? "1" : "0"
        }else{
            m[map[k]] = obj[key].w ? obj[key].w : " ";
        }
        _obj[lineNumber] = Object.assign({
            inquireDate: '',
            activityCode: '',
            Promoter: '',
            childOneName: '',
            childOneBirth: '',
            childOneGender: '0',
            contactOneName: '',
            contactOneFamilyRelation: '',
            contactOneContactsInfo: '',
            contactSecName: '',
            contactSecFamilyRelation: '',
            contactSecContactsInfo: '',
            contactOneremark: '',
        }, _obj[lineNumber], m);
    }
    for(let key in _obj){
        result.push(Object.assign({}, _obj[key], {lineNumber: Number(key),currentCenterId:User.currentCenterId}))
    }
    return result

};

class AnalysisExcel extends React.Component<any,any> {
    inputFile:any;
    /**
     * 解析excel
     * @param files
     */
    uploadExcel = (obj) => {
        let  reader = new FileReader();
        const files = obj.target.files;
        reader.onload = (e) => {
            const data = e.target.result;
            const wb = XLSX.read(data, {type: 'binary'});
            const params = formatExcel(wb.Sheets[wb.SheetNames[0]]);
            this.props.handleEmit(params, wb.SheetNames[0])

        }
        reader.readAsBinaryString(files[0]);
    }
    handleClick = () => {
        const inputElement:any = ReactDOM.findDOMNode(this.inputFile);
        inputElement.click();
    }
    render(){
        const {centerBusinessStatus} = User.tmkStatus;
        return (
            <div className="gym-customer-batch-import-analysis-excel">
                {
                    centerBusinessStatus
                    ? <button className="gym-button-grey-xs import-btn btn-auto">浏览</button>
                    : <button onClick={this.handleClick} className="gym-button-wBlue-xs import-btn btn-auto">浏览</button>
                }
                <input ref={(ref:any) => this.inputFile = ref} type="file" onChange={this.uploadExcel}/>
            </div>

        )
    }
}

export {AnalysisExcel}
