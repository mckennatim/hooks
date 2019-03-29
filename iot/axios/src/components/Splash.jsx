import React, {Fragment, useState, useEffect} from 'react'
import{fetchData} from '../services/fetches'

const Splash = () =>{
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  useEffect(() => {
    fetchData(query).then((data)=>setData(data))
    const fun = (d)=>{
      console.log('d: ',d )
    }
    return fun
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