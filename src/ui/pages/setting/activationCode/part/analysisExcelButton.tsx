/**
 * desc: 解析excel组建
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/11/26
 * Time: 上午10:39
 */
import React, {Fragment}  from "react";
import ReactDOM from 'react-dom';
import XLSX from "xlsx";
import {Input} from 'antd';
/**
 * 解析excel
 * @param obj
 * @returns {any[]}
 */
const formatExcel = (obj:any) => {
    const map = {
        A: "exchangeCode",
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
        m[map[k]] = obj[key].w ? obj[key].w.trim() : " ";
        _obj[lineNumber] = Object.assign({
            exchangeCode: '',
        }, _obj[lineNumber], m);
    }
    for(let key in _obj){
        result.push(Object.assign({}, _obj[key], {row: Number(key)}))
    }
    return result

};

class AnalysisExcelButton extends React.Component<any,any> {
    inputFile:any;
    state = {
        body: null,
        valueName: ''
    };
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
            this.setState({
                body:params,
                valueName: files[0].name
            })

        };
        reader.readAsBinaryString(files[0]);
    };
    /**
     * 验证
     */
    handleVerify = () => {
        const {body, valueName} = this.state;
        this.props.handleEmit(body, valueName);
    };
    /**
     * 点击上传
     */
    handleClick = () => {
        const inputElement:any = ReactDOM.findDOMNode(this.inputFile);
        inputElement.click();
    };
    render(){
        const {body, valueName} = this.state;
        return (
            <Fragment>
                <div>
                    <Input disabled style={{ width: 200 }}
                           value={valueName}
                    />
                </div>
                <div className="gym-import-code-analysis">
                    <div className="gym-import-code-analysis-excel">
                        <button onClick={this.handleClick} className="gym-button-wBlue-xs import-btn btn-auto">上传</button>
                        <input ref={(ref:any) => this.inputFile = ref} type="file" onChange={this.uploadExcel} accept=".xlsx"/>
                    </div>
                    <div>
                        <button
                            className={`gym-button-wBlue-xs gym-button-${body ? 'white' : 'grey'}`}
                            disabled={!body}
                            onClick={this.handleVerify}>验证</button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export {AnalysisExcelButton}
