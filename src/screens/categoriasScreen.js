import React, { Component } from 'react';
import { Dimensions, 
         Text, 
         View, 
         TouchableOpacity, 
         ScrollView, 
         StyleSheet,
         Image, 
        } from 'react-native';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';
import * as Font from 'expo-font'
import { Divider } from 'react-native-elements';
import CacheImage from '../components/CacheImage';
import { FlatGrid } from 'react-native-super-grid';
import { Ionicons, FontAwesome } from '@expo/vector-icons';



const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const categorias = [
  {
     name: 'Comidas',
     foto: 'http://todoya2.aexelm.com/images/comidas.png',
     detalle: 'Todos los restaurantes y locales de comidas rápidas',
  },
  {
    name: 'Envíos',
    foto: 'http://todoya2.aexelm.com/images/envios.jpg',
    detalle: 'Mandados y envíos a todos los rincones de la ciudad',
  },  
  {
    name: 'Giros',
    foto: 'http://todoya2.aexelm.com/images/giros2.jpg',
    detalle : 'Giros, Retiros y Consignaciones',
  },  
  {
    name: 'Entretenimiento',
    foto: 'http://todoya2.aexelm.com/images/entrenimiento.jpg',
    detalle : 'Compramos los tickets para cines y eventos de la ciudad',
  },  
  {
    name: 'Auto Partes',
    foto: 'http://todoya2.aexelm.com/images/autopartes.jpg',
    detalle : 'Hacemos por ti las cotizaciones de repuestos y partes de automotores',
  },  
  {
    name: 'Medicamentos',
    foto: 'http://todoya2.aexelm.com/images/medicamentos.jpg',
    detalle : 'Todas las droguerías de la ciudad al alcance de tu mano',
  },   
  {
    name: 'Bebidas',
    foto: 'http://todoya2.aexelm.com/images/bebidas.jpg',
    detalle : 'Los mejores expendios de bebidas de la ciudad a tu alcance'
  },   
];  

export default class categoriasScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fontLoaded: false};
    }

    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: "TodoYa!",
        headerLeft: (
          <Image 
            source={require('../images/TodoYa-03.png')} 
            style={{marginLeft: 8,marginTop: 5, width:50,height: 50, resizeMode:'stretch'}}
          />
        ),
        headerRight: (
          <View style={{marginRight: 12, flexDirection:'row'}}>
            <Ionicons name='md-menu' color='#2980b9' size={36} />
          </View>
        ),
      };
    };
    
    async componentDidMount() { 
      await  Font.loadAsync({
        'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
      });
      
      this.setState({ fontLoaded: true });       
    }

    _removeData = async (key) => {
      try {
        await AsyncStorage.removeItem(key);
        console.log(key + ": Removido!!");
      } catch (error) {
        console.log(key + ":"+error);
      }
    };

    _goScreen = (categoriaSeleccionada) => {
      this.props.navigation.navigate('Comercios', { 
        data : categoriaSeleccionada
      });
    }

  render() {
    const dataJson = JSON.parse(this.props.navigation.getParam('data',''));
    const nombre1 = dataJson[0].nombre1;
    let Image_Http_URL ={ uri: 'http://todoya2.aexelm.com/images/Indra_000x000.jpg'};

    return (
      <View style={styles.containerCategoria}>
        
          {
            this.state.fontLoaded ? (
              <Text style={localStyles.simpleName} 
                    onPress = {() => {this._removeData("keyLogin");}} >
                    Hola, {nombre1}
              </Text>
            ) : null
          }
          <Text style={localStyles.quePuedo}>¿Qué podemos hacer por ti?</Text>
          <Divider style={{ marginLeft: 10,marginRight: 10, backgroundColor: '#2196F355', height: 8 }} />
          <ScrollView>  
          {
            this.state.fontLoaded ? (
              <Text style={localStyles.simpleTitle} >
                    Categorías
              </Text>
            ) : null
          }            
          <FlatGrid
            itemDimension={150}
            items={categorias}
            style={localStyles.gridView}
            // staticDimension={300}
            // fixed
             spacing={5}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => {this._goScreen(item.name)}}>
                <View style={localStyles.categoria}>
                  <CacheImage
                    style={localStyles.image}
                    uri= {item.foto}
                  />                    
                  <Text style={localStyles.name}>{item.name}</Text>
                  <Text style={localStyles.simpleDetalle}>{item.detalle}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
            
        </ScrollView>  
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  simpleName : {
      color: "rgba(0,0,0,0.5)",
      fontSize: 26,
      paddingTop: 10,
      paddingLeft : 20,
      fontFamily: 'RussoOne-Regular'
  },
  simpleTitle : {
    color: "#e74c3c",
    fontSize: 18,
    paddingTop: 10,
    paddingLeft : 20,
    marginBottom: 4,
    fontFamily: 'RussoOne-Regular'
  },  
  simpleDetalle : {
    color : '#000',
    fontSize: 11,
    paddingLeft: 6,
  },
  quePuedo : {
    fontSize: 16,
    color: "#2196F3",
    paddingLeft: 18,
    paddingBottom : 15,
  },
  image : {
    height: 130,
    width: "100%",
    resizeMode: "stretch",
    borderRadius: 10,
    margin: 1,
  },
  categoria : {
    padding: 5,
    width: '100%',
    borderColor: "#aaaaaaaa",
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: "#eeeeeeee"
  },
  name : {
    fontSize: 16,
    color: '#2980b9',
    fontWeight: "400",
    paddingTop: 5,
    textAlign: "left",
    paddingLeft: 6,
  },
  gridView: {
    marginTop: 3,
    flex: 1,
    paddingBottom: 130,
  },

})