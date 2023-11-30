/**
 * desc: context
 * User: colin.lu
 * Date: 2018/12/29
 * Time: 上午10:00
 */
import React from 'react'

const {Provider,Consumer} = React.createContext({
  setArrangement:()=>{},
  addCacheCourse:()=>{}
})

const IndexContext = React.createContext({})

export {Provider,Consumer,IndexContext}
