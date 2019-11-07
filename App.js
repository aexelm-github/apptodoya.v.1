import React from 'react';
import { Image, Text, View, ScrollView , Dimensions, Button} from 'react-native';
import {AsyncStorage} from 'react-native';
import { 
        createStackNavigator, 
        createSwitchNavigator, 
        createAppContainer,
        createBottomTabNavigator,
        createDrawerNavigator,DrawerItems, SafeAreaView ,
      }  from 'react-navigation';
import logoScreen from './src/screens/logoScreen'
import loginScreen from './src/screens/loginScreen'
import registerScreen from './src/screens/registerScreen'  
import categoriasScreen from './src/screens/categoriasScreen'  
import cartaScreen from './src/screens/cartaScreen'  
import pedidoScreen from './src/screens/pedidoScreen'  
import comerciosScreen from './src/screens/comerciosScreen'  
import contenidoScreen from './src/screens/contenidoScreen'  
import carritoScreen from './src/screens/carritoScreen'  
import handleBoardScreen from './src/screens/handleBoardScreen'  
import handleBoardPedido from './src/screens/handleBoardPedido'  
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import confirmScreen from './src/screens/confirmScreen';
import recuperaScreen from './src/screens/recuperaScreen';
import Styles from "./src/styles/stylesOne"
import CustomButton from "./src/components/customButton";
import pedidoDescriptivoScreen from './src/screens/pedidoDescriptivoScreen';
import mapScreen from './src/screens/mapScreen';
import confirmPedido from './src/screens/confirmPedido';
import progresoPedido from './src/screens/progresoPedido';
import closeSession from './src/screens/closeSession';


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

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


  const CustomDrawerContentComponent = props => (
    <ScrollView>
      <SafeAreaView style={{flex:1}} forceInset={{ top: 'always', horizontal: 'never' }}>
        <Image 
          style={[{resizeMode: "stretch",marginTop:45,marginLeft: 75, marginBottom: 25}]}
          width={150}
          height={150}
          source={require('./src/images/TodoYa-03.png')}
        />
        <DrawerItems {...props} />
      </SafeAreaView>
    </ScrollView>
  );

  
  const AppStackLogin = createStackNavigator(
    { 
      Login: loginScreen, 
      Register: registerScreen,
      Confirm: confirmScreen,
      RecuperaPassword : recuperaScreen,
    },
    {
      headerMode: 'none',
      initialRoutName:'Register',
      defaultNavigationOptions: {
        title: '', 
        headerStyle: {
          backgroundColor: 'transparent',
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
      Contenido: contenidoScreen,
      PedidoDescriptivo: pedidoDescriptivoScreen,
      Carta: cartaScreen ,
      Pedido: pedidoScreen,
      ConfirmPedido: confirmPedido,
      HandleBoard: handleBoardScreen,
      HandleBoardPedido: handleBoardPedido,
      Mapa: mapScreen,
    },
    {
      initialRoutName:'Categorias',
      defaultNavigationOptions: {
        title: '', 
        headerStyle: {
          backgroundColor: 'transparent',
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
      'Avance Pedido': progresoPedido,
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
          } else if (routeName === 'Avance Pedido') {
            iconName = 'ios-bicycle';
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

  const appDrawerNavigator = createDrawerNavigator(
    {
      Home: tabNavigatorMain,
      Carrito: carritoScreen,
      'Cerrar Sesión' : closeSession ,
    },
    {
      drawerType: 'slide',
      drawerWidth: 300,
      drawerBackgroundColor: '#fff',
      contentOptions: {
        activeTintColor: "#fff",
        activeBackgroundColor: "#e74c3c"
      },
      contentComponent: CustomDrawerContentComponent,
    }
  );

  const AppNavigator = createSwitchNavigator(
    {
      AppStackLogin: AppStackLogin,
      LogoScreen: logoScreen,
      //AppStackPpal: AppStackPpal
      //ConfirmPedido: confirmPedido,
      appDrawerNavigator: appDrawerNavigator,
    },
    {
      initialRouteName: 'LogoScreen',
    } 
  );

  
  export default createAppContainer(AppNavigator);