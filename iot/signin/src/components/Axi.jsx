import React, { Fragment, useState, useEffect } from 'react';
import{fetchData} from '../services/fetches'
  
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  useEffect(() => {
    fetchData().then((data)=>setData(data))
  }, []);

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

export {App};