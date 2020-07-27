import React, { Component } from 'react';
import { 
        Button, 
        Text, 
        View, 
        Image, 
        TouchableOpacity, 
        ProgressBarAndroid ,
        StyleSheet,
        Dimensions,
        TouchableHighlight,
        SectionList,
        FlatList,
        ToastAndroid, 
      } from 'react-native';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';
import * as Font from 'expo-font'
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import CacheImage from '../components/CacheImage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MyCard from '../components/MyCard';
import CustomButton from '../components/customButton';
import * as Fx from '../globals/Fx'


GLOBAL = require('../globals/globals');

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let JSONpedido = null
let prevSelected = null
let pedido = null
let Total = 0

export default class carritoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pedido:null,
            fontLoaded: false,
            x1HeightLayout: null,
            x1Height:  screenHeight *.80,
            selected: null,
            itemChecked: null,
            pedidoLoaded: true,
            estadoPedidoActual: null,
        }

    }

    static navigationOptions = ({navigation}) => {
      return {
        headerTitle: ()=>(<Text style={[localStyles.shadow,{paddingLeft: 2  , color: "#fff"}]} >TodoYA!</Text>),
        headerRight: () => (
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
        },
      };
    };    

    async componentDidMount() {
        this.subs = [
          this.props.navigation.addListener('didFocus', () => this.isFocused()),
        ];
        await  Font.loadAsync({
          'RussoOne-Regular': require('../../assets/fonts/Russo_One/RussoOne-Regular.ttf'),
          'Roboto-Thin': require('../../assets/fonts/Roboto/Roboto-Thin.ttf'),
          'Roboto-Medium': require('../../assets/fonts/Roboto/Roboto-Medium.ttf'),
        });
        this.setState({ fontLoaded: true });   
       // this.isFocused()
       
    }

    async componentWillUnmount() {
      this.subs.forEach(sub => sub.remove());
    }

    isFocused =  async  () => {
      const valor =  await AsyncStorage.getItem('estadoPedidoActual')
      console.log('valor: ' +valor)
      this.setState({estadoPedidoActual : valor })
      if (valor == 'solicitado') {
        this.props.navigation.navigate('Avance Pedido')
      }else {
        JSONpedido = JSON.parse(await AsyncStorage.getItem("JSONpedido"))
        JSONpedido == null ? pedido=null : pedido = JSONpedido[0]
        JSONpedido == null ? console.log('IsNull') : console.log('isNOTnull'  )
        this.setState({pedido: pedido})
        console.log(this.state.pedido)
      }
    }

  _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        retrieveStorage.value =  value;
        //await this.props.navigation.navigate('AppStackPpal', {})
      }else{
        console.log('_retrieveData: error: logoScreen: '+value)
      }
    } catch (error) {
      // Error retrieving data
    }
  };    

  find_dimensions(layout){
    const {x, y, width, height} = layout;
    this.setState({x1HeightLayout: height + 70})
  }

  markDelete = async (index) => {
    this.setState({pedidoLoaded: false})
    if (this.state.selected==null) {
      this.setState({selected: index})
    }else{
      if (this.state.selected==index) {
        this.setState({selected: null})
      }
    }
    const newJSONpedido = await JSONpedido.slice(0,index).concat(JSONpedido.slice(index+1,JSONpedido.length))
    JSONpedido = newJSONpedido
    AsyncStorage.setItem('JSONpedido',JSON.stringify(JSONpedido))
    if (JSONpedido.length == 0 ) {
       console.log(JSONpedido.length + " xsdssjfnsdklgsnk ")
       await AsyncStorage.setItem("estadoPedidoActual", 'noHay')
       this.setState({estadoPedidoActual : await AsyncStorage.getItem('estadoPedidoActual') })
       await Fx._storeData("idComercioActual", "")
    }
    this.setState({pedidoLoaded: true})
  }

  _seleccionaItem = (params) => {
    this.state.itemChecked == params.index ? this.setState({'itemChecked':null}) :this.setState({'itemChecked':params.index}) ;
    //console.log(this.state.itemChecked)
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

    this.setState({ hora: hours + ':' + ("00" + min).slice(-2) , 
                    fecha : day +', '+date+' de '+Mes, 
                    fechaHora: year+"-"+("00" + parseInt(month+1)).slice(-2) +"-"+("00" + date).slice(-2) + " " + ("00" + hours).slice(-2) + ':' + ("00" + min).slice(-2) 
                  })
    console.log(this.state.fechaHora)
  }

  pedirYa = async () => {
    const keyLogin = await AsyncStorage.getItem('keyLogin')
    const usuarioId = JSON.parse(keyLogin)[0].usuario_id
    console.log('this.state.fechaHora '+this.state.fechaHora)
    const gpsLocation = await AsyncStorage.getItem('gpsLocation')
    await this.getTimeDate()

    let progreso = new Array( 
      {progreso: "Registrado", done: true , fechaHora: this.state.fechaHora, descripcion:'En este momento su pedido se encuentra pendientes de asignación a un mensajero' },
      {progreso: "Asignado", done: false, fechaHora: '0000-00-00 00:00', descripcion: 'Su pedido ha sido asignado a un mensajero'},
      {progreso: "Preparacion", done: false, fechaHora: '0000-00-00 00:00', descripcion: 'Su pedido está siendo preparado' },
      {progreso: "Recogido", done: false, fechaHora: '0000-00-00 00:00', descripcion: 'Su pedido ha sido recogido para ser entregado' },
      {progreso: "Entregado", done: false, fechaHora: '0000-00-00 00:00', descripcion: 'Su pedido ha sido entregado' }
    )
    console.log("JSONpedido: OJO : ",JSONpedido)
    const ubicacion = await Fx._retrieveData('ubicacion')
    const ubicacion_comercio = await Fx._retrieveData('ubicacion_comercio')
    let formdata = new FormData()
    formdata.append('usuarioId',usuarioId)
    formdata.append('fechaHoraIngreso',this.state.fechaHora)
    formdata.append('totalPedido',Total)
    formdata.append('JSONpedido',encodeURI(JSON.stringify(JSONpedido)))
    formdata.append('gps',gpsLocation)
    formdata.append('progreso',encodeURI(JSON.stringify(progreso)))
    formdata.append('action','Nuevo')
    formdata.append('ubicacion',ubicacion)
    formdata.append('ubicacion_comercio',ubicacion_comercio)
    console.log(formdata);
    await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/savepedido', {   
        method: "POST",
        body: formdata,
      })
      .then( (response) => response.json())
      .then( (responseJson) => { 
          if (responseJson.length == 0){
            alert("¡¡Oops!!. Problemas para guardar la información.");
          }else{
            this.setState({waittingWhileSaving: false});
            ToastAndroid.showWithGravity(responseJson[0].message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            if (responseJson[0].success == 'ok'){
              console.log(decodeURIComponent(responseJson[0].sql))
              //this._onGoBack();
              AsyncStorage.setItem("estadoPedidoActual",'solicitado')
              AsyncStorage.removeItem('JSONpedido')
              this.setState({estadoPedidoActual:'solicitado'})
              this.props.navigation.navigate('Avance Pedido')
            }                  
          }
    }).catch((e) => { 
        this.setState({waittingWhileSaving: false});
        alert(e)
    });                
  }

  renderPedido =  (JSONpedido) => {
    console.log('LLAMA AL RENDER') 
    let subTotal =0
    if (JSONpedido !== null) {
      JSONpedido.map((item, i) => {
        subTotal += parseInt(item.totalCalculado==0 ? item.precio : item.totalCalculado)
      })
    }
    console.log(JSONpedido)
    let rPedido = null
    const fontSize= 20
    const valorEnvio=5000
    Total = subTotal + valorEnvio
    rPedido = <View>
        <View style={[localStyles.card]}> 
          <View style={styles.sameRow}>
              <Text style={[localStyles.textShow, {color:'#2980b9'}]}>Mi pedido</Text>
          </View>
        </View>        
        <FlatList
          data={JSONpedido}
          renderItem={({ item,index }) =>
            <TouchableOpacity
              delayLongPress={GLOBAL.LONG_PRESS_SECONDS}
              onLongPress={() => { this._seleccionaItem({index: index}) }}
            >
              <MyCard DATA={item} index={index} 
                     onPress={() => {this.markDelete(index)}}
                     onSwipeDelete={(index) => this.markDelete(index)}
                     selected={this.state.selected == item.IdProduct ? true : false}>
              </MyCard>
              {
                this.state.itemChecked == index ? (
                    <View style={localStyles.checked}>
                        <Ionicons name='ios-checkmark-circle-outline' color='#fff' size={36} />
                    </View>
                    ) : null
              }
            </TouchableOpacity>
          }
          keyExtractor={(item,index) => index.toString()}
        />
        <View style={[localStyles.card]}> 
          <View style={styles.sameRow}>
              <Text style={[localStyles.textShow]}>Sub total: </Text>
              <Text style={[localStyles.textShow, { position:'absolute', right:10}]}>
                  $ {subTotal}.00
              </Text>
          </View>
          <View style={styles.sameRow}>
              <Text style={localStyles.textShow}>Vlr. Envío: </Text>
              <Text style={[localStyles.textShow, { position:'absolute', right:10}]}>
                  $ {valorEnvio}.00
              </Text>
          </View>
          <Divider style={{ backgroundColor: "#2ed573", marginTop: 4, marginBottom: 4 }} />
          <View style={styles.sameRow}>
              <Text style={localStyles.textShow}>Total a pagar: </Text>
              <Text style={[localStyles.textShow,{position:'absolute', right:10}]}>
                  $ {Total}.00
              </Text>
          </View>
        </View>        
    </View>
    return rPedido

  }

  

  render() {
    //const pedido = JSON.parse(this.state.pedido)
    const { pedido } = this.state
    console.log('this.state.estadoPedidoActual: '+this.state.estadoPedidoActual)
    //console.log(this.state.pedido)
    //console.log('cthis.state.estadoPedidoActual: '+this.state.estadoPedidoActual)
    return (
        <View style={{flex: 1, backgroundColor: '#e5ddd5', paddingBottom: 0, width: '100%'}}>
          { this.state.estadoPedidoActual == 'noHay' || this.state.estadoPedidoActual == null ? 
            <View style={styles.container}>
              <View  style={styles.logoContainer}>
                  <Image style={styles.logoImage}
                    source={require('../images/emptyBox.png')}
                    />
                  <Text style={{color: '#0984e3', fontSize: 15, margin: 15, textAlign:'center'}}>Lo siento!! Parece que no tienes pedido alguno.</Text>               
              </View>
            </View>
          : this.state.estadoPedidoActual == 'enCreacion' ?
            <ScrollView 
              contentContainerStyle={{paddingBottom: 50}}
            >
                {this.state.pedido!=null && this.state.fontLoaded ? 
                  <View style={[styles.container, {height: this.state.x1HeightLayout}]} elevation={35}>
                    <CacheImage
                      style={localStyles.image}
                      uri= {GLOBAL.BASE_URL+'/images/'+pedido.fotoComercio}
                    />
                    <View style={{position: 'absolute', left: 0, bottom: 0, margin: 20,marginBottom: 5,}} 
                          onLayout={(event) => { this.find_dimensions(event.nativeEvent.layout) }}  
                    >
                      {this.state.fontLoaded ? 
                        <Text 
                            style={[localStyles.title1,localStyles.shadow]}
                        >{pedido.comercio}</Text> : null }
                      <Text style={[localStyles.shadow,{ color: '#fff', fontSize: 20}]} >
                        {pedido.detalleComercio}
                      </Text>   
                    </View>   
                  </View>
              : null }
              <View>
                  {this.state.pedidoLoaded ? this.renderPedido(JSONpedido) : null}
              </View>
            </ScrollView>	: 
            <Text>Solicitado</Text>
          }
          {this.state.estadoPedidoActual == 'enCreacion' ?
          <CustomButton 
            title={'Pedir YA!'}
            style={[{position:'absolute',left:0, borderRadius:0, height: 50, bottom:0, marginBottom: 0, backgroundColor: '#ff793f',width: '100%'}]}
            onPress={() =>{this.pedirYa()}}
          />
          : null} 
        </View>

    );
  } 
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
   // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image : {
    width: "100%",
    //resizeMode: "stretch",
    borderRadius:0,
    margin: 0,
    //height: screenWidth*0.80,
    height: '100%',
  },
  title1 : {
    fontFamily: 'Roboto-Medium',
    fontSize: 35,
    padding: 5,
    paddingTop: 10,
  },
  boxData : {
    fontSize: 18,
    backgroundColor: '#ecf0f1',
    color : '#7f8c8d',
    padding: 5,
    paddingTop: 0,
    margin: 5,
    marginBottom: 0.5,
    paddingLeft: 10
  },
  shadow: {
    color: '#fff',
    textShadowOffset: { width: 0.4, height: 0.4 },
    textShadowRadius: 1,
    textShadowColor: '#000',
  }, 
  card: {
    flex: 1,
    shadowColor: '#2AC062',
    shadowOpacity: 0.4,
    shadowOffset: { height: 10, width: 0 },
    shadowRadius: 20,
    //alignItems: 'center',
    margin: 5, marginLeft: 18, marginRight: 18,
    borderRadius: 8,
    padding: 15,// paddingLeft: 16, paddingRight: 10,
    color: "#00000055",
    backgroundColor: '#fff',
    color: "#fff",
  },
  sameRow : {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    color: "#fff",
  },
  textShow: {
    fontSize: 18,
    color:"#ee5253"
  }
  
})