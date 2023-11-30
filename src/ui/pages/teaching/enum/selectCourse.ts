/**
 * Desc: 选课和试听的枚举值
 * User: dave.zhang
 */

export const promoteType = [
    {
        value: '0',
        name: '正常排课'
    },
    {
        value: '1',
        name: '早升班'
    },
    {
        value: '2',
        name: '晚升班'
    }
];

// 教室拥挤程度
export const crowdType = [
    {
        value: 'empty',
        name: '较空',
        color: '#40C1AC'
    },
    {
        value: 'crowdMore',
        name: '较拥挤',
        color: '#F5A623'
    },
    {
        value: 'crowd',
        name: '拥挤',
        color: '#EF7421'
    },
    {
        value: 'full',
        name: '已满',
        color: '#DA291C'
    },
];

/*课程表课程徽标的枚举值*/
export const courseType = {
    'L': '#EF7421',
    'M': '#009CBD',
    'A': '#40C1AC',
    'GK': '#FFA0BC',
    'DEFAULT': '#DA291C'
};

// 根据不同的课程code设置徽标颜色
export const getCourseType = (code) => {
    const codeFirst = code[0];
    if (codeFirst === 'L' || codeFirst === 'M' || codeFirst === 'A') {
        return courseType[codeFirst];
    }
    if (codeFirst + code[1] === 'GK') {
        return courseType.GK
    }
    return courseType.DEFAULT;
};
