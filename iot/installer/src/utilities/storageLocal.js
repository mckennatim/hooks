

const storageLocal = (itemName)=>{
  var itemStr =  localStorage.getItem(itemName)
  const getItem=()=>{
    // console.log('in getItem')
    if(!localStorage.getItem(itemName)){
      return null
    }
    return JSON.parse(localStorage.getItem(itemName))
  }
  const setItem=(obj)=>{
    localStorage.setItem(itemName, JSON.stringify(obj))
  }
  return{
    itemName: itemName,
    itemStr: itemStr,
    getItem: getItem,
    setItem: setItem,
    modItem: (key, val)=>{
      var ni= getItem();
      if(ni){
        ni[key] =val
        setItem(ni)
      }
    },
    getToken: ()=>getItem().token,
    getKey: (key)=>{
      let it = getItem()
      if(it){
        return it[key]
      }else{
        return null
      }
    },
    findLabel: (devid, senrel)=>{
      let it = getItem().devs[devid]
      let fil =it.filter((t)=>{
        return senrel==t.sr
      })
      return fil[0].label
    }
  }
}


export{storageLocal}


