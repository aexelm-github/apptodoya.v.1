import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer }  from 'react-navigation';
import logoScreen from './src/screens/logoScreen'
import loginScreen from './src/screens/loginScreen'
import registerScreen from './src/screens/registerScreen'  
import categoriasScreen from './src/screens/categoriasScreen'  
import cartaScreen from './src/screens/cartaScreen'  
import pedidoScreen from './src/screens/pedidoScreen'  
import comerciosScreen from './src/screens/comerciosScreen'  

  class App extends React.Component {
    render() {
      const { currentScreen } = this.state; 
      return (
        <View style={styles.container}>
        <Text>Oxpen up App.js to start working on your app!</Text>
      </View>
      );
    }
  }

  const AppStackLogin = createStackNavigator(
    { 
      Login: loginScreen, 
      Register: registerScreen 
    },
    {
      headerMode: 'none',
      initialRoutName:'Register',
      defaultNavigationOptions: {
        title: '', 
        headerStyle: {
          backgroundColor: '#f345',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: 'transparent',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    });

  const AppStackPpal = createStackNavigator(
    { 
      Categorias: categoriasScreen, 
      Comercios: comerciosScreen, 
      Carta: cartaScreen ,
      Pedido: pedidoScreen
    },
    {
      initialRoutName:'Categorias',
      defaultNavigationOptions: {
        title: '', 
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#3498db',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitle: "",
        barStyle: 'dark-content'
      }
    });

  const AppNavigator = createSwitchNavigator(
    {
      AppStackLogin: AppStackLogin,
      LogoScreen: logoScreen,
      AppStackPpal: AppStackPpal
    },
    {
      initialRouteName: 'LogoScreen',
    } 
  );

  export default createAppContainer(AppNavigator);