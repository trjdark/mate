/**
 * desc: 员工添加页面select 配置
 * Date: 2018/8/17
 * Time: 上午9:45
 */

const GenderType = [
    {
        key: 'gender_1',
        name: '女',
        value: 0
    },{
        key: 'gender_2',
        name: '男',
        value: 1
    }
];

const DefaultGenderType = 1;

const CardType = [
    {
        key: 'Card_1',
        name: '身份证',
        value: 1
    },{
        key: 'Card_2',
        name: '护照',
        value: 2
    }
];

const DefaultCardType = 1;

const PostStatus = [
    {
        key: 'PostStatus_1',
        name: '正常',
        value: 1
    },{
        key: 'PostStatus_1',
        name: '停用',
        value: 0
    },
];

export {
    GenderType, DefaultGenderType,
    CardType, DefaultCardType,
    PostStatus,
}
