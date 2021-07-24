import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components'
import React from 'react'
import { ConnectionsView, CredentialsView, ScannerView, ProofsView } from '../views'

const { Navigator, Screen } = createBottomTabNavigator()

const BottomTabBar = ({ navigation, state }): React.ReactElement => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index): void => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="Connections" />
    <BottomNavigationTab title="Credentials" />
    <BottomNavigationTab title="Present proof" />
    <BottomNavigationTab title="Invitation" />
  </BottomNavigation>
)

const TabNavigator: React.FC = (): React.ReactElement => (
  <Navigator tabBar={(props): React.ReactElement => <BottomTabBar {...props} />}>
    <Screen name="Connections" component={ConnectionsView} />
    <Screen name="Credentials" component={CredentialsView} />
    <Screen name="Present proof" component={ProofsView} />
    <Screen name="Invitation" component={ScannerView} />
  </Navigator>
)

export const AppNavigator: React.FC = (): React.ReactElement => (
  <NavigationContainer>
    <TabNavigator />
  </NavigationContainer>
)
