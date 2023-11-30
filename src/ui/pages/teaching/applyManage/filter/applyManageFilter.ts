/**
 * desc: 数据过滤器
 * User: colin.lu
 * Date: 2018/11/21
 * Time: 上午10:00
 */
export const leave_type_format = (reason) => {
    if(reason && reason !== ''){
        const actions = new Map([
            ['29001',"事假"],
            ['29002',"病假"],
            [null,"--"]
        ]);
        return actions.get(reason) || actions.get(null);
    }else {
        return ''
    }
};

export const book_way_format = (reason,isWaiting) => {
    // 0是不等位，1是等位
    if(isWaiting){
        return 'W';
    }
    // 非等位情况，计算排课类型
    if(reason && reason !== ''){
        const actions = new Map([
            ['26001',"R"],
            ['26002',"M"],
            ['26003',"P"],
            [null,"--"]
        ]);
        return actions.get(reason) || actions.get(null);
    }else {
        return ''
    }
};

export const absent_format = (reason) => {
    if(reason && reason !== ''){
        const actions = new Map([
            ['1',"手动"],
            ['2',"系统"],
            [null,"--"]
        ]);
        return actions.get(reason) || actions.get(null);
    }else {
        return ''
    }
};

export const delete_format = (reason) => {
    if(reason && reason !== ''){
        const actions = new Map([
            ['0',"手工"],
            ['1',"周课表删课"],
            ['2',"连续未到自动删课"],
            ['3',"节假日删课"],
            ['4',"课程结束删课"],
            ['5',"超出容量删课"],
            ['6',"合同结束删课"],
            ['7','等位删课'],
            ['8', '等位删课'],
            ['9', '启蒙换课删课'],
            ['10','mate换课删课'],
            [null,"--"]
        ]);
        return actions.get(reason) || actions.get(null);
    }else {
        return ''
    }
};

export const set_color = (reason) => {
    if(reason && reason !== ''){
        const actions = new Map([
            ['L1','L'],
            ['L2','L'],
            ['L3','L'],
            ['L4','L'],
            ['L5','L'],
            ['L6','L'],
            ['L7','L'],
            ['M1','M'],
            ['M2','M'],
            ['M3','M'],
            ['A1','A'],
            ['A2','A'],
            ['A3','A'],
            ['GK','GK'],
            ['DEFAULT','DT'],
            [null,'DT']
        ]);
        return actions.get(reason) || actions.get(null);
    }else {
        return 'DT'
    }
};
