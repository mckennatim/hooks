https://www.reddit.com/r/reactjs/comments/arj9ml/trying_to_write_a_custom_usewebsocket_hook/

https://www.thegreatcodeadventure.com/improving-u-with-phoenix-channels-and-react-hooks/

# log

## 02-greeenhouse
create a useMqtt hook that any component can use. 

`const [state, onMessage] = useMqtt(message, reducer, initialState)`


## 01-greenhouse
Paho client initializes on loading of mq.js. `Control` uses effect to fetch devzones, then connects to those devs. onConnect is fired in mq.js which subscribes and publishes requests. Data starts rolling in from `onMessageArrived`

# axios -> signin
# src.2
routing works.  hooks works with responsivePage() coded inside App.js Still an error for not canceling use efeect subscription

# .3 
# .2
so far have added the rxjs machinery for redux-like state sharing. rxjs 6  via https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/v6/migration.md. 

also pushed fetchData into services