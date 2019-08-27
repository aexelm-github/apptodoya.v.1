import React, { Component } from 'react';
import { Dimensions, 
         Text, 
         View, 
         TouchableOpacity, 
         ScrollView, 
         StyleSheet,
         Image,
         ProgressBarAndroid,
         TouchableHighlight,
         StatusBar,
         Button,
        } from 'react-native';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';
import * as Font from 'expo-font'
import { Divider } from 'react-native-elements';
import CacheImage from '../components/CacheImage';
import { FlatGrid } from 'react-native-super-grid';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import ActionMenu2 from '../components/ActionMenu2';

GLOBAL = require('../globals/globals');


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

let categorias ;/*= [
  {
     name: 'Comidasxx',
     foto: 'http://todoya2.aexelm.com/images/comidas.png',
     detalle: 'Todos los restaurantes y locales de comidas rápidas',
  } 
];  */

export default class categoriasScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false, 
            categoriasLoaded: false,
            itemChecked: null,
            estosBotonesActivos: {"add": true,"delete":false, "edit": false}
        };
    }

    static navigationOptions = ({navigation}) => {
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
              <TouchableHighlight activeOpacity={0.7} underlayColor='#ccc'
                onPress={() => {  navigation.openDrawer() }}
                style={{width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center'}}
              >
                  <Ionicons name='ios-menu' color='#3498db' size={36} />
              </TouchableHighlight>
          </View>
        ),
      };
    };
    
    async componentDidMount() { 
      await  Font.loadAsync({
        'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });  

      // Buscar en servidor de BBDD 
      this._getBoard();
    }

    _getBoard = async () => {
      let formdata = new FormData();
      formdata.append('parent',0);
      await this.setState({categoriasLoaded:false});
      await fetch('http://todoya2.aexelm.com/index.php/maincontrol/getboard', {   
          method: "POST",
          body: formdata,
        })
        .then( (response) => response.json() )
        .then( (responseJson) => {
            if (responseJson.length == 0){
              alert("¡¡Oops!!. No se pudo traer la información.");
            }else{
              categorias = responseJson;
              this.setState({ categoriasLoaded: true, itemChecked: null });  
              this._seleccionaItem({index: null, id: null }) 
              //console.log(categorias);
            }
      });   
    }

    _removeData = async (key) => {
      try {
        await AsyncStorage.removeItem(key);
        console.log(key + ": Removido!!");
      } catch (error) {
        console.log(key + ":"+error);
      }
    };

    _goScreen = (params) => {
      if (this.state.itemChecked == null )
            this.props.navigation.navigate('Comercios', { 
              params : params
            });
    }

    _seleccionaItem = (params) => {
      this.state.itemChecked == params.index ? this.setState({'itemChecked':null}) :this.setState({'itemChecked':params.index}) ;
      if (this.state.itemChecked == null ){
        this.setState((previousState) => ({
          estosBotonesActivos: {
            ...previousState.estosBotonesActivos,
            add: true, edit: false, delete: false
          }
        }))
      }else{
        this.setState((previousState) => ({
          estosBotonesActivos: {
            ...previousState.estosBotonesActivos,
            add: false, edit: true, delete: true
          }
        }))
        //console.log(categorias[this.state.itemChecked].foto);
      }
    }

    _accionMenuPress = (data) => {
      switch(data){
        case 'add': data='Nuevo';break;
        case 'edit': data='Editar';break;
        case 'delete': data='borrar';break;
      }
      this.props.navigation.navigate('HandleBoard', {
        onGoBack : this._getBoard,
        params : {
          commingFrom: 'categoriasScreen',
          parentId: 0,
          action: data,
          id: this.state.itemChecked,
          data: this.state.itemChecked == null ? null : categorias[this.state.itemChecked],
          go: 'Contenido',
        }
      }); 
    }

  render() {
    const dataJson = JSON.parse(this.props.navigation.getParam('data',''));
    const nombre1 = dataJson[0].nombre1;
    let Image_Http_URL ={ uri: 'http://todoya2.aexelm.com/images/Indra_000x000.jpg'};

    return (
        <View style={styles.container}>
          <StatusBar backgroundColor="blue" barStyle="dark-content" />
          { this.state.categoriasLoaded ? (
          <View >
              {
                this.state.fontLoaded ? (
                  <Text style={localStyles.simpleName} 
                        onPress = {() => {this._removeData("keyLogin");}} >
                        Hola, {nombre1}
                  </Text>
                ) : null
              }
              <Text style={localStyles.quePuedo}>¿Qué podemos hacer por ti?</Text>
              <Divider style={{ borderRadius: 2, marginLeft: 20,marginRight: 20, backgroundColor: '#3498db', height: 4 }} />
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
                  <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {this._goScreen({categoria: item.name, id : item.cboa_id })}}
                      delayLongPress={GLOBAL.LONG_PRESS_SECONDS}
                      onLongPress={() => { this._seleccionaItem({index: index, id: item.cboa_id }) }}
                  >
                    <View style={localStyles.categoria}>
                      <CacheImage
                        style={localStyles.image}
                        uri= {'http://todoya2.aexelm.com/images/'+item.foto}
                      />                    
                      <Text style={localStyles.name}>{item.name}</Text>
                      <Text style={localStyles.simpleDetalle}>{item.detalle}({item.cboa_id })[{item.foto}]</Text>
                    </View>
                    {
                      this.state.itemChecked == index ? (
                          <View style={localStyles.checked}>
                              <Ionicons name='ios-checkmark-circle-outline' color='#fff' size={36} />
                          </View>
                      ) : null
                    }                    
                  </TouchableOpacity>
                )}
              />
              <Button title='Refrescar'
                    onPress={() => {this._getBoard() }  }
              />
            </ScrollView>  
          </View>
        ) : (
            this.state.fontLoaded ? (
              <View style={localStyles.welcome}>
                <Text style={[localStyles.simpleName]} 
                      onPress = {() => {this._removeData("keyLogin");}} >
                      Hola, {nombre1}
                </Text>
              </View>
            ) : null
        )}
        <ActionMenu2 
          callbackFromParent={this._accionMenuPress}
          estosBotonesActivos={this.state.estosBotonesActivos}
        />
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
    color: '#3498db',
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
  welcome : {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
  },
  checked: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#00000077',
    alignItems: 'center',
    justifyContent: 'center'
  }
})