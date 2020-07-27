import * as React from 'react';
import { 
        Image, 
        View, 
        TextInput,
        StyleSheet,
        TouchableOpacity, 
        TouchableHighlight,
        ScrollView,
        KeyboardAvoidingView ,
        ActivityIndicator,
        Keyboard,
        Dimensions,
        Text,
        SectionList,
      } from 'react-native';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CacheImage from '../components/CacheImage';
import CustomButton from '../components/customButton';
import Cantidad from '../components/Cantidad';
import styles from '../styles/stylesOne';
import { CheckBox } from 'react-native-elements'
import ActionMenu2 from '../components/ActionMenu2';
import {AsyncStorage} from 'react-native';
import { Divider } from 'react-native-elements';
import MapaScreen from './mapScreen';
import { LinearGradient } from 'expo-linear-gradient';




GLOBAL = require('../globals/globals');
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


let didMountParams = null;
let didMountParamsParent = null;
let categorias;
let jsonFinal = new Array;
let jsonGrupo = new Array;
let checkboxSelected = new Array;

const ModalShow = (props) =>  {
      const { onPress } = props;
      return (
        <View style={localStyles.modal}>
          <View style={{overflow: 'hidden', 
                        margin: 15, backgroundColor: '#fff',
                        padding: 15, paddingBottom: 110, 
                        borderRadius: 10, minHeight: 300,
                        borderWidth: 2,
                        borderColor: "#fff",
                        alignItems: 'center',
                        }} elevation={10}>
            <Text style={{fontSize: 30}}>¡Qué bien!</Text>
            <Text style={{fontSize: 18, margin: 15}}>Enhorabuena!. Acabas de agregar un pedido a tu carrito. Puedes en este momento confirmar en 'PEDIR TODOYA!' para dar inicio al envío o bien puedes agregar otro pedido en el mismo local.</Text>
            <CustomButton 
                title={`Agregar mas +`}
                style={[localStyles.buttonModal,{position:'absolute',bottom:5, backgroundColor:'#5dade2'} ]}
                onPress={() =>{onPress("agregarMas")}}
            /> 
            <CustomButton 
                title={`Pedir TodoYa! `}
                style={[localStyles.buttonModal,{position:'absolute',bottom:56} ]}
                onPress={() =>{onPress("pedirTodoYa")}}
            />             
          </View>
        </View>
      )
  }

export default class pedidoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          direccion: null,
          telefono: null,
          preguntarPor: null,
          shrinkScreen: 0,         
          checked : false, 
          fontLoaded: false, 
          categoriasLoaded: false,
          itemChecked: null,
          estosBotonesActivos: {"add": true,"delete":false, "edit": false},
          Total : '$ 0.00',
          informacionAdicional: null,
          latitud : null,
          longitud: null,
          showModal : false,
          totalCalculado: 0,
          direccion: null,
          showMapa: false,
          ubicacion: null,
          perfil: null,
        }
    }

    async handleChange(data) {
      this.setState(data);
      AsyncStorage.setItem('direccion',this.state.direccion)
    }

    

    static navigationOptions = ({navigation}) => {
      return {
        headerTitle: ()=>(<Text style={[localStyles.shadow,{paddingLeft: 2  , color: "#fff"}]} >TodoYA!</Text>),
        headerRight: () =>  (
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
          backgroundColor: '#00000033',
        }
      };
    };  

    async componentDidMount() {
      this.getPermissionAsync();
      let esteTelefono = await AsyncStorage.getItem('esteTelefono');
      let esteNombre = await AsyncStorage.getItem('esteNombre');

      this.setState({telefono: esteTelefono})
      this.setState({preguntarPor: esteNombre})
      
      console.log()
      didMountParams = this.props.navigation.getParam('params');
      didMountParamsParent = this.props.navigation.getParam('paramsParent');
      //console.log(didMountParams)
      checkboxSelected = new Array;
      if (didMountParams.action != 'Nuevo') {
        this.setState((previousState) => (
           {...previousState,  
          }
        ))      
      }
      await this._getBoard();
      //this.goMaps()
      const ubicacion =  await AsyncStorage.getItem('ubicacion')
      console.log(ubicacion, ubicacion)
      const direccion = JSON.parse(ubicacion).direccion
      this.setState({direccion : direccion})
      const keyLogin = await AsyncStorage.getItem('keyLogin')
      this.setState({perfil:  JSON.parse(keyLogin)[0].tipo} )
      
    }
  
  componentWillUnmount() {
  }
  
  find_dimensions(layout){
    const {x, y, width, height} = layout;
    console.log(x);
    console.log(y);
    console.log(width);
    console.log(height);
  }

 
    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    }
  
    _getBoard = async () => {
      console.log('_getBoard(): ');
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
              this.setState({Total: `$ ${didMountParams.cboa_precio}.00`})
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
      let checkbox;
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
      //this._seleccionaItem({index: null, id: null }) 
      if (jsonFinal.length == 0) {
        this.setState({Total: `$ ${didMountParams.cboa_precio}.00`})
      }
    }

    _seleccionaItem = (params) => {
      if (this.state.perfil !== "admin") return
      console.log('selecciono: ',params)
      //this.state.itemChecked == params.cboa_id ? this.setState({'itemChecked':null}) :this.setState({'itemChecked':params.cboa_id}) ;
      this._accionMenuPress('edit', params);
    }

    _pressCheckBox(item, value) {
      return
      //this.setState({['cbox'+item.cboa_id]: !this.state['cbox'+item.cboa_id]});
      if (this.state['cbox'+item.cboa_id]){
        checkboxSelected = checkboxSelected.filter(thisItem => thisItem.cboa_id !== item.cboa_id);
        this.setState({['cantidad'+item.cboa_id] : "0", ['cbox'+item.cboa_id]: !this.state['cbox'+item.cboa_id]})
      }else{
        checkboxSelected.push({cboa_id:item.cboa_id, precio: item.cboa_precio, name: item.name })
        this.setState({['cantidad'+item.cboa_id]:1, ['cbox'+item.cboa_id]: !this.state['cbox'+item.cboa_id]})
        console.log(this.state)
      }
      //console.log("checkboxSelected",checkboxSelected)
      console.log("*parseInt(this.state['cantidad'+item.cboa_id])", parseInt(this.state['cantidad'+item.cboa_id]))
      let total = 0;
      checkboxSelected.map((item) => {
        total+= parseInt(item.precio);
      })
      //this.setState({Total: '$ '+ new Intl.NumberFormat("en-US").format(total)+'.00'})
      this.setState({Total: '$ '+ (total)+'.00'})
      this.setState({totalCalculado: total})
    }

    setValue = async (value, item) => {
      console.log(value, item, this.state)
      checkboxSelected = await checkboxSelected.filter(thisItem => thisItem.cboa_id !== item.cboa_id);
      if (value === 0) {
        this.setState({['cantidad'+item.cboa_id] : value, ['cbox'+item.cboa_id] : false})
      }else{
        await checkboxSelected.push({cboa_id:item.cboa_id, precio: item.cboa_precio, name: item.name, cantidad : value, grupo: item.cboa_grupo })
        this.setState({['cantidad'+item.cboa_id] : value, ['cbox'+item.cboa_id] : true})
      }
      console.log("*parseInt(this.state['cantidad'+item.cboa_id])", value, parseInt(this.state['cantidad'+item.cboa_id]))
      let total = 0;
      checkboxSelected.map((item) => {
        total+= parseInt(item.precio) * parseInt(this.state['cantidad'+item.cboa_id]);
      })
      this.setState({Total: '$ '+ (total)+'.00'})
      this.setState({totalCalculado: total})

    }

    _renderSectionList() {
      //console.log("jsonFinal", jsonFinal)
      let renderThis = <SectionList 
                          sections={jsonFinal}
                          style={{width:"100%"}}
                          renderSectionHeader={({ section }) => (
                            <Text style={[localStyles.label,{marginTop: 10, marginBottom: 10}]} >{section.title}</Text>
                          )}                                 
                          renderItem={({ item, index }) => (
                            <View
                                style = {{flexDirection: "row", backgroundColor: "#ffffff", margin: 4, maxWidth: '100%',}}
                            >
                              <CheckBox
                                  wrapperStyle={{width: screenWidth - 150}}
                                  activeOpacity={0.5}
                                  style={localStyles.itemCheckBox}
                                  //title={item.name+ ' [ $ '+ new Intl.NumberFormat("en-US").format(item.cboa_precio)+' ]' }
                                  title={item.name+ ' [ $ '+ item.cboa_precio +' ]' }
                                  checked= { this.state['cbox'+item.cboa_id] }
                                  onPress={() => this._pressCheckBox(item, item.cboa_id)}
                                  delayLongPress={GLOBAL.LONG_PRESS_SECONDS}
                                  onLongPress={() => { this._seleccionaItem(item) }}
                                  value={item.cboa_id}
                                  containerStyle={{backgroundColor:"transparent", borderWidth: 0,  margin: 0}}
                              />    
                              <View style={{ backgroundColor: "#fff", justifyContent: 'center'}}>
                                <Cantidad 
                                    minValue={0} maxValue={10} 
                                    value={this.state['cantidad'+item.cboa_id]===null || this.state['cantidad'+item.cboa_id] === undefined ? 0 : this.state['cantidad'+item.cboa_id] } 
                                    onChange={(value) => this.setValue(value, item)} 
                                />
                              </View>
                            </View>                        
                          )}
                          keyExtractor={(item,index) => index.toString()}
                        ></SectionList>
      return renderThis;
    }

    _accionMenuPress = async (data, item) => { 
      console.log("XXXXXXXXXXXXXXXXXXX")
      const params = this.props.navigation.getParam('params','');
      //console.log(params);
      //var item = null
      console.log('ESTE ES PARENT QUE ESTOY ENVIANDO parentId:' + params.cboa_id + " "+ this.state.itemChecked, categorias);
      // if (categorias!== null && categorias!==undefined){
      //   item = await  categorias.filter(item => item.cboa_id == this.state.itemChecked);
      //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>  FILTE ", "item", item, this.state.itemChecked)
      //   console.log(item[0])
      // }else{
      //   // this.setState({itemChecked:null});
      // }
      //console.log(item[0]); 
      switch(data){
        case 'add': data='Nuevo';break;
        case 'edit': data='Editar';break;
        case 'delete': data='borrar';break;
      }
      console.log(" >>>>>>>>>>>>>>>> this.state.itemChecked",this.state.itemChecked)
      
      this.props.navigation.navigate('HandleBoardPedido', {
        onGoBack : this._getBoard,
        params : {
          commingFrom: 'pedidoScreen',
          parentId: params.cboa_id,
          action: data,  
          id: this.state.itemChecked,
          data: item,
          go: 'detalle',
          jsonGrupo: jsonGrupo,
        }
      }); 
    }
  
    goMaps() {
      //this.props.navigation.navigate('Mapa', {handleChange: this.handleChange.bind(this), commingFrom: 'Pedido'})
      this.setState({showMapa: true})
    }

    actionOverTheMap = async (action, ubicacion) => {
        switch(action) {
            case "useAddress": 
                  //await this.props.action()
                  this.setState({showMapa : false, direccion: ubicacion.direccion, ubicacion  })
        }
    }
      
    async _confirmPedido() {
      if (this.state.direccion==null) {
        alert('Oops!!. Falta definir una dirección.')
        return
      }
      if (this.state.Total=="$ 0.00") {
        alert('Oops!!. No hay nada por pagar.')
        return
      }
      const pedido = { 
                        direccion : this.state.direccion, detalle : checkboxSelected,
                        informacionAdicional: encodeURIComponent(this.state.informacionAdicional),
                        comercio: didMountParamsParent.name,
                        idComercio: didMountParamsParent.cboa_id,
                        productName: didMountParams.name,
                        IdProduct: didMountParams.cboa_id,
                        fotoComercio: didMountParamsParent.foto,
                        detalleComercio: didMountParamsParent.detalle,
                        precio: didMountParams.cboa_precio,
                        totalCalculado: this.state.totalCalculado,
                        telefono: this.state.telefono,
                        preguntarPor: this.state.preguntarPor,
                     }
      
      //AsyncStorage.removeItem("JSONpedido");

      const JSONpedido = await AsyncStorage.getItem('JSONpedido')
      
      if (JSONpedido===null) {
        let JSONpedidoArray = new Array(pedido)
        await AsyncStorage.setItem('JSONpedido',JSON.stringify(JSONpedidoArray))
        //console.log(JSONpedidoArray)

      }else{
        //await AsyncStorage.getItem('JSONpedido').then(console.log)
        let JSONpedidoArray = new Array(...JSON.parse(JSONpedido))
        JSONpedidoArray.push(pedido)
        //console.log(JSONpedidoArray)
        await AsyncStorage.setItem('JSONpedido',JSON.stringify(JSONpedidoArray))
      }
      this.setState({showModal: true})
      await AsyncStorage.setItem('idComercioActual',didMountParamsParent.cboa_id,)
      await AsyncStorage.setItem('estadoPedidoActual','enCreacion')
      await AsyncStorage.setItem('esteTelefono',this.state.telefono)
      await AsyncStorage.setItem('esteNombre',this.state.preguntarPor)
      console.log('>>>>>> '+await AsyncStorage.getItem('estadoPedidoActual'))
      this.setState({estadoPedidoActual : 'enCreacion'})
    }

    adminModal(number) {
      switch(number) {
        case "agregarMas": 
          this.props.navigation.goBack()
        break;
        case "pedirTodoYa":
          this.props.navigation.goBack()
          this.props.navigation.navigate('Carrito')
        break;
      }
    }
    
  render() {
    const params = this.props.navigation.getParam('params');
    const paramsParent = this.props.navigation.getParam('paramsParent');
    const { cboa_ocultarnombre } = params
    console.log("render this.state", this.state, GLOBAL.BASE_URL+'/images/'+params.cboa_ocultarnombre, paramsParent);
    const { showMapa } = this.state
    
    if (!showMapa) { 
      return (
          <KeyboardAvoidingView
            style={{flex: 1, maxWidth: '100%'}}
            behavior='height'
          >
            <View style={[localStyles.container]}>
                  <ScrollView style={{flex:1, width:'100%', marginBottom: 55}}> 
                  <View style={styles.container} elevation={15}>
                    <View
                        style={[localStyles.image, {}]}
                    >
                      <Image style={{width: "100%", height: "100%"}} 
                            source={{uri : GLOBAL.BASE_URL+'/images/'+params.foto}} 
                            resizeMode="stretch"
                      />
                      {cboa_ocultarnombre == "false" && <LinearGradient
                        style={{width: "100%", height: "100%", position:'absolute'}}
                        colors={['transparent', 'transparent', 'rgba(0,0,0,0.2)','rgba(0,0,0,0.7)']}
                      />}  
                      {/* <CacheImage
                        style={{width:360, height: "100%", }}
                        uri= {GLOBAL.BASE_URL+'/images/'+params.foto}
                      /> */}
                    </View>
                    {cboa_ocultarnombre == "false" && <View 
                        style={{position: 'absolute', left: 0, bottom: 0, margin: 20,marginBottom: 30,}}
                        onLayout={(event) => { this.find_dimensions(event.nativeEvent.layout) }} 
                    >
                      <Text 
                            style={[localStyles.title1,localStyles.shadow]}
                        >{paramsParent.name}</Text>
                      <Text style={[localStyles.shadow,{ color: '#fff', fontSize: 18}]} >
                        {paramsParent.detalle}
                      </Text>   
                    </View>    }
                  </View>
                  <View style={{padding: 20, paddingTop:30}}>
                    <Text style={localStyles.title2} >{params.name}</Text>
                    <Text style={localStyles.paragraph} >
                      {params.detalle}
                    </Text>
                  </View>        
                    <Text style={[localStyles.labelSmall, {fontSize:14}]} >Dirección de envío</Text>
                    
                    <View style={{flexDirection: 'row'}}>
                        <TextInput 
                          style={[localStyles.inputText,{width: screenWidth-50}]}
                          placeholder='Escriba la dirección de envío'
                          onChangeText={(direccion) => this.setState({direccion})}
                          value={this.state.direccion}
                          maxLength={80}
                        />            
                        <TouchableOpacity
                          style={{width: 50, alignContent:"center", alignItems: "center", flex:1}}
                          onPress={() => {this.goMaps()}}
                        >
                          <MaterialCommunityIcons name='map-marker' color='#3498db' size={45} />
                        </TouchableOpacity>
                    </View>          
                    <View>
                      <Text style={[localStyles.labelSmall,{fontSize:14}]}>Número de Teléfono:</Text>  
                      <Text style={[localStyles.labelSmall]}>El siguiente es el teléfono que aparece registrado o el último que has dicho, pero puedes cambiarlo si deseas</Text>  
                      <TextInput
                        style={[localStyles.inputText,{}]}
                        onChangeText={(telefono) => this.setState({telefono})}
                        value={this.state.telefono}
                      />
                      <Text style={[localStyles.labelSmall,{fontSize:14}]}>Preguntar por:</Text>  
                      <Text style={[localStyles.labelSmall]}>EL mensajero preguntará por ti, pero puedes cambiar el nombre para que pregunte por otra persona</Text>  
                      <TextInput
                        style={[localStyles.inputText,{}]}
                        onChangeText={(preguntarPor) => this.setState({preguntarPor})}
                        value={this.state.preguntarPor}
                      />
                    </View>  
                    { this.state.categoriasLoaded ? ( 
                        this._renderSectionList()
                    ) : null }
                    <Text style={[localStyles.label,{marginTop: 10, marginBottom: 10, fontSize: 16}]} >Detalla un poco tu pedido</Text>
                    <TextInput 
                      style={[localStyles.inputText,{fontSize: 15, margin: 15, marginTop: 0, width: screenWidth - 30, borderRadius: 10}]}
                      multiline={true}
                      numberOfLines={4}
                      placeholder='¿Deseas agregar información adicional a tu pedido?'
                      onChangeText={(informacionAdicional) => this.setState({informacionAdicional})}
                      value={this.state.informacionAdicional}
                      maxLength={180}
                    />          
                  </ScrollView>
            
                  <CustomButton 
                      title={`[ ${this.state.Total} ] PA'L CARRITO`}
                      style={[styles.buttonViewLogin, {fontSize: 16, position:'absolute',bottom:0, marginBottom: 0, backgroundColor: 'blue'}]}
                      onPress={() =>{this._confirmPedido()}}
                  />  
            </View>
            {this.state.perfil==="admin" &&  <ActionMenu2 
              callbackFromParent={this._accionMenuPress}
              estosBotonesActivos={this.state.estosBotonesActivos}
            />}
            { this.state.showModal ? 
            <ModalShow
              onPress={(number) => {this.adminModal(number)}}
            ></ModalShow>
            : null }
          </KeyboardAvoidingView>
        )
      }else{
        return (
          <MapaScreen
              actionOverTheMap={this.actionOverTheMap}
          />
        )
      }
  }
}

const localStyles = StyleSheet.create({
  container : { flex: 1, alignItems: 'center', paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth:"100%",
    height: screenWidth*0.25,
    backgroundColor: 'transparent',
  },
  iconCamera : {
    
  },
  image: {  
    /*width: screenWidth*0.25, 
    height: screenWidth*0.25, 
    borderRadius: (screenWidth*0.25)/2,*/
    width: '100%',
    height: screenHeight*0.5, 
    borderRadius: 0,
  },
  inputText : {
    width:'100%', 
    padding: 10,
    paddingLeft: 20, 
    color:'#3498db',
    fontSize: 16, 
    backgroundColor:'#eeeeee',
    marginTop: 4,
  },
  label: {
    fontSize: 22,
    color: "#e67e22",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
    fontWeight: "400",
  },
  labelSmall: {
    fontSize: 12,
    color: "#3f3f3f",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
  },
    itemCheckBox : {
    fontSize: 10,
    width: screenWidth - 50,
    color: 'red',
  },
  title2 : {
    fontFamily: 'RussoOne-Regular',
    color: "#3498db", fontSize: 22,
    textAlign: 'center',
  }  ,
  title3: {
    //fontFamily: 'RussoOne-Regular',
    color: "#e74c3c", fontSize: 18,
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  }  ,    
  paragraph: {
    fontSize: 16,
    fontWeight: '100',
    textAlign: 'justify',
    color: "#00000077",
  },
  shadow: {
    color: '#fff',
    textShadowOffset: { width: 0.4, height: 0.4 },
    textShadowRadius: 1,
    textShadowColor: '#000',
  }, 
  title1 : {
    //fontFamily: 'RussoOne-Regular',
    fontFamily: 'Roboto-Medium',
    color: "#fff", fontSize: 30,
  }  ,
  modal : {
    position: 'absolute', 
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor:'#00000088', 
    justifyContent: 'center', alignContent: 'center',
  },
  buttonModal: {
    height: 50, 
    padding: 0, 
    width: '105%', 
    margin: 0, 
    borderRadius: 0, 
  }
})