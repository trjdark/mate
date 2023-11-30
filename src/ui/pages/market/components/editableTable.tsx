/**
 * desc: 市场渠道
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/11/22
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {Table, Input, Form} from 'antd';

const FormItem = Form.Item;     // 表单条目

/*定义一个带有context的row和cell，以便内部可以访问form对象*/
const {Provider, Consumer} = React.createContext();
const EditableRow = ({form, ...props}) => (
    <Provider value={form}>
        <tr {...props}/>
    </Provider>
);
const EditableFormRow = Form.create()(EditableRow);

/*定义EditableCell的props结构*/
interface EditableCellProps {
    editable: boolean,
    dataIndex: string,
    title: string,
    record: any,
    [propName: string]:any
}

class EditableCell extends Component<EditableCellProps, any> {
    render() {
        const {
            editable,
            dataIndex,
            record,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {
                    editable ? (
                        <Consumer>
                            {
                                form => {
                                    return (
                                        <FormItem style={{margin: 0, padding: 0}}>
                                            {
                                                form.getFieldDecorator(dataIndex, {
                                                    initialValue: record[dataIndex],
                                                })(
                                                    <Input/>
                                                )
                                            }
                                        </FormItem>
                                    )
                                }
                            }
                        </Consumer>
                    ) : restProps.children
                }
            </td>
        )
    }
}

/*定义EditableTable的props结构*/
interface EditableTableProps {
    dataSource: any,
    columns:any,
    [propName: string]:any,
}

class EditableTable extends Component<EditableTableProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const {dataSource,columns} = this.props;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell
            }
        };
        const columnsData = columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                })
            }
        });

        return (
            <div>
                <Table
                    components={components}
                    bordered={true}
                    dataSource={dataSource}
                    columns={columnsData}
                    pagination={false}
                />
            </div>
        )
    }
}

export default EditableTable;
