/**
 *Desc: RRP表格
 *User: Debby.Deng
 *Date: 2019/8/27,
 *Time: 2:43 PM
 */
import * as React from "react";
import {item, SearchForm} from "@/ui/component/searchForm";
import {form} from "@/common/decorator/form";
import {TablePagination} from "@/ui/component/tablePagination";
import {rrpQuery} from "@redux-actions/customer/rrp";
import {User} from "@/common/beans/user";

@form()
class RrpList extends React.Component<any, any> {
    STATUS = [
        {
            postCode: "1",
            postName: '是'
        },
        {
            postCode: "0",
            postName: '否'
        },
    ];
    statusMap=(text)=>{
        for(let {postCode,postName} of this.STATUS){
            if(postCode===text){
                return postName;
            }
        }
    };
    searchItems:item[] = [
        {
            label: '绑定RRP',
            name: 'bind',
            type: 'select',
            options: this.STATUS,
            popupContainer: '.gym-content',
        },
    ];
    columns = [
        {title: '宝宝姓名', dataIndex: 'babyName', key: 'babyName', width: 160},
        {title: '月龄', dataIndex: 'babyMonth', key: 'babyMonth'},
        {title: '绑定RRP', dataIndex: 'bind', key: 'bind', render:(text)=>(this.statusMap(text))},
        {title: 'GB', dataIndex: 'gb', key: 'gb'},
        {title: 'GA', dataIndex: 'ga', key: 'ga'},
    ];
    state = {
        pageNo: 1,
        pageSize: 10,
        list: [],
        bind: null,
        totalSize:0,
    };
    request = () => {
        let params = Object.assign({}, {
            bind:this.state.bind,
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize
        });
        rrpQuery({...params,currentCenterId:User.currentCenterId}).then((res)=>{
            this.setState({list:res.list||[],totalSize:res.totalSize});
        });
    };
    handleSearch = () => {
        const {form}=this.props;
        form.validateFields((err,values)=>{
            const {bind}=values;
            this.setState({bind,pageNo:1},this.request)
        })
    };
    handleChangePage = (pageInfo) => {
        this.setState({...pageInfo},this.request);
    };
    componentDidMount(){
        this.request();
    };

    render() {
        const {form} = this.props;
        const {list, pageNo, pageSize, totalSize} = this.state;
        return <div>
            <SearchForm items={this.searchItems} form={form} onSearch={this.handleSearch}/>
            <TablePagination dataSource={list}
                             columns={this.columns}
                             rowKey="id"
                             totalSize={totalSize}
                             handleChangePage={this.handleChangePage}
                             pageNo={pageNo}
                             pageSize={pageSize}
            />
        </div>
    }
}

export {RrpList}
