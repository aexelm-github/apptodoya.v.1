import React, { Component } from 'react';
import { Dimensions,
         Text, 
         View, 
         TouchableOpacity, 
         ProgressBarAndroid,
         StyleSheet,
         ScrollView,
         TouchableHighlight,
         Button,
         ToastAndroid,
        } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import styles from '../styles/stylesOne';
import * as Font from 'expo-font'
import CacheImage from '../components/CacheImage';
import { FlatGrid } from 'react-native-super-grid';
import { Divider } from 'react-native-elements';
import ActionMenu2 from '../components/ActionMenu2';
import {AsyncStorage} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

GLOBAL = require('../globals/globals');


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

let categorias ;

export default class comerciosScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          fontLoaded: false, 
          categoriasLoaded: false,
          itemChecked: null,
          estosBotonesActivos: {"add": true,"delete":false, "edit": false},
      };        
  }
    
  onPress = () => {
      alert("exel");
  }

  _goScreen = async (params) => {
      console.log('Desde comerciosScreen: goScreen incios');
      console.log(params);
      console.log('Desde comerciosScreen: goScreen fin');
      const estadoPedidoActual = await AsyncStorage.getItem('estadoPedidoActual')
      console.log("estadoPedidoActual"+estadoPedidoActual)
      if (estadoPedidoActual == "noHay" || estadoPedidoActual==null) {
        if (this.state.itemChecked == null ) {
          this.props.navigation.navigate(params.cboa_go, { 
            params : params
          });
        }
      }else{
        ToastAndroid.show(
          'oops!! Aún tienes algo en proceso',
          ToastAndroid.LONG 
        );
        this.props.navigation.navigate('Carrito')
      }
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
    }
  }

  static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: props => {return <Text style={{color:'#3498db',fontWeight: "500", fontSize: 18}}>
                                          TodoYa
                              </Text>},
        headerStyle: {
          backgroundColor: '#fff',
          textAlign: 'center',
          elevation: 0,
        },
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
        headerBackTitleStyle: {
          color: 'white',
        },
      };
  };
    
  async componentDidMount() { 
      await  Font.loadAsync({
          'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });  
      // Buscar en servidor de BBDD
      this._getBoard();
      /*let formdata = new FormData();
      formdata.append('parent',this.props.navigation.getParam('params','').id);
  
      await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getboard', {   
          method: "POST",
          body: formdata,
          })
          .then( (response) => response.json() )
          .then( (responseJson) => {
              console.log("entro por aca");
              if (responseJson.length == 0){
              alert("¡¡Oops!!. Categoría esá vacía.");
              }else{
              categorias = responseJson;
              this.setState({ categoriasLoaded: true });  
              }
      });*/               

  }

  _getBoard = async () => {
    let formdata = new FormData();
    formdata.append('parent',this.props.navigation.getParam('params','').cboa_id);
    await this.setState({categoriasLoaded:false});
    await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getboard', {   
        method: "POST",
        body: formdata,
      })
      .then( (response) => response.json() )
      .then( (responseJson) => {
          if (responseJson.length == 0){
            //alert("¡¡Oops!!. Parece que está vacío!!.");
          }else{
            categorias = responseJson;
            this.setState({ categoriasLoaded: true, itemChecked: null });  
            this._seleccionaItem({index: null, id: null }) 
            //console.log(categorias);
          }
    });   
  }


  _accionMenuPress = (data) => {
    const params = this.props.navigation.getParam('params','');
    //console.log('ESTE ES PARENT QUE ESTOY ENVIANDO parentId:' + params.id);
    switch(data){
      case 'add': data='Nuevo';break;
      case 'edit': data='Editar';break;
      case 'delete': data='borrar';break;
    }
    this.props.navigation.navigate('HandleBoard', {
      onGoBack : this._getBoard,
      params : {
        commingFrom: 'comerciosScreen',
        parentId: params.cboa_id,
        action: data,
        id: this.state.itemChecked,
        data: this.state.itemChecked == null ? null : categorias[this.state.itemChecked],
        go: 'Contenido',
      }
    }); 
  }

  render() {
    const params = this.props.navigation.getParam('params','');
    //console.log(params.cboa_id);
    const nombreCategoria = 'Default';//this.props.navigation.getParam('data','');
    return (
        <View style={[styles.container,{backgroundColor: '#fff'}]}>
          { this.state.categoriasLoaded ? (
          <View >
              <ScrollView>  
              <View style={{backgroundColor: "#fff"}}> 
                {
                    this.state.fontLoaded ? (
                    <Text style={localStyles.simpleName}  >
                            {params.name}
                    </Text>
                    ) : null
                }    
                <Text style={localStyles.quePuedo}>¿Qué podemos hacer por ti?</Text>
                <Divider style={{ borderRadius: 2, marginLeft: 20,marginRight: 20, backgroundColor: '#3498db', height: 4 }} />
              </View>              
              
              <FlatGrid
                itemDimension={200}
                items={categorias}
                style={localStyles.gridView}
                // staticDimension={300}
                // fixed
                spacing={15}
                renderItem={({ item, index }) => (
                  <TouchableOpacity 
                    onPress={() => {this._goScreen(item)}}
                    delayLongPress={GLOBAL.LONG_PRESS_SECONDS}
                    onLongPress={() => { this._seleccionaItem({index: index}) }}
                    activeOpacity={0.7}
                  >
                    <View style={localStyles.categoria} elevation={0}>
                    <Text style={localStyles.name}>{item.name}</Text>
                      <Text style={localStyles.simpleDetalle}>{item.detalle}</Text>
                      <View>
                        <CacheImage
                            style={localStyles.image}
                            uri= {GLOBAL.BASE_URL+'/images/'+item.foto}
                        /> 
                        
                      </View>
                      <CacheImage
                        style={localStyles.imageBrand}
                        uri= {GLOBAL.BASE_URL+'/images/'+item.foto}
                      />                                          
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
                  <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
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
      fontSize: 18,
      paddingTop: 0,
      paddingLeft : 20,
      fontFamily: 'RussoOne-Regular'
  },
  simpleTitle : {
    color: "#e74c3c",
    fontSize: 18,
    paddingTop: 10,
    paddingLeft : 0,
    marginBottom: 0,
    fontFamily: 'RussoOne-Regular'
  },  
  simpleDetalle : {
    color : '#34495e',
    fontSize: 14,
    paddingLeft: 0,
    paddingRight: 100,
    paddingTop: 0,
  },
  quePuedo : {
    fontSize: 16,
    color: "#3498db",
    paddingLeft: 18,
    paddingBottom : 15,
  },
  imageBrand : {
    position:  'absolute',
    width: 60, 
    height: 60,
    borderRadius: 30,
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff"
  },
  image : {
    height: 130,
    width: "100%",
    resizeMode: "stretch",
    borderRadius:0,
    margin: 0,
    height: screenWidth/2,
    borderWidth: 1,
    borderColor: '#fff',
  },
  categoria : {
    padding: 0,
    paddingBottom: 5,
    width: '100%',
    //borderColor: "#aaaaaaaa",
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "#fff",
},
  name : {
    fontSize: 18,
    color: '#3498db',
    fontWeight: "600",
    paddingTop: 5,
    textAlign: "left",
    paddingLeft: 0,
    paddingRight: 100,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
    margin: 0,
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