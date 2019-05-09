import React, {Fragment, useState, useEffect} from 'react'
import{fetchData} from '../services/fetches'

const Splash = (props) =>{
  console.log('props: ', props)
  console.log('in splash')
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  useEffect(() => {
    let didCancel=false
    if(!didCancel){
      fetchData(query).then((data)=>setData(data))
    }
    return ()=>{
      didCancel=true
    }
  }, [query]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title} dog</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export{Splash}