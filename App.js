import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { 
        createStackNavigator, 
        createSwitchNavigator, 
        createAppContainer,
        createBottomTabNavigator
      }  from 'react-navigation';
import logoScreen from './src/screens/logoScreen'
import loginScreen from './src/screens/loginScreen'
import registerScreen from './src/screens/registerScreen'  
import categoriasScreen from './src/screens/categoriasScreen'  
import cartaScreen from './src/screens/cartaScreen'  
import pedidoScreen from './src/screens/pedidoScreen'  
import comerciosScreen from './src/screens/comerciosScreen'  
import carritoScreen from './src/screens/carritoScreen'  
import handleBoardScreen from './src/screens/handleBoardScreen'  
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import confirmScreen from './src/screens/confirmScreen';

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
      Register: registerScreen,
      Confirm: confirmScreen,
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
      Pedido: pedidoScreen,
      HandleBoard: handleBoardScreen,
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
      }
    });

  const tabNavigatorMain = createBottomTabNavigator(
    {
      Home: AppStackPpal,
      Carrito:  carritoScreen,
    },
    {
      initialRouteName: 'Home',
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Ionicons;
          let iconName;
          if (routeName === 'Home') {
            iconName = 'md-home';
            // Sometimes we want to add badges to some icons. 
            // You can check the implementation below.
            //IconComponent = HomeIconWithBadge; 
          } else if (routeName === 'Carrito') {
            iconName = `ios-cart`;
          }
  
          // You can return any component that you like here!
          return <IconComponent elevation={10} name={iconName} size={25} color={tintColor} />;
        },
      }),
      tabBarOptions : {
        activeTintColor: '#3498db',
        inactiveTintColor: 'gray',        
        style: {
         // backgroundColor: '#3498db'
         paddingTop: 5
        },
      }
    }
  ); 

  const AppNavigator = createSwitchNavigator(
    {
      AppStackLogin: AppStackLogin,
      LogoScreen: logoScreen,
      //AppStackPpal: AppStackPpal
      tabNavigatorMain: tabNavigatorMain,
    },
    {
      initialRouteName: 'LogoScreen',
    } 
  );

  
  export default createAppContainer(AppNavigator);