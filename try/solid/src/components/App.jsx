import React, { Fragment, useState, useEffect } from 'react';// eslint-disable-line no-unused-vars
import { LoggedIn, LoggedOut, AuthButton, Value, List, withWebId } from '@solid/react';// eslint-disable-line no-unused-vars
import '../css/App.css';

let App= (props)=> {
  const[profileInput, setProfileInput] = useState('https://mcktimo.inrupt.net/profile/card#me')
  const[activeProfile, setActiveProfile] = useState('')

  const viewProfile= (profile) =>{
    setProfileInput(profile);
    setActiveProfile(profile);
  }

  useEffect(()=>{
    const{webId}=props
    console.log('webId: ', webId)
    if(webId){
      setProfileInput(webId)
    }
  },[])

  return (
    <div>
      <p>
        <LoggedOut>You are not logged in.</LoggedOut>
        <LoggedIn>You are logged in as <Value src="user"/>.</LoggedIn>
        <AuthButton popup="popup.html"/>
      </p>
      <p>
        <label htmlFor="profile">Profile:</label>
        <input id="profile" value={profileInput}
                onChange={e => setProfileInput(e.target.value)}/>
        <button onClick={() => viewProfile(profileInput)}>View</button>
      </p>  
      {activeProfile &&
        <dl>
          <dt>Full name</dt>
          <dd><Value src={`[${activeProfile}].vcard$role`}/></dd>    
          <dt>Friends</dt>
          <dd>
            <List src={`[${activeProfile}].friends`}>{friend =>
              <li key={friend}>
                <button onClick={() => viewProfile(friend)}>
                  <Value src={`[${friend}].name`}>{`${friend}`}</Value>
                </button>
              </li>}
            </List>
          </dd>
        </dl>}      
    </div>
  );
}

App = withWebId(App)

export {App};