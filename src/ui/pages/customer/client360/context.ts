import React from 'react';

export const Client360Context = React.createContext({
  leadsId:'',
  basicInfo:{},
  showModal: ()=>{},
  pageRefresh: ()=>{},
  status:''
});
