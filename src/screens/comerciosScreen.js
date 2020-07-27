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
         Image,
         ActivityIndicator 
        } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import styles from '../styles/stylesOne';
import * as Font from 'expo-font'
import CacheImage from '../components/CacheImage';
import { FlatGrid } from 'react-native-super-grid';
import { Divider, SearchBar } from 'react-native-elements';
import ActionMenu2 from '../components/ActionMenu2';
import {AsyncStorage} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
//import { forNoAnimation } from 'react-navigation-stack/lib/typescript/src/vendor/TransitionConfigs/CardStyleInterpolators';
import * as Fx from '../globals/Fx'
import { FlatList } from 'react-native-gesture-handler';

GLOBAL = require('../globals/globals');


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

let categorias ;
let timeOut = 0;

export default class comerciosScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          fontLoaded: false,
          categoriasLoaded: false,
          itemChecked: null,
          estosBotonesActivos: {"add": true,"delete":false, "edit": false},
          perfil:null,
          hayPromo : null,
          search: '',
          isSearching: false,
          resultado: null,

      };
  }

  onPress = () => {
      alert("exel");
  }

  _goScreen = async (params) => {
      // console.log('Desde comerciosScreen: goScreen incios');
      console.log(params);
      // console.log('Desde comerciosScreen: goScreen fin');
      const estadoPedidoActual = await AsyncStorage.getItem('estadoPedidoActual')
      const idComercioActual = await Fx._retrieveData("idComercioActual")
      // console.log("estadoPedidoActual"+estadoPedidoActual)
      if (estadoPedidoActual == "noHay" || estadoPedidoActual==null || idComercioActual == params.cboa_id) {
        if (this.state.itemChecked == null ) {
          await Fx._storeData("ubicacion_comercio", params.cboa_ubicacion)
          const categoria = this.props.navigation.getParam('params','').cboa_id
          this.props.navigation.navigate(params.cboa_go, {
            params : params, categoria
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
    if (this.state.perfil !== "admin") return
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
          elevation: 0,
        },
        headerRight: ()=>(
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
      this._buscarPromos()

      const keyLogin = await AsyncStorage.getItem('keyLogin')
      this.setState({perfil:  JSON.parse(keyLogin)[0].tipo} )
  }

  _buscarPromos = async () => {
      const categoria = this.props.navigation.getParam('params','').cboa_id
      let formdata = new FormData();
      formdata.append("categoria", categoria)
      await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getPromo', {
        method: "POST",
        body: formdata,
      })
      .then( (response) => response.json() )
      .then( (responseJson) => {
            if (responseJson.length == 0){
              //alert("¡¡Oops!!. Parece que está vacío!!.");
            }else{
              this.setState({ hayPromo: responseJson });
              console.log(responseJson);
            }
      });
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
            // console.log(categorias);
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

  goPromo = async (item) => {
    console.log( item )
    const params = {
      cboa_go	 : item.cboa_go,
      cboa_grupo	 : item.cboa_grupo,
      cboa_id	 : item.cboa_id,
      cboa_ocultarnombre	 : item.cboa_ocultarnombre,
      cboa_precio	 : item.cboa_precio,
      cboa_promocion	 : item.cboa_promocion,
      cboa_ubicacion	 : item.cboa_ubicacion,
      detalle	 : item.detalle,
      foto	 : item.foto,
      name	 : item.name
    }
    const paramsParent = {
      cboa_go	 : item.cboa_go_parent,
      cboa_grupo	 : item.cboa_grupo_parent,
      cboa_id	 : item.cboa_id_parent,
      cboa_ocultarnombre	 : item.cboa_ocultarnombre_parent,
      cboa_precio	 : item.cboa_precio_parent,
      cboa_promocion	 : item.cboa_promocion_parent,
      cboa_ubicacion	 : item.cboa_ubicacion_parent,
      detalle	 : item.detalle_parent,
      foto	 : item.foto_parent,
      name	 : item.name_parent
    }
    const estadoPedidoActual = await Fx._retrieveData('estadoPedidoActual')
    const idComercioActual = await Fx._retrieveData("idComercioActual")
    if (estadoPedidoActual == "noHay" || estadoPedidoActual==null || idComercioActual == item.cboa_id_parent) {
      if (this.state.itemChecked == null ) {
        await Fx._storeData("ubicacion_comercio", params.cboa_ubicacion)
        this.props.navigation.navigate(params.cboa_go, {
          params : params,
          paramsParent : paramsParent
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

  updateSearch =  async (search) => {
    // await this.setState({ search, isSearching : true , resultado: null});
    // if (search.length == 0 ) {
    //   return
    // }
    const cboa_id = this.props.navigation.getParam('params','').cboa_id
    let formdata = new FormData();
    formdata.append("cboa_id", cboa_id)
    formdata.append("texto", search.toUpperCase())
    await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/search', {
      method: "POST",
      body: formdata,
    })
    .then( (response) => response.json() )
    .then( (responseJson) => {
          if (responseJson.length == 0){
            this.setState({ resultado: null , isSearching: false});
            //alert("¡¡Oops!!. Parece que está vacío!!.");
          }else{
            this.setState({ resultado: responseJson , isSearching: false});
            console.log("responseJson TRAJO", search);
          }
    });    
  };

  waitSearch = async (search) => {
    console.log(search)
    this.setState({ search, isSearching : true , resultado: null});
    if (timeOut) clearTimeout(timeOut)
    timeOut = setTimeout(() => {
      this.updateSearch(search)
    }, 500)

  }

  render() {
    const params = this.props.navigation.getParam('params','');
    //console.log("params",params);
    const nombreCategoria = 'Default';//this.props.navigation.getParam('data','');
    const { hayPromo , search, resultado, isSearching, itemChecked } = this.state
    console.log("isSearching", isSearching, itemChecked )
    return (
        <View style={[localStyles.container,{ backgroundColor: '#e5ddd5'}]}>
          { this.state.categoriasLoaded ? (
          <View style={{width:"100%"}}>
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
                    {/* <Divider style={{ borderRadius: 2, marginLeft: 15,marginRight: 15, backgroundColor: '#3498db', height: 3 }} /> */}
                    <SearchBar
                      placeholder="Busca aquí..."
                      onChangeText={this.waitSearch}
                      lightTheme={true}
                      containerStyle={{backgroundColor: "#fff", borderStyle:"solid", }}
                      inputContainerStyle={{ paddingRight: 5, paddingLeft: 5,borderRadius: 20, backgroundColor: "#efefef", fontSize: 8}}
                      value={search}
                    />
                  </View>
                  {isSearching && search.length > 0 && <View>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>
                  }
                  { resultado !== null && <View>
                       <FlatList
                            style={{width: "100%", marginBottom: 50, paddingTop: 5, backgroundColor: "#efefef", alignContent:'center' }}
                            data={resultado}
                            renderItem={({item}) => (
                              <TouchableOpacity
                                  style={{margin: 5, elevation: 5, borderWidth: 1, borderColor: "#efefef", marginBottom: 0,padding: 4, paddingBottom: 15,  borderRadius: 10, backgroundColor: "#fff"}}
                                  onPress={() => this.goPromo(item)}
                              >
                                    {/* <Image style={{width: 150, height: 100, margin: 0}}
                                          source={{uri : GLOBAL.BASE_URL+'/images/'+item.foto}}
                                          resizeMode="stretch"
                                    />
                                  <Text>{item.name}</Text> */}
                                  <Text style={{margin:15, marginTop: 5, fontWeight: "500", color: "#27ae60", backgroundColor: "#fff", textAlign:"right"}}>{item.name_parent}</Text>
                                  <Text style={{marginLeft: 4,fontSize: 18, color:"orange"}}>{item.name}</Text>
                                  <View style={{flexDirection: 'row', width: screenWidth}}>
                                    {/* <CacheImage
                                        style={localStyles.imageProductSquared}
                                        uri= {GLOBAL.BASE_URL+'/images/'+item.foto}
                                        crop={true}
                                    />    */}
                                    <Image 
                                        style={localStyles.imageProductSquared}
                                        source={{uri : GLOBAL.BASE_URL+'/images/'+item.foto}}
                                    />
                                    <View style={{width:0, flexGrow: 1, marginLeft: 3, marginRight: 20}}>
                                      <Text style={{marginRight: 10 , fontSize: 13, color:"#343434",flexWrap: 'wrap'}}>{item.detalle}</Text>
                                      { item.cboa_precio>0 ? 
                                        <Text style={localStyles.precio}>$ {item.cboa_precio}</Text>
                                      : null }
                                    </View>
                                  </View>
                              </TouchableOpacity>
                            )}
                      ></FlatList>                    
                  </View>}
                  {( search.length === 0 )&& <View> 
                        {/* <View style={{marginLeft: 0,height: 1, marginTop:0, color: "#ff7043", backgroundColor: "#2980b944", width: "100%", fontSize :18}}></View> */}
                        {
                          hayPromo !== null && (
                            <View style={{ marginTop: 0, backgroundColor: "#fff"}} >
                            <Text style={{marginLeft: 15, marginTop:10, color: "#ff7043", fontSize :18, fontFamily:"RussoOne-Regular"}}>Tenemos estas promociones!!!</Text>
                              <FlatList
                                style={{width: "100%", paddingBottom: 0, paddingTop: 5, backgroundColor: "#fff",}}
                                data={hayPromo}
                                horizontal={true}
                                renderItem={({item}) => (
                                  <TouchableOpacity
                                      style={{marginLeft: 13, marginTop: 4, marginBottom: 5, borderRadius: 10}}
                                      onPress={() => this.goPromo(item)}
                                  >
                                        <Image style={{width: 200, height: 150, margin: 0}}
                                              source={{uri : GLOBAL.BASE_URL+'/images/'+item.foto}}
                                              resizeMode="stretch"
                                        />
                                      <Text>{item.name}</Text>

                                  </TouchableOpacity>
                                )}
                              ></FlatList>
                              <View style={{marginLeft: 0,height: 1, marginTop:0, color: "#ff7043", backgroundColor: "#00000033", width: "100%", fontSize :18}}></View>
                          </View>
                          )
                        }

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
                                  style={{ elevation: 10, borderRadius: 10,borderWidth: 1, borderColor: "#efefef"}}
                              >
                                  <View style={localStyles.categoria} elevation={8}>
                                      <View style={{padding: 10, paddingTop: 0}}>
                                          <Text style={localStyles.name}>{item.name}</Text>
                                          <Text style={localStyles.simpleDetalle}>{item.detalle}</Text>
                                      </View>
                                      <View>
                                        {/* <CacheImage
                                            style={localStyles.image}
                                            uri= {GLOBAL.BASE_URL+'/images/'+item.foto}
                                        /> */}
                                        <Image 
                                            style={localStyles.image}
                                            source={{uri : GLOBAL.BASE_URL+'/images/'+item.foto}}
                                        />
                                      </View>
                                      {/* <CacheImage
                                        style={localStyles.imageBrand}
                                        uri= {GLOBAL.BASE_URL+'/images/'+item.foto}
                                      /> */}
                                        <Image 
                                            style={localStyles.imageBrand}
                                            source={{uri : GLOBAL.BASE_URL+'/images/'+item.foto}}
                                        />
                                        {
                                           this.state.itemChecked == index ? (
                                              <View style={[localStyles.checked, {}]}>
                                                  <Ionicons name='ios-checkmark-circle-outline' color='#fff' size={36} />
                                              </View>
                                        ) : null}
                                 </View>
                              </TouchableOpacity>
                            )}
                      />
                      <Button title='Refrescar'
                            onPress={() => {this._getBoard() }  }
                      />
                  </View>}
            </ScrollView>
          </View>
        ) : (
            this.state.fontLoaded ? (
              <View style={localStyles.welcome}>
                  <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
              </View>
            ) : null
        )}
        {this.state.perfil==="admin" &&  <ActionMenu2
              callbackFromParent={this._accionMenuPress}
              estosBotonesActivos={this.state.estosBotonesActivos}
            />}
        </View>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
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
    top: 4,
    right: 4,
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
    borderWidth: 0,
    borderColor: '#fff',
  },
  categoria : {
			   
					 
    width: '100%',
    //borderColor: "#aaaaaaaa",
				   
					
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
    marginTop: 0,
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
  },
  imageProductSquared : {
    width: screenWidth*0.30, 
    height: screenWidth*0.20,
    margin: 4,
  },       

})