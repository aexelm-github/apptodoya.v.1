import * as React from 'react';
import { 
        Image, 
        View, 
        TextInput, 
        StyleSheet,
        TouchableOpacity, 
        TouchableHighlight,
        ScrollView,
        Picker ,
        ActivityIndicator,
        Keyboard,
        Dimensions,
        Text,
        KeyboardAvoidingView,
      } from 'react-native';
//import { Constants} from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import CacheImage from '../components/CacheImage';
import CustomButton from '../components/customButton';
import DraggList from '../components/DraggList';
import styles from '../styles/stylesOne';
import {AsyncStorage} from 'react-native';
import MapaScreen from './mapScreen';
import { CheckBox } from 'react-native-elements'

GLOBAL = require('../globals/globals');

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

let didMountParams = null;

let arrayGrupos = []
let COLORS = GLOBAL.color;
let DATA_SORTED=[]


export default class ImagePickerX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      name: null,
      detalle: null,
      grupo: null,
      precio: null,
      fileName: null,
      fileNameBrand: null,
      URImanipulatedFile: null,
      id: null,
      waittingWhileSaving : false,
      shrinkScreen: 0,
      tipoGo: 'Contenido',
      direccion: null,
      showMapa: false,
      ubicacion: null,
      ocultarnombre: false,
      promocion: false,
      needsAddress :false,
      listaOrdenGrupos : null,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: ()=>(<Text>{navigation.getParam('params').action}</Text>),
      headerRight: () =>  (
        <View style={{marginRight: 8, flexDirection:'row'}}>
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

  async componentWillMount(){
    
  }

  async componentDidMount() {
    this.getPermissionAsync();
    didMountParams = this.props.navigation.getParam('params');
    console.log("didMountParams",didMountParams);
    if (didMountParams.action != 'Nuevo') {
      const { name, detalle, cboa_grupo, cboa_precio, cboa_go, cboa_ubicacion, cboa_ocultarnombre , cboa_promocion} = didMountParams.data
      await this.setState( (previousState) => (
         {...previousState,  
          'name':name, 
          'detalle':detalle, 
         // 'grupo':cboa_grupo,
          'grupo': didMountParams.commingFrom=="comerciosScreen" ? name :  cboa_grupo, 
          'precio':cboa_precio ,
          'ocultarnombre':cboa_ocultarnombre == 'true' ? true : false,
          'promocion':cboa_promocion == 'true' ? true : false,
          'tipoGo': didMountParams.commingFrom=="contenidoScreen" ? 'Pedido' :  cboa_go, 
          'ubicacion': cboa_ubicacion===null || cboa_ubicacion==="null" || cboa_ubicacion===undefined || cboa_ubicacion==="" ? null : JSON.parse(cboa_ubicacion),
          'direccion': cboa_ubicacion===null || cboa_ubicacion==="null" || cboa_ubicacion===undefined || cboa_ubicacion==="" ? null : JSON.parse(cboa_ubicacion).direccion
        }
      ))    
      console.log(" XXXXXXXXXXXXXXXXXX VIENE ASI ", cboa_go, this.state.tipGo)
      this._getListaGrupos()
    }else{
      didMountParams.go == 'Pedido' ? this.setState({tipoGo : 'Pedido'}) : null;
    }
    if (didMountParams.parentId == 1) {
      this.setState({needsAddress: true})
    }
  }


  _getListaGrupos = async () => {
    let formdata = new FormData();
    formdata.append('parent',didMountParams.data.cboa_id);
    this.setState({waittingWhileSaving: true});
    await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/getListaGrupos', {   
        method: "POST",
        body: formdata,
      })
      .then( (response) => response.json() )
      .then( (responseJson) => {
          if (responseJson.length == 0){
            //alert("¡¡Oops!!. Problemas para tratar la información.");
            this.setState({waittingWhileSaving: false});
          }else{
            console.log("responseJson order list",responseJson);
            var sort = responseJson.sort(function(a, b){
                return parseInt(a.cboa_orden) - parseInt(b.cboa_orden);
            });
            console.log("sortJson", sort)
            var dataDragList = new Array()
            sort.map((item, index) => {
              const key =  `item-${index}`
              const label =  item.cboa_grupo
              const backgroundColor =  COLORS[index-GLOBAL.color.length*parseInt(index/GLOBAL.color.length)] 
              const cboa_parent = item.cboa_parent
              dataDragList.push({key, label, backgroundColor, cboa_parent})
            })
            console.log(dataDragList)
            this.setState({waittingWhileSaving: false, listaOrdenGrupos: dataDragList})
            DATA_SORTED = dataDragList
          }
    });         
  }


_keyboardDidShow = (e) => {
    keyboardParams = {
        keyboardHeight: e.endCoordinates.height,
        normalHeight: Dimensions.get('window').height, 
        shortHeight: Dimensions.get('window').height - e.endCoordinates.height, 
    };         
    console.log(keyboardParams);
    this.setState({shrinkScreen : keyboardParams.keyboardHeight - 68   });
}

_keyboardDidHide = () => {
    console.log('Keyboard Hidden');
    this.setState({shrinkScreen : 0 })

}

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [ { resize : { widht: 480, height: 270 } } ],
        [ {compress : 1 }] 
      );
      this.setState({'URImanipulatedFile': manipResult.uri});
    }
  };

  upLoadImage = async (image_uri) => {
//    let base_url = 'http://45.56.114.181/todoyaup/uploadimg.php';
    let base_url = GLOBAL.BASE_URL+'/index.php/Upload_img';
    let uploadData = new FormData();
    uploadData.append('submit','ok');
    uploadData.append('file', {type: 'image/jpg', uri: image_uri, name: 'uploadimagetmp.jpg'});
    //API that use fetch to input data to database via backend php script
    fetch(base_url,{
        method: 'POST',
        body: uploadData
      }).then(response => response.json())
        .then(response => { 
          if (response.status) {
            this.setState({'fileName' : response.fileName});
            this._sendDataToServer();
          }else{
            alert( response.message);
            this.setState({waittingWhileSaving: false});
          }
        }).catch((error) => {
            console.error('Ojo!! Ocurrió un error al subir la imagen. ' + error);
            this.setState({waittingWhileSaving: false});
        });
    }

  _accionButtons = () => {
    switch(didMountParams.action){
      case "Nuevo": this._saveDatos();
        break;
      case "borrar": this._deleteDatos();
        break;
      case "Editar": this._editarDatos();
        break;
    }
  }

  _editarDatos = async () => {
    this.setState({waittingWhileSaving: true});
    if(this.state.image != null) {
      await this.upLoadImage(this.state.URImanipulatedFile);  
    }else{
      await this.setState({'fileName':didMountParams.data.foto}) ;
      console.log(this.state.fileName+" <<<<<<<<<"+didMountParams.data.foto)
      this._sendDataToServer();
    }
    console.log(this.state.image+' '+didMountParams.data.foto+" "+this.state.fileName);
  }


  _onGoBack = () => {
    this.props.navigation.goBack();
    this.props.navigation.state.params.onGoBack();
  }

  _deleteDatos = async () => {
    let formdata = new FormData();
    formdata.append('id',didMountParams.data.cboa_id);
    formdata.append('name',this.state.name);
    formdata.append('detalle',this.state.detalle);
    formdata.append('filename',this.state.fileName);
    formdata.append('action',didMountParams.action);
    this.setState({waittingWhileSaving: true});
    await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/saveboard', {   
        method: "POST",
        body: formdata,
      })
      .then( (response) => response.json() )
      .then( (responseJson) => {
          if (responseJson.length == 0){
            alert("¡¡Oops!!. Problemas para tratar la información.");
            this.setState({waittingWhileSaving: false});
          }else{
            alert(responseJson[0].message);
            //console.log(responseJson);
            //categorias = responseJson;
            //this.setState({ categoriasLoaded: true });  
            this.setState({waittingWhileSaving: false});
            if (responseJson[0].success == 'ok'){
              this._onGoBack();
            }
          }
    });         
  }

  _saveDatos = async () => {
    if ((this.state.name == null)&&(this.state.detalle == null)) {
      alert('Todos lo campo deben ser dilgenciados.','');
    }else{
      if (this.state.image != null) {
        this.setState({waittingWhileSaving: true});
        await this.upLoadImage(this.state.URImanipulatedFile);
        console.log(this.state)
      }else{
        alert('Es necesario escoger una imagen para cargar!!');
      }
      console.log(this.state.image);
    }

  }

  _sendDataToServer = async () => {
    if (this.state.fileName != null) {
      //console.log('ESTE EL PARENT que ESTOY RECIBIENDO '+didMountParams.parentId);
      // Buscar en servidor de BBDD 
      console.log("didMountParams", didMountParams)
      let formdata = new FormData();
      formdata.append('id',didMountParams.action == "Editar" ? didMountParams.data.cboa_id : null);
      formdata.append('name',encodeURI(this.state.name));
      formdata.append('detalle',encodeURIComponent(this.state.detalle));
      formdata.append('filename',this.state.fileName);
      formdata.append('filenameBrand',this.state.fileNameBrand);
      formdata.append('parentId',didMountParams.parentId);
      formdata.append('action',didMountParams.action);
      //formdata.append('GO',didMountParams.go);
      formdata.append('GO',this.state.tipoGo);
      formdata.append('grupo',(this.state.grupo));
      formdata.append('DATA_SORTED',JSON.stringify(DATA_SORTED));
      formdata.append('precio',this.state.precio);
      formdata.append('ocultarnombre',this.state.ocultarnombre);
      formdata.append('promocion',this.state.promocion);
      formdata.append('ubicacion',JSON.stringify(this.state.ubicacion));
      console.log("formdata >> ",formdata);
      await fetch(GLOBAL.BASE_URL+'/index.php/maincontrol/saveboard', {   
          method: "POST",
          body: formdata,
        })
        .then( (response) => response.json())
        .then( (responseJson) => { 
            if (responseJson.length == 0){
              alert("¡¡Oops!!. Problemas para guardar la información.");
            }else{
              this.setState({waittingWhileSaving: false});
              alert(responseJson[0].message);
              console.log("SALIDA SQL: >>>>>> : ",decodeURIComponent(responseJson[0].sql));
              if (responseJson[0].success == 'ok'){
                this._onGoBack();
              }                  
            }
      }).catch((e) => { 
          this.setState({waittingWhileSaving: false});
          alert(e)
      });                
    }


  }

  goMaps() {
    //this.props.navigation.navigate('Mapa', {handleChange: (data) => console.log("XXXXXXXXXX"), commingFrom: 'HandleBoard'})
    this.setState({showMapa: true})
  }

  async handleChange(data) {
    await AsyncStorage.setItem('direccion',this.state.direccion)
    this.setState(data);
    console.log("data", data)
  }

  actionOverTheMap = async (action, ubicacion) => {
    console.log(ubicacion)
      switch(action) {
          case "useAddress": 
                //await this.props.action()
                this.setState({showMapa : false, direccion: ubicacion.direccion, ubicacion  })
      }
  }

  setDireccion = async (direccion)  => {
    this.setState( (previousState) => (
      {...previousState,  
        direccion,
       'ubicacion': {...previousState.ubicacion, direccion : direccion}
     }
   ))    
  }

  dragEnd = async (data) => {
    console.log(JSON.stringify(data.data))
    DATA_SORTED = data.data
    
  }

  setName = async (name) => {
    const params = this.props.navigation.getParam('params');
    const grupo = params.commingFrom == "comerciosScreen" ?  name : null
    console.log(params.commingFrom , grupo, name)
    this.setState({name, grupo})
  }

  render() {
    let { image, showMapa, needsAddress, listaOrdenGrupos } = this.state;
    const params = this.props.navigation.getParam('params');
    let ColorBoton1 = params.action == 'Nuevo' ? '#f39c12' : (params.action == 'Editar' ? '#27ae60': '#e74c3c');
    const grupoPickerOPtions = params.jsonGrupo;
    const tipoOpcionPicker = params.commingFrom=='comerciosScreen' ?  ['Contenido','Pedido'] : ['Comercios','Contenido']
    //console.log("$$$$$",this.state)
    if (!showMapa) {
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{flex:1, padding:0, paddingBottom: 50, }}
          >
          {this.state.waittingWhileSaving ? (
            <View style={{flex:1, alignItems:'center', justifyContent: 'center', position: 'absolute', top: 0, left:0, width:'100%',  height: '100%',  zIndex: 1000}} >
              <ActivityIndicator  size={80} color={ColorBoton1}/>
            </View>        
            ) : null
          }
          <ScrollView contentContainerStyle={{  marginBottom: 55}}> 
            <TouchableOpacity style={localStyles.imageView} activeOpacity={0.5}  onPress={this._pickImage}
            >
                { 
                  params.action!='Nuevo' ? (
                  <CacheImage
                    style={localStyles.image}
                    uri= {GLOBAL.BASE_URL+'/images/'+params.data.foto}
                  />
                  ) : null
                }           
                {image &&
                  <Image source={{ uri: image }} style={{ position: 'absolute', top:0, left:0, width: '100%', height: '100%' }} />}
                <Ionicons elevation={5} styles={localStyles.iconCamera} name='ios-camera' size={80} color='#fff' />
            </TouchableOpacity>
            <Text style={localStyles.label} >Nombre</Text>
            <TextInput 
              style={[localStyles.inputText,{fontWeight: '600', fontSize: 19}]}
              placeholder='¿Qué nombre tiene el producto o servicio?'
              onChangeText={(name) => this.setName(name)}
              value={this.state.name}
              maxLength={128}
            />
            <Text style={localStyles.label} >Descripción</Text>
            <TextInput 
              style={localStyles.inputText}
              placeholder='Describe el producto o el servicio'
              multiline={true}
              numberOfLines={2}
              onChangeText={(detalle) => this.setState({detalle})}
              value={this.state.detalle}
              maxLength={256}
            />
            {needsAddress && (<View>
                <Text style={localStyles.label} >Dirección</Text>
                <View style={{flexDirection: 'row'}}>
                      <TextInput 
                        style={[localStyles.inputText,{width: screenWidth-50}]}
                        placeholder='Dirección'
                        onChangeText={(direccion) => this.setDireccion(direccion)}
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
              </View>)} 
            { params.go == 'Pedido' ? (
              <View>
                <Text style={localStyles.label} >Grupo</Text>
                  <View style={{flexDirection: 'row'}}>
                  <TextInput 
                    style={[localStyles.inputText,{width: screenWidth-50}]}
                    placeholder='¿Cómo prefieres agrupar este producto?'
                    onChangeText={(grupo) => this.setState({grupo})}
                    value={this.state.grupo}
                    maxLength={50}
                  />
                  <Picker
                    style={{width: 50}}
                    onValueChange={(value) => this.setState({grupo: value})}
                    selectedValue={''}
                  >
                    {grupoPickerOPtions.map((value, index) => <Picker.Item  key={index} label={value} value={value} />)}
                  </Picker>
                </View>
            </View>
            ) : null }
            { params.go == 'Pedido' ? (
            <View>
            <Text style={localStyles.label} >Precio</Text>
            <TextInput 
              style={localStyles.inputText}
              placeholder='¿Qué valor deseas darle a este producto?'
              onChangeText={(precio) => this.setState({precio})}
              value={this.state.precio}
              maxLength={50}
              keyboardType='number-pad'
            /></View>
            ) : null }
            { params.go != 'Pedido' ? (
              <View style={{}}>
                <Text style={localStyles.label} >Tipo de Opción</Text>
                <Text style={[localStyles.label,{fontSize:10}]}>
                  El tipo de opción significa que cuando el usuario haga click en esta, será dirigido hacia que tipo de pantalla.{"\n"}
                  Comercios: Quiere decir que esta opción es una categoría y al pulsar en ella será llevado a los diferentes establecimientos comerciales que contendría.{"\n"}
                  Contenido: Que va directamente a revisar el contenido de una opción. Por lo general de un establecimiento comercial.{"\n"}
                  Pedido: Quiere decir que se abre directamente la ventana donde se especfica el pedido.
                </Text>
                  <Picker
                    style={{padding: 20,margin: 10,backgroundColor:'#00000055', borderRadius: 10}}
                    onValueChange={(value) => this.setState({tipoGo: value})}
                    selectedValue={this.state.tipoGo}
                  >
                    {tipoOpcionPicker.map((value, index) => <Picker.Item  key={index} label={value} value={value} />)}
                  </Picker>
              </View> 
            ) : (
              <View>
                  <Text style={localStyles.label} >¿Desea ocultar el nombre del local comercial?</Text>
                  <Text style={[localStyles.label,{fontSize:10}]}>
                    Seleccione la siguiente casilla cuando desee que sobre la imagen del producto no debe aparecer el nombre del local comercial. Eso sirve para cuando la imagen ya trae su propia leyenda. Sobre todo en imagenes de promociones.  
                  </Text>        
                  <CheckBox
                        title={"Ocultar nombre del Comercio"}
                        checked= { this.state.ocultarnombre }
                        value={this.state.ocultarnombre}
                        onPress={() => this.setState({ocultarnombre : !this.state.ocultarnombre})}
                        containerStyle={{backgroundColor:"transparent", borderWidth: 0,  margin: 0, marginBottom: 30}}
                        textStyle={{color:'#3498db'}}
                    />  
                  <Text style={localStyles.label} >¿Desea mostrar este producto en el banner de promociones?</Text>
                  <Text style={[localStyles.label,{fontSize:10}]}>
                    Seleccione la siguiente casilla en caso de que este producto quiera ser mostrado dentro de la lista de promociones
                  </Text>        
                  <CheckBox
                        title={"Promoción"}
                        checked= { this.state.promocion }
                        value={this.state.promocion}
                        onPress={() => this.setState({promocion : !this.state.promocion})}
                        containerStyle={{backgroundColor:"transparent", borderWidth: 0,  margin: 0, marginBottom: 30}}
                        textStyle={{color:'#3498db'}}
                    />  
              </View>    
            ) }
            { listaOrdenGrupos !== null && <View>
                    <Text style={localStyles.label} >Establecer Orden de los grupos</Text>
                  <Text style={[localStyles.label,{fontSize:10}]}>
                    En la siguiente seccion puedes organizar el orden en que deseas que aparezcan los grupos dentro del contenido de cada comercio. Deja presionado unos segundos el item que deseas mover y arrastralo a l lugar deseado. Luego guarda la información editada.
                  </Text> 

                     <DraggList 
                       data = {listaOrdenGrupos}
                       onDragEnd={(data) => this.dragEnd(data)}
                     />
                     </View>
                  }
                     

          </ScrollView>
          <CustomButton 
                        title={params.action}
                        style={[styles.buttonViewLogin, {position:'absolute',bottom:0, marginBottom: 0, backgroundColor: ColorBoton1}]}
                        onPress={this._accionButtons}
                    />
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
  container : { flex: 1, alignItems: 'center' , paddingTop: Constants.statusBarHeight,},
  imageView : {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 270,
    backgroundColor: '#aaa',
  },
  iconCamera : {
    
  },
  image: { position: 'absolute', top:0, left:0, width: '100%', height: '100%' },
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
    fontSize: 14,
    color: "#3f3f3f",
    paddingLeft: 20,
    paddingTop: 4,
  }
})