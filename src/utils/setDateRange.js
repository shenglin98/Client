// 开始时间
 export function setDateRange(state,end) {
   const newState = new Date(state);
   const newEnd   = new Date(end); 
   console.log(newState,newEnd,'开始时间'); 
   if(newState > newEnd )   return {state:newState,end:newEnd,msg:'超出范围'};
   else  return {state:newState,end:newEnd,msg:'正常范围'};
 }
 