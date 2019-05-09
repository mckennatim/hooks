import axios from 'axios';
import {ls,cfg} from '../utilities/getCfg'
import {geta} from '../utilities/wfuncs'


const fetchDevZones=()=>{
  var lsh = ls.getItem()
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/admin/i/devzones'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token']},
      method: 'GET'
    }  
    return(
      fetch(url, options)
        .then((response)=>response.json())
    ) 
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  } 
}


const fetchData = async (qry) => {
  const result = await axios(
    'https://hn.algolia.com/api/v1/search?query='+qry,
  );
  return result.data;
};

export {fetchData, fetchDevZones}