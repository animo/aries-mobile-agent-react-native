import React from 'react'
import { useAgent } from '../agent/AgentProvider'
import { AppNavigator } from '../components'
import { LoaderView } from './LoaderView'

const RootView: React.FC = (): React.ReactElement => {
  const { loading } = useAgent()
  console.log(loading)

  return <>{loading ? <LoaderView /> : <AppNavigator />}</>
}

export { RootView }
