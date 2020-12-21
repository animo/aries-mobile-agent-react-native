import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout, Text } from '@ui-kitten/components';

import { ConnectionsView, CredentialsView, ScannerView } from '../views';

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation selectedIndex={state.index} onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title="Connections" />
    <BottomNavigationTab title="Credentials" />
    <BottomNavigationTab title="Scanner" />
  </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen name="Connections " component={ConnectionsView} />
    <Screen name="Credentials" component={CredentialsView} />
    <Screen name="Scanner" component={ScannerView} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <TabNavigator />
  </NavigationContainer>
);
