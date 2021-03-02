import { StyleService, useStyleSheet } from '@ui-kitten/components'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAgent } from '../agent/AgentProvider'
import { AppNavigator } from '../components'
import { LoaderView } from './LoaderView'

const RootView: React.FC = (): React.ReactElement => {
  const styles = useStyleSheet(themedStyles)

  const { loading } = useAgent()

  return <SafeAreaView style={styles.safeAreaView}>{loading ? <LoaderView /> : <AppNavigator />}</SafeAreaView>
}
const themedStyles = StyleService.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'background-basic-color-1',
  },
})

export { RootView }
