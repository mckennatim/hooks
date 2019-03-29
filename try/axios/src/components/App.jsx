import React, { Fragment, useState, useEffect } from 'react';// eslint-disable-line no-unused-vars
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  const fetchData = async () => {
    const result = await axios(
      'http://hn.algolia.com/api/v1/search?query=redux='+query
    );

    setData(result.data);
  };

  useEffect(() => {
    fetchData();
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
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export {App};