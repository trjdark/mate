/**
 * desc: 礼品添加
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/8
 * Time: 下午2:28
 */
import React from 'react';
import { Form, Input, Button} from "antd";
import {InputNumber} from "../../../../component/input";
import {form} from "../../../../../common/decorator/form";
import {PageTitle} from "../../../../component/pageTitle";
import {Select, Option} from "@/ui/component/select";
import {ListModal} from "@/ui/component/listModal";
import {Icon as MyIcon} from "@/ui/component/icon";

declare interface PrAddButtonProps {
    productList: Array<any>,
    form?:any,
    handleSelect:(res:any) => void,
    giftList?:Array<any>
}

@form()
class PrAddButton extends React.Component<PrAddButtonProps, any>{
    DEFAULT_COUNT:number = 1;
    OTHER_VALUE:string = 'other';
    constructor(props:any){
        super(props)
        this.state = {
            visible: false,
            gifts: [],
            isChangeGifts:false,
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(!prevState.isChangeGifts && nextProps.giftList){
            nextProps.giftList.forEach((item:any) => {
                if(!item.freeGiftCode){
                    item.freeGiftCode = 'other';
                }
            })
            return {
                gifts: nextProps.giftList,
                isChangeGifts: true
            }
        }
        return null;
    }
    /**
     * 现实礼品选择组件
     */
    handleShowSelectPr = () => {
        this.setState({visible: true})
    };
    /**
     * 添加礼品
     */
    addGift = (productId:string) => {
        const {productList} = this.props;
        const {gifts} = this.state;
        let gift;
        if(productId === this.OTHER_VALUE){
            gift = {
                freeGiftId: (new Date()).valueOf(),
                freeGiftCode: this.OTHER_VALUE
            }
        }else{
            let r = productList.filter((item:any) => item.id === productId)[0];
            gift = Object.assign({}, r, {freeGiftId: r.id});
        }
        // 去重
        if(!(gifts || []).map((item:any) => item.freeGiftId).includes(productId)){
            this.setState({gifts:  [...this.state.gifts, gift]})
        }
    };
    /**
     * 删除礼品
     * @param key
     */
    removeGift = (key:any) => {
        const index = this.state.gifts.map((item:any) => item.freeGiftId).indexOf(key);

        this.setState({gifts: [
                ...this.state.gifts.slice(0, index),
                ...this.state.gifts.slice(index + 1)
            ]})
    };
    /**
     * 确认
     */
    sure = () => {
        const {form, productList, handleSelect} = this.props;
        const {gifts} = this.state;

        form.validateFields((err, values) => {
            let result = [];
            (gifts || []).forEach((item:any) => {
                return result = [
                    ...result,
                    item.freeGiftCode === this.OTHER_VALUE
                        ? {
                            freeGiftNum: values[`product_count_${item.freeGiftId}`] || 0,
                            freeGiftName: values[`product_name2_${item.freeGiftId}`],
                            freeGiftPrice: 0,
                            freeGiftId: item.freeGiftId
                        }
                        :   productList.filter((product:any) => product.freeGiftCode === item.freeGiftCode)
                            .map((product:any) => Object.assign({}, product, {
                                freeGiftNum: values[`product_count_${item.freeGiftId}`] || 0,
                                freeGiftId: product.id,
                                freeGiftPrice: product.retailPrice
                            }))[0]

                ]
            });
            handleSelect(result.filter((item:any) => item))
            this.setState({visible: false})
        });

    }
    render(){
        const {visible, gifts} = this.state;
        const {productList, form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div id={`gym-select-pr`} className='gym-select-pr' style={{display: 'inline-block'}}>
                <ListModal
                    visible={visible}
                    closable={true}
                    onCancel={() => this.setState({visible:false})}
                    onOk={() => this.sure()}
                    footer={false}
                    className='gym-contract-product-modal'
                    width={1000}
                >
                    <PageTitle title={`添加PR礼品`}/>
                    <Form className='gym-contract-product-modal-form'>
                        <table className='gym-contract-product-modal-table'>
                            <thead>
                                <tr>
                                    <th className='gym-contract-product-modal-table-type'>
                                        <div style={{width:'75px'}} className='gym-contract-product-modal-table-type-label'>PR礼品：</div>
                                        <Select
                                            showSearch={true}
                                            filterOption={(input, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            className='gym-contract-product-modal-item-select'
                                            onSelect={this.addGift}
                                            getPopupContainer={() => document.querySelector('.gym-contract-product-modal')}
                                        >
                                            {
                                                (productList||[]).map((item:any) => {
                                                        if (item.isEnabled === 1) {
                                                            return (
                                                                <Option
                                                                    key={item.id}
                                                                    value={item.id}
                                                                    title={item.freeGiftName}
                                                                >
                                                                    {item.freeGiftName}
                                                                </Option>
                                                            )
                                                        }
                                                    }
                                                )
                                            }
                                            <Option value={this.OTHER_VALUE}>其他</Option>
                                        </Select>
                                    </th>
                                    <th className='gym-contract-product-modal-table-name'/>
                                    <th className='gym-contract-product-modal-table-num'>数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    gifts.map((item:any, index:number) =>
                                        <tr key={`${item.freeGiftId}`}>
                                            <td className='gym-contract-product-modal-table-type'>
                                                <div style={{width:'75px'}} className='gym-contract-product-modal-table-type-label'>赠品{index + 1}：</div>
                                                <div>{item.freeGiftCode === this.OTHER_VALUE ? '其他' : item.freeGiftName}</div>
                                            </td>
                                            <td>
                                                {
                                                    item.freeGiftCode === this.OTHER_VALUE &&
                                                    getFieldDecorator(`product_name2_${item.freeGiftId}`, {
                                                        initialValue: item.freeGiftName
                                                    })(<Input/>)
                                                }
                                            </td>
                                            <td>
                                                <span>数量：</span>
                                                {
                                                    getFieldDecorator(`product_count_${item.freeGiftId}`,{
                                                        initialValue: item.freeGiftNum || this.DEFAULT_COUNT
                                                    })(
                                                        <InputNumber min={1} className='gym-contract-product-modal-table-input-number'/>
                                                    )
                                                }
                                                <MyIcon type="close" className='gym-contract-product-modal-table-close' onClick={() => this.removeGift(item.freeGiftId)}/>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </Form>
                    <div className='gym-contract-product-modal-buttons'>
                        <button
                            className='gym-button-default gym-button-xs mlr10'
                            onClick={this.sure}
                        >
                            确认
                        </button>
                        <button
                            className='gym-button-white gym-button-xs mlr10'
                            onClick={() => this.setState({visible:false})}>取消</button>
                    </div>
                </ListModal>
                <Button
                    type="primary"
                    shape="circle"
                    htmlType="button"
                    icon="plus"
                    size="small"
                    onClick={this.handleShowSelectPr}
                />
            </div>
        )
    }
}

export {PrAddButton}
