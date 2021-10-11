import React, { Component } from 'react';
import { Button, View, Text, Image } from 'react-native';

import SearchScreen from './screens/SearchScreen';
import TransactionScreen from './screens/TransactionScreen';
import Login from './screens/Login';


import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

export default class App extends Component {
  render() {
    return (
        <AppContainer/>
    );
  }
}


const TabNavigator = createBottomTabNavigator({
  Transaction : {screen : TransactionScreen},
    Search : {screen : SearchScreen},

  
},

 {
  defaultNavigationOptions : ({navigation}) => ({
    
    tabBarIcon : () => {
      const routeName = navigation.state.routeName;
      if(routeName === "Transaction") {
        return(
          <Image
            source={require('./assets/book.png')}
            style={{width : 40, height : 40}}          
          />
        )
      } else if(routeName === "Search") {
        return(
          <Image
            source={require('./assets/searchingbook.png')}
            style={{width : 40, height : 40}}          
          />
        )
      }
    }
  })
  ,
  tabBarOptions : {
    activeTintColor : "black",
    inactiveTintColor : "black",
    activeBackgroundColor : "#00AA00",
    inactiveBackgroundColor : "white"
  }
}
  

);
const SwitchNavigator =createSwitchNavigator({
login:Login,
tabs:TabNavigator
})


const AppContainer = createAppContainer(SwitchNavigator)