import { actionCreator } from '../rxred';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/dom/ajax';
import { map } from 'lodash';

const loadGithubFollowers = actionCreator((payload) => {
  const url = `https://api.github.com/users/${payload}/followers`;
  return {
    type: 'GITHUB_FOLLOWERS_LOADING',
    payload: Observable.ajax(url)
      .map((xhr) => {
        console.log(xhr)
        return map(xhr.response, 'login')
      })
      .map((followers) => {
        console.log(followers)
        return({
          type: 'GITHUB_FOLLOWERS_LOADED',
          payload: followers
        })
      })
  };
});

export{loadGithubFollowers}