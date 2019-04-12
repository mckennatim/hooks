import * as compoi from './components'

const responsivePage=(state)=>{
    let elArr = []
  const {types, browser} = state.responsive
  const {page} =state.cambio
  const pageName = page.name
  const browserTypeIdx = types.indexOf(browser)
  const panesPerType = compoi.panes[browserTypeIdx]
  const pageList = compoi.multi.filter((amul)=>(amul.pri==pageName))
  if(pageList.length==0){ //if there is no multi array for the page
      const singleElement = compoi[pageName](state)
      elArr.push(singleElement)
  }else{
    const multiList= pageList[0].mul.filter((mu)=>(mu.length==panesPerType))
    if (multiList.length==0){ // if the multilist is empty
      const singleElement = compoi[pageName](state)
      elArr.push(singleElement)
    }else{//use the array matching the panesPerType size and add all its names to the element arrray
      const elList = multiList[0].map((pgStr)=>{
        const pg = compoi[pgStr](state)
        return pg
      })
      elArr = elList
    }
  }
  return elArr
}

export {responsivePage}
