# operation - how to build an app

Building an app should be agnostic as to what specific devices it uses. But you may have to use dummy devices to get it going and test it 

Installing an app requires a mapping between particular devices and the app. More importantly installing an app requires the owner of the device at a location to add that app and the mapping from devices at that location to the app. Installing an app is merely changing the database's apploc file? But what about being able to use devices at different locations? 

What is being checked on connect in mqtt-hools.mq.connect? It is the token you get back when you finish the second part of authentication where it tells you which apps at which locations you can run. app_loc_user is the file of who can run what app.



# refs

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