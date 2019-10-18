import jsenv from '../../envmy.json'
import env from '../../denv.json'
import {storageLocal} from './storageLocal'

const cfg= env[jsenv.m||'local']

const authqry = cfg.url.soauth+"/spa/"+cfg.appid+"?apiURL="+encodeURIComponent(cfg.url.api)+"&cbPath="+encodeURIComponent(cfg.cbPath)

const signupqry = cfg.url.soauth+"/spa/signup?apiURL="+encodeURIComponent(cfg.url.api)+"&cbPath="+encodeURIComponent(cfg.cbPath)

cfg.url.authqry = authqry
cfg.url.signupqry = signupqry

const ls = storageLocal(cfg.appid)

const makeHref=(host,app,rt)=>{
  let href
  if(host=='iot.sitebuilt.net'){
    href= `../${app}/`
  }else {
    href = `../../${app}/dist/`
  }
  if(rt){
    href+=rt
  }
  return href
}

export{ls, cfg, makeHref}
