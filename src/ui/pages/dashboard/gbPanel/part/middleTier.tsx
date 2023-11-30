import React from 'react';
import {User} from "@/common/beans/user";
function HocTier(MyComponent, defaultProps) {
    return class extends React.Component<any, any> {
        constructor(props) {
            super(props);
            this.state = {
                data: {
                    pageNo: 1,
                    pageSize: 10,
                    totalSize: 0,
                    dataSource: []
                }
            };
        }
        componentDidMount() {
            this.getContactLeads()
        }

        handleChange = (pageInfo) => {
            this.setState({
                              data:{
                                  pageNo: pageInfo.pageNo,
                                  pageSize: pageInfo.pageSize
                              }
                          },
                          this.getContactLeads)
        }
        getContactLeads = () => {
            const params = {
                currentCenterId: User.currentCenterId,
                staffId: User.userId,
                pageNo: this.state.data.pageNo,
                pageSize: this.state.data.pageSize
            }
            this.props.handleChangePage(params).then(res => {
                this.setState({
                                  data:{
                                      dataSource: res.list,
                                      pageNo: res.pageNo,
                                      pageSize: res.pageSize,
                                      totalSize: res.totalSize,
                                  }
                              })
            })
        }
        render() {
            return <MyComponent data={this.state.data} {...defaultProps} {...this.props} handleChangePage={this.handleChange} />;
        }
    };
}
export default HocTier;
