/**
 * Desc: 选课 route
 * User: dave.zhang
 */
 import React from 'react';
 import {Switch} from 'react-router-dom';
import {Routes} from "@/router/enum/routes";
 import {AuthorizedRoute} from "@/router/authorizedRoute";
 import './style/index';

 class TeachingSelectionNew extends React.Component<any, any>{
   render(){
       return(
         <Switch>
             <AuthorizedRoute {...Routes.选择固定课表新}/>
             <AuthorizedRoute {...Routes.提交预定新}/>
             <AuthorizedRoute {...Routes.提交试听新}/>
         </Switch>
       )
   }
 }

 export {TeachingSelectionNew}
