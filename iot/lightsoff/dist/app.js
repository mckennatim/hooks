const cfg = {
  "appid": "lightsoff",	
  "devices": ["CYURD006", "CYURD004"],
  "cbPath": "",			
  "mqtt_server": "services.sitebuilt.net/iotb/wss",
  "mqtt_port": 4333,
  "soauth": "https://services.sitebuilt.net/soauth",
  "api": "https://services.sitebuilt.net/iotex/api"
}

var client = new Paho.MQTT.Client(cfg.mqtt_server, cfg.mqtt_port, cfg.appid+Math.random());
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var userEmail=''
var userToken=''
var mess
var dmessage

window.onload=function(){
  //console.log('heelldl ')
  dmessage = document.getElementById("message")
  dgreentemp = document.getElementById("greentemp")
  dgreenhumid = document.getElementById("greenhumid")

  var emtok = getToken(cfg.appid)
  console.log('emtok: ', emtok)


  if(!get('emtok.token',emtok)){
    mess="You need a token (and owner's OK) to access a device. Press Register to get a token "
    console.log(mess)
    dmessage.innerHTML=mess
    alert(mess)
  } else{
    userEmail=emtok.email
    userToken=emtok.token
  }

  var query = window.location.search
  console.log("query length= ",query.length)
  dmessage.innerHTML="doggy"

  if(query.length>1){
    var qobj = parseQuery(query)
    console.log(qobj)
    if(get('qobj.token',qobj)){
      localStorage.setItem(cfg.appid, JSON.stringify(qobj))
    }else{
      mess = decodeURIComponent(qobj.message)+' or register as a different user'
      console.log(mess)
      dmessage.innerHTML=mess
      localStorage.removeItem(cfg.appid)
      //delete token
      //alert(mess)
    }
  }

  connect()

  window.onfocus = ()=>{
    console.log('focused')
    try{
      connect()
    }catch(err){
      console.log('maybe trying to connect after connect() already called')
    }
  }
  window.onblur= ()=>{
    console.log('unfocused')
    try{
      client.disconnect()
    }catch(err){
      console.log('cannot disconnect: not connected')
    }
  }	
}//end of stuff waiting for window to load


function connect() {
  client.connect({
    onSuccess: onConnect,
    onFailure: function (message) {
      console.log("Connection failed: " + message.errorMessage);
      dmessage.innerHTML= "Connection failed: " + message.errorMessage;
    },
    useSSL: true,
    userName: userEmail,
    password: userToken		
  });
}

function onConnect() {
  var cmess = `Connected to ${cfg.mqtt_server} on port ${cfg.mqtt_port} `
  console.log(cmess);
  dmessage.innerHTML=cmess;
  subscribe()
  publish('presence', 'Web Client is alive.. Test Ping! ');
  publish(`${cfg.devices[0]}/req`,'{"id":2,"req":"flags"}')
  publish(`${cfg.devices[0]}/req`,'{"id":0,"req":"srstates"}')
  publish(`${cfg.devices[0]}/req`,'{"id":1,"req":"progs"}')				
  publish(`${cfg.devices[1]}/req`,'{"id":2,"req":"flags"}')
  publish(`${cfg.devices[1]}/req`,'{"id":0,"req":"srstates"}')
  publish(`${cfg.devices[1]}/req`,'{"id":1,"req":"progs"}')		
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('Connection Lost ' + responseObject.errorMessage);
    }
}	

const register=()=>{
  console.log(stripQuery())
  window.history.pushState("object or string", "Title", "/"+stripQuery() );
  console.log(cfg.soauth)
  console.log(encodeURIComponent(cfg.soauth))
  const url = cfg.soauth+"/spa/"+cfg.appid+"?apiURL="+encodeURIComponent(cfg.api)+"&cbPath="+encodeURIComponent(cfg.cbPath)
  console.log(url)
  window.location=url
}

function subscribe() {
  console.log(client)
  console.log(`${cfg.devices[0]}/srstate`)
  client.subscribe(`${cfg.devices[0]}/srstate` , {onFailure: subFailure}) 
  client.subscribe(`${cfg.devices[0]}/devtime` , {onFailure: subFailure}) 
  client.subscribe(`${cfg.devices[0]}/timr` , {onFailure: subFailure}) 
  client.subscribe(`${cfg.devices[0]}/sched` , {onFailure: subFailure}) 
  client.subscribe(`${cfg.devices[0]}/flags` , {onFailure: subFailure}) 
  client.subscribe(`${cfg.devices[1]}/srstate` , {onFailure: subFailure}) 
  client.subscribe(`${cfg.devices[1]}/devtime` , {onFailure: subFailure}) 
  client.subscribe(`${cfg.devices[1]}/sched` , {onFailure: subFailure}) 
  client.subscribe(`${cfg.devices[1]}/timr` , {onFailure: subFailure}) 
  client.subscribe(`${cfg.devices[1]}/flags` , {onFailure: subFailure}) 
}

function subFailure(message){
  console.log(message)
}

function subSuccess(message){
  console.log(message.grantedQos[0])
}

function publish(topic, payload){
  message = new Paho.MQTT.Message(payload);
  message.destinationName = topic;
  client.send(message)
}	

function onMessageArrived(message) {
  var topic = message.destinationName
  var pls = message.payloadString
  console.log(topic+ pls)
  var plo = JSON.parse(pls)
  //console.log(plo)
  console.log('['+topic+'] '+pls)
  var sp = topic.split("/")
  var job = sp[1];
  var dev =sp[0]
  switch(job){
    case "srstate":
      if (plo.id==0 && dev==cfg.devices[0]){
        document.getElementById('outside').innerHTML=plo.darr[0]
      }
      if (plo.id==0 && dev==cfg.devices[1]){
        dgreentemp.innerHTML=plo.darr[0]
      }
      if (plo.id==1 && dev==cfg.devices[1]){
        dgreenhumid.innerHTML=plo.darr[0]
      }							
      if (plo.id==2 && dev==cfg.devices[1]){
        document.getElementById('lstate').innerHTML=plo.darr[0]
      }
      break;
    case "timr":
          document.getElementById('greenTleft').innerHTML=Math.round(plo.tIMElEFT[2]/60)
      break;
    case "sched":
      break;
    case "flags":
      oflags = plo;
      //console.log(JSON.stringify(oflags))
      break;
  }				
}	

function kill(){
  thecmd =`{\"id\":2,\"sra\":[0]}`
  console.log(thecmd);
  publish(`${cfg.devices[1]}/cmd`, thecmd)
}
function turnon(){
  thecmd =`{\"id\":2,\"sra\":[1]}`
  console.log(thecmd);
  publish(`${cfg.devices[1]}/cmd`, thecmd)
}
function aprg(){
  var id =2
  var str = prarr.value
  var arr = str.slice(1,-1).split(',').map(function(e){return parseInt(e)})
  var thecmd =  `{\"id\":${id}`
  var sl = str.length
  thecmd+=`,\"pro\":[${str}]}`
  console.log(str)
  console.log(thecmd);
  publish(`${cfg.devices[1]}/prg`, thecmd)
}