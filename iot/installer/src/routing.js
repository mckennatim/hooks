import Navigo from 'navigo';
import { switchPage} from './actions/responsive';

var routes = [
  {path: 'apploc', page: 'AppLoc'},
  {path: '*', page: 'AppLoc'},
]
const makeRouter = (routes)=>{
  const onrt = routes.reduce((acc,rt)=>{
    acc[rt.path]=(params,query)=>{switchPage({name: rt.page, params: {...params, query: query}});}
    return acc
  }, {})
  return onrt
}

const rts = makeRouter(routes)
// console.log('rts: ', rts)
var router

const routing = ()=>{
  //const cfg ={root: 'http://10.0.1.233/spa/admin/dist/', useHash: true}
  const cfg ={root: null, useHash: true}
  router = new Navigo(cfg.root, cfg.useHash);
  router
    .on(rts)
    .resolve();
  return router
}


export {routing, routes}

// var router

// const routing = ()=>{
//   const cfg ={root: null, useHash: true}
//   router = new Navigo(cfg.root, cfg.useHash);
//   router
//     .on({
//       'apploc': ()=> {switchPage({name:'AppLoc', params:null})},
//       'devcrud': ()=> {switchPage({name: 'DevCRUD', params: null});} ,
//       'rjv': ()=> {switchPage({name: 'Rjv', params: null});} ,
//       'mui': ()=> {switchPage({name: 'Mui', params: null});} ,
//       'registered': (params, query)=>{
//         switchPage({name: 'Registered', params: {query: query}});
//       }, 
//       '*': ()=>{switchPage({name: 'AppLoc', params: null});}
//     })
//     .resolve();
//   return router
// }

// export {routing}
