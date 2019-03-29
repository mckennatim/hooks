import axios from 'axios';

const fetchData = async () => {
  const result = await axios(
    'http://hn.algolia.com/api/v1/search?query=redux',
  );
  return result.data;
};

export {fetchData}