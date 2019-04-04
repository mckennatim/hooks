import axios from 'axios';

const fetchData = async (qry) => {
  const result = await axios(
    'http://hn.algolia.com/api/v1/search?query='+qry,
  );
  return result.data;
};

export {fetchData}