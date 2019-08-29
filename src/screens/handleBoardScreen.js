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
        Text
      } from 'react-native';
import { Permissions, Constants} from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CacheImage from '../components/CacheImage';
import CustomButton from '../components/customButton';
import styles from '../styles/stylesOne';

GLOBAL = require('../globals/globals');

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

let didMountParams = null;

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
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('params').action,
      headerRight: (
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
    
    if (didMountParams.action != 'Nuevo') {
      this.setState((previousState) => (
         {...previousState,  
          'name':didMountParams.data.name, 
          'detalle':didMountParams.data.detalle, 
          'grupo':didMountParams.data.cboa_grupo,
          'precio':didMountParams.data.cboa_precio ,
        }
      ))      
    }
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );  
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
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
      let formdata = new FormData();
      formdata.append('id',didMountParams.action == "Editar" ? didMountParams.data.cboa_id : null);
      formdata.append('name',this.state.name);
      formdata.append('detalle',this.state.detalle);
      formdata.append('filename',this.state.fileName);
      formdata.append('filenameBrand',this.state.fileNameBrand);
      formdata.append('parentId',didMountParams.parentId);
      formdata.append('action',didMountParams.action);
      formdata.append('GO',didMountParams.go);
      formdata.append('grupo',this.state.grupo);
      formdata.append('precio',this.state.precio);
      //console.log(formdata);
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
              //console.log(responseJson);
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

  render() {
    let { image } = this.state;
    const params = this.props.navigation.getParam('params');
    let ColorBoton1 = params.action == 'Nuevo' ? '#f39c12' : (params.action == 'Editar' ? '#27ae60': '#e74c3c');
    const grupoPickerOPtions = params.jsonGrupo;
    
    return (
      <View
        style={{flex: 1,}}
        behavior='padding'
      >
      {this.state.waittingWhileSaving ? (
        <View style={{flex:1, alignItems:'center', justifyContent: 'center', position: 'absolute', top: 0, left:0, width: '100%', height: '100%',  zIndex: 1000}} >
          <ActivityIndicator  size={80} color={ColorBoton1}/>
        </View>        
        ) : null
      }
      <View style={[localStyles.container,{paddingBottom: this.state.shrinkScreen}]}>
      <ScrollView style={{flex:1, width:'100%', marginBottom: 55}}> 
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
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          maxLength={20}
        />
        <Text style={localStyles.label} >Descripción</Text>
        <TextInput 
          style={localStyles.inputText}
          placeholder='Describe el producto o el servicio'
          multiline={true}
          numberOfLines={2}
          onChangeText={(detalle) => this.setState({detalle})}
          value={this.state.detalle}
          maxLength={120}
        />
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
      </ScrollView>
      <CustomButton 
                    title={params.action}
                    style={[styles.buttonViewLogin, {position:'absolute',bottom:0, marginBottom: 0, backgroundColor: ColorBoton1}]}
                    onPress={this._accionButtons}
                />
      </View>
      </View>
    );
  }

  
 
}

const localStyles = StyleSheet.create({
  container : { flex: 1, alignItems: 'center' },
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