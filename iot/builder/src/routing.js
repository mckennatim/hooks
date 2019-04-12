import Navigo from 'navigo';
import { switchPage} from './actions/responsive';

var router

const routing = ()=>{
  const cfg ={root: null, useHash: true}
  router = new Navigo(cfg.root, cfg.useHash);
  router
    .on({
      'devcrud': ()=> {switchPage({name: 'DevCRUD', params: null});} ,
      'rjv': ()=> {switchPage({name: 'Rjv', params: null});} ,
      'mui': ()=> {switchPage({name: 'Mui', params: null});} ,
      'registered': (params, query)=>{
        switchPage({name: 'Registered', params: {query: query}});
      }, 
      '*': ()=>{switchPage({name: 'DevCRUD', params: null});}
    })
    .resolve();
  return router
}

export {routing}
