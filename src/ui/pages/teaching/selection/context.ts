/**
 * Desc: 选课和试听需要用的context
 * User: dave.zhang
 */
import React from 'react'

const {Provider,Consumer} = React.createContext({
  setArrangement:()=>{},
  addCacheCourse:()=>{}
});

const IndexContext = React.createContext({});

export {Provider,Consumer,IndexContext}
