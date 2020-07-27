import React, { Component } from 'react';
import { Button, 
         StyleSheet, 
         Text, 
         View, 
         Image, 
         TouchableHighlight, 
         TouchableOpacity,
         ProgressBarAndroid,
         Dimensions,
         FlatList,
         SectionList,
         ActivityIndicator,
         Animated,
        } from 'react-native';
import styles from '../styles/stylesOne';
import CacheImage from '../components/CacheImage';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font'
import ActionMenu2 from '../components/ActionMenu2';
import {AsyncStorage} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Fx from '../globals/Fx'
GLOBAL = require('../globals/globals');

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


const PRACTICE_TIME = 2* 1000;
let categorias = null;
let jsonFinal = new Array;
let jsonGrupo = new Array;

export default class cartaScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          fontLoaded: false, 
          categoriasLoaded: false,
          itemChecked: null,
          estosBotonesActivos: {"add": true,"delete":false, "edit": false},
          hora: '',
          heartLike: false,
          x1HeightLayout: null,
          x1Height:  screenHeight *.80,
          x1HeightAnimated:  new Animated.Value(screenHeight *.80),
          x1Full : true,
          perfil:null,
          hayPromo : null,
          search: '',
          isSearching: false,
          resultado: null,
        }

    }

    static navigationOptions = ({navigation}) => {
      return {
        headerTitle:()=> (<Text style={[localStyles.shadow,{paddingLeft: 2  , color: "#fff"}]} >TodoYA!</Text>),
        headerRight:() =>  (
          <View style={{marginRight: 12, flexDirection:'row'}}>
              <TouchableHighlight activeOpacity={0.7} underlayColor='#ccc'
                onPress={() => {  navigation.openDrawer() }}
                style={{width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center'}}
              >
                  <Ionicons name='ios-menu' color='#fff' size={36} />
              </TouchableHighlight>
          </View>
        ),
        headerTransparent: true,
        headerTintColor: '#fff',
        headerStyle : {
          //backgroundColor: '#3498db',
          backgroundColor: '#00000000',
        }
      };
    };

    async componentDidMount() { 
      await  Font.loadAsync({
        'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
        'Roboto-Thin': require('../../assets/fonts/Roboto/Roboto-Thin.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto/Roboto-Medium.ttf'),
      });
      this.setState({ fontLoaded: true });  
      this._getBoard();
      this.getTimeDate();
      const item = this.props.navigation.getParam('params');
      await AsyncStorage.setItem("fotoComercio",item.foto)
      const keyLogin = await AsyncStorage.getItem('keyLogin')
      this.setState({perfil:  JSON.parse(keyLogin)[0].tipo} )
      this._buscarPromos()      
    }

    _buscarPromos = async () => {
        const categoria = this.props.navigation.getParam('categoria','')
        const comercio = this.props.navigation.getParam('params','').cboa_id
        let formdata = new FormData();
        formdata.append("categoria", categoria)
        formdata.append("comercio", comercio)
        console.log(formdata)
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
    
    find_dimesions(layout){
      const {x, y, width, height} = layout;
      this.setState({x1HeightLayout: height})
    }

    getTimeDate() {
      var wDay = new Array('Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado')
      var nMonth = new Array('Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre')
      var nDay = new Date().getDay();
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() ; //Current Month
      var year = new Date().getFullYear(); //Current Year      
      var hours = new Date().getHours(); //Current Hours
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds      

      var day = wDay[nDay];
      var Mes = nMonth[month]

      this.setState({ hora: hours + ':' + ("00" + min).slice(-2) , fecha : day +', '+date+' de '+Mes })
    }

    _getBoard = async () => {
      //console.log('_getBoard(): ');
      //console.log(this.props.navigation.getParam('params').cboa_id);
      let formdata = new FormData();
      formdata.append('parent',this.props.navigation.getParam('params').cboa_id);
      await this.setState({categoriasLoaded:false});
      await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getBoard', {   
          method: "POST",
          body: formdata,
        })
        .then( (response) => response.json() )
        .then( (responseJson) => {
            if (responseJson.length == 0){
              //alert("¡¡Oops!!. Parece que está vacío!!.");
            }else{
              categorias = responseJson;
              //console.log(categorias)
              //this.setState({ categoriasLoaded: true, itemChecked: null });  
              //this._seleccionaItem({index: null, id: null }) 
              this.organizarPorGrupos(categorias);
              
            }
      });   
    }

  organizarPorGrupos(data) {
    jsonFinal = new Array;  
    jsonGrupo = new Array;  
    jsonGrupo.push('');
    let grupoAnterior;
    data.map((item, i) => {
      if (item.cboa_grupo != grupoAnterior ) {
        jsonGrupo.push(item.cboa_grupo);
        grupoAnterior = item.cboa_grupo;
        jsonFinal.push({"title":grupoAnterior, data:[]})
        jsonFinal[jsonFinal.length-1 ].data.push(item);
      }else{
        jsonFinal[jsonFinal.length-1 ].data.push(item);
      }
    })
    this.setState({ categoriasLoaded: true, itemChecked: null });  
    this._seleccionaItem({index: null, id: null }) 
    //console.log(jsonFinal);
  }

  _renderSectionList() {
    let renderThis = <SectionList 
                        sections={jsonFinal}
                        renderSectionHeader={({ section }) => (
                          <View  style={localStyles.SectionHeaderStyle}>
                            <Text style={localStyles.title3}> {section.title} </Text>
                          </View>
                        )}                                 
                        renderItem={({ item, index }) => (
                          <TouchableOpacity 
                            onPress={() => {this._goScreen(item)}}
                            delayLongPress={GLOBAL.LONG_PRESS_SECONDS}
                            onLongPress={() => { this._seleccionaItem({cboa_id: item.cboa_id}) }}
                            activeOpacity={0.7}
                            style={{ backgroundColor: '#fff', margin:2, marginLeft:5, marginRight: 5, padding: 10,borderRadius: 8,  elevation: 3, borderWidth: 1, borderColor: "#efefef"}}
                          >                          
                            <Text style={{marginLeft: 4,fontSize: 18, color:"orange"}}>{item.name}</Text>
                            <View style={{flexDirection: 'row', width: screenWidth}}>
                              <CacheImage
                                  style={localStyles.imageProductSquared}
                                  uri= {GLOBAL.BASE_URL+'/images/'+item.foto}
                                  crop={true}
                              />   
                              <View style={{width:0, flexGrow: 1, marginTop: 0, marginRight: 15}}>
                                <Text style={{fontSize: 13, padding: 4, paddingRight: 15,paddingTop:0,color:"#343434",flexWrap: 'wrap'}}>{item.detalle}</Text>
                                { item.cboa_precio>0 ? 
                                  <Text style={localStyles.precio}>$ {item.cboa_precio}</Text>
                                : null }
                              </View>
                            </View>
                            {
                              this.state.itemChecked == item.cboa_id ? (
                                  <View style={localStyles.checked}>
                                      <Ionicons name='ios-checkmark-circle-outline' color='#fff' size={36} />
                                  </View>
                                  ) : null
                            }                            
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item,index) => index.toString()}
                      ></SectionList>
    return renderThis;
  }


  _goScreen = (params) => {
    //console.log('Desde contenidoScreen: goScreen');
    //console.log(params.cboa_precio);
    console.log('con lo del parent >>>>')
    const paramsParent = this.props.navigation.getParam('params','')
    console.log("XXXXXX _________> paramsParent", paramsParent)
    console.log("XXXXXX _________> ", params)
    console.log('con lo del parent >>>>')
    if (this.state.itemChecked == null )
        this.props.navigation.navigate(params.cboa_go, { 
          params : params,
          paramsParent : this.props.navigation.getParam('params','')
        }); 
  }

  _seleccionaItem = (params) => {
    //console.log('selecciono: '+params.cboa_id)
    if (this.state.perfil !== "admin") return
    this.state.itemChecked == params.cboa_id ? this.setState({'itemChecked':null}) :this.setState({'itemChecked':params.cboa_id}) ;
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

  _accionMenuPress = (data) => {
    const params = this.props.navigation.getParam('params','');
    console.log('EXEL ESTE ES PARENT QUE ESTOY ENVIANDO parentId:' + params.cboa_id + " "+ this.state.itemChecked);
    let item = null
    if (categorias !== null ) {
      item = categorias.filter(item => item.cboa_id == this.state.itemChecked);
    } 
    //console.log(item[0]);
    switch(data){
      case 'add': data='Nuevo';break;
      case 'edit': data='Editar';break;
      case 'delete': data='borrar';break;
    }
    this.props.navigation.navigate('HandleBoard', {
      onGoBack : this._getBoard,
      params : {
        commingFrom: 'contenidoScreen',
        parentId: params.cboa_id,
        action: data,
        id: this.state.itemChecked,
        data: this.state.itemChecked == null ? null : (item==null?null:item[0]),
        go: 'Pedido',
        jsonGrupo: jsonGrupo,
      }
    }); 
  }

  _heartLike = () => {
    console.log(this.props)
    this.state.heartLike ? this.setState({heartLike: false}):this.setState({heartLike: true})
  }

  _OpenShrink = () => {
    const { x1Height, x1Full, x1HeightLayout,x1HeightAnimated } = this.state
    const newHeight = x1Full ? x1HeightLayout+100 : screenHeight *.80
    this.setState({x1Height : newHeight, x1Full : x1Full ? false : true });
    console.log('this.state.x1Height: '+newHeight)
    console.log(this.state.x1Height)
    Animated.timing(
      // Animate over time
      this.state.x1HeightAnimated, // The animated value to drive
      {
        toValue: newHeight, // Animate to opacity: 1 (opaque)
        duration: 200, // Make it take a while
      }
    ).start(); // Starts the animation    
  }

  render() {
    const item = this.props.navigation.getParam('params');
    const { hayPromo , search, resultado, isSearching } = this.state
    
    console.log("hayPromo",hayPromo);
    return (
      <View style={{ backgroundColor: '#efefef'}}>
      <ScrollView>
        <Animated.View style={[styles.container, {height: this.state.x1HeightAnimated}]} elevation={20}>
          <CacheImage
              style={[localStyles.image]}
              uri= {GLOBAL.BASE_URL+'/images/'+item.foto}
              crop={true}
              blurRadius={1}
          />   
          <LinearGradient
              style={{width: "100%", height: "100%", position:'absolute'}}
              colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.2)','rgba(0,0,0,0.7)']}
          />
          
          {this.state.fontLoaded && this.state.x1Full ? 
          <View style={{position: 'absolute', top: 100, left: 20}} >  
            <Text style={[localStyles.shadow,{fontSize: 50, color:'#fff', fontFamily:'Roboto-Thin'}]}>
              {this.state.hora}
            </Text>
            <Text style={[localStyles.shadow, {color:"#ffF", fontSize: 16 }]}>{this.state.fecha}</Text>   
            <View style={{flexDirection: 'row'}}>
              <Ionicons name='md-star' color='#fff' size={28} style={[localStyles.shadow, {}]}/>
              <Ionicons name='md-star' color='#fff' size={28} style={[localStyles.shadow, {}]}/>
              <Ionicons name='md-star' color='#fff' size={28} style={[localStyles.shadow, {}]}/>
              <Ionicons name='md-star' color='#fff' size={28} style={[localStyles.shadow, {}]}/>
              <Ionicons name='md-star' color='#fff' size={28} style={[localStyles.shadow, {}]}/>
            </View>       
            <Text style={[localStyles.shadow, {color:"#ffF", fontSize:16, paddingRight: 30, paddingTop: 15}]}>Horario de Atención{'\n'}08:00 am a 09:00 pm</Text>          
          </View> 
          : null }
          {this.state.x1Full ? 
            <View 
              style={{position:'absolute', top:100, right: 20, justifyContent:'center', alignItems: 'center'}} 
              onPress={() => {this._heartLike()}}
            >
              { this.state.heartLike ? 
                <Ionicons onPress={() => {this._heartLike()}} name="ios-heart" size={46}  color='#e74c3c' />
              : <Ionicons onPress={() => {this._heartLike()}} name="ios-heart-empty" size={46}  color='#ffffff55'  />
              }
            </View>
          : null}
          <View style={localStyles.titleBox}>   
          </View>
          <View style={{position: 'absolute', left: 0, bottom: 0, margin: 20,marginBottom: 30,}} 
                onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}  
          >
            {this.state.fontLoaded ? 
              <Text 
                  style={[localStyles.title1,localStyles.shadow]}
              >{item.name}</Text> : null }
            <Text style={[localStyles.shadow,{ color: '#fff', fontSize: 20}]} >
              {item.detalle}
            </Text>   
          </View>       
          <TouchableOpacity onPress={() => {this._OpenShrink()}} style={[localStyles.iconDown,{backgroundColor: '#fff'}]} elevation={15} >
              <MaterialCommunityIcons  name= {this.state.x1Full? 'chevron-up':'chevron-down'} size={25} color="#e74c3c" />
          </TouchableOpacity>              
        </Animated.View>
        <View style={{padding: 15, paddingTop:30}}>
          <Text style={localStyles.title2} >{item.name}</Text>
          <Text style={localStyles.paragraph} >
            {item.detalle}
          </Text>
        </View>

        {
          hayPromo !== null && (
            <View style={{ marginTop: 0, backgroundColor: "#fff"}} >
              <Text style={{marginLeft: 15, marginTop:10, color: "#e74c3c", fontSize :18, fontFamily:"RussoOne-Regular"}}>Tenemos estas promociones!!!</Text>
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

        { this.state.categoriasLoaded ? ( 
              this._renderSectionList()
          ) : (
            <View style={{zIndex: 1000}} >
             <ActivityIndicator  size={30} color={"#e74c3c"}/>
            </View> 
          )
        }
      </ScrollView>
      {this.state.perfil==="admin" &&  <ActionMenu2 
              callbackFromParent={this._accionMenuPress}
              estosBotonesActivos={this.state.estosBotonesActivos}
            />}      
      </View>
    );
  } 
}

const localStyles = StyleSheet.create (
  {
    image : {
        width: "100%",
        //resizeMode: "stretch",
        borderRadius:0,
        margin: 0,
        //height: screenWidth*0.80,
        height: '100%',
      },
      imageProduct : {
        /*width: screenWidth*0.25,
        resizeMode: "stretch",
        margin: 15,
        borderRadius: 8,
        height: screenWidth*0.25,*/
        width: screenWidth*0.15, 
        height: screenWidth*0.15,
        borderRadius: (screenWidth*0.15)/2, 
        margin: 15,
      },
      imageProductSquared : {
        width: screenWidth*0.30, 
        height: screenWidth*0.20,
        margin: 4,
      },       
    title1 : {
      //fontFamily: 'RussoOne-Regular',
      fontFamily: 'Roboto-Medium',
      color: "#fff", fontSize: 36,
    }  ,
    shadow: {
      color: '#fff',
      textShadowOffset: { width: 0.4, height: 0.4 },
      textShadowRadius: 1,
      textShadowColor: '#000',
    },    
    titleBox : {
      position: 'absolute', 
      //top:0, left: 0, 
      color: "#fff", fontSize: 36,
      //justifyContent: 'center',
      alignItems: 'center',
      height: screenWidth*0.50,
      width: screenWidth,
    },
    title2 : {
      fontFamily: 'RussoOne-Regular',
      color: "#3498db", fontSize: 22,
    }  ,
    title3: {
      fontFamily: 'RussoOne-Regular',
      backgroundColor: "#e74c3c", fontSize: 18,
      color: "#fff",
      marginTop: 20,
      marginRight: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingRight: 5,
    }  ,    
    paragraph: {
      fontSize: 16,
      fontWeight: '100',
      textAlign: 'justify',
      color: "#00000077",
    },
    SectionHeaderStyle: {
      flex: 1,
      alignItems: 'flex-end'
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
    precio: {
      fontSize: 18, color:"#e74c3c", textAlign: 'left',
      marginLeft: 4,
    },
    iconDown: {
      position: 'absolute',
      bottom: -30,
      borderWidth: 0,
      borderColor: 'white',
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 30,
      backgroundColor: 'orange',
      marginRight: 5,
    }      
   }
)