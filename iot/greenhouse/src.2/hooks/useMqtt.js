import { useContext, useEffect, useReducer, useState } from 'react'
import SocketContext from '../contexts/SocketContext'

const useMqtt = (devs, reducer, initialState) => {
  const client = useContext(MqttContext)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [broadcast, setBroadcast] = useState(mustJoinChannelWarning)

  useEffect(() => (
    subscribe(client, devs, dispatch, setBroadcast)
  ), [devs])

  return [state, broadcast]
}

const subscribe = (client, devs, dispatch, setBroadcast) => {
  const channel = client.channel(devs, {client: 'browser'})

  channel.onMessage = (event, payload) => {
    dispatch({ event, payload })
    return payload
  }

  channel.join()
    .receive("ok", ({messages}) =>  console.log('successfully joined channel', messages || ''))
    .receive("error", ({reason}) => console.error('failed to join channel', reason))

  setBroadcast(() => channel.push.bind(channel))

  return () => {
    channel.leave()
  }
}

const mustJoinChannelWarning = () => (
  () => console.error(`useChannel broadcast function cannot be invoked before the channel has been joined`)
)

export default useMqtt