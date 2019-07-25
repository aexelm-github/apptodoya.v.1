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
      } from 'react-native';
import { Permissions, Constants} from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CacheImage from '../components/CacheImage';
import CustomButton from '../components/customButton';
import styles from '../styles/stylesOne';

let params = null;

export default class ImagePickerX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      name: null,
      detalle: null,
      fileName: null,
      URImanipulatedFile: null,
      id: null,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('params').action,
      headerRight: (
        <View style={{marginRight: 8, flexDirection:'row'}}>
          <TouchableHighlight activeOpacity={0.7} underlayColor='#ccc'
            onPress={() => {}}
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
    params = this.props.navigation.getParam('params');
    if (params.action != 'Nuevo') {
      //this.setState({'name':params.data.name, 'detalle':params.data.detalle,  'action':params.action});
      this.setState((previousState) => (
         {...previousState,  'name':params.data.name, 'detalle':params.data.detalle }
      ))      
    }
    
      console.log("ZXXXXZZ>>>>>>>>>>"+params.action );
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
      //console.log(manipResult);
      //await this.upLoadImage(manipResult.uri);
    }
  };

  upLoadImage = async (image_uri) => {
    let base_url = 'http://todoya2.aexelm.com/index.php/Upload_img';
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
            //console.log(response.fileName + ' imagen cargada!!');
            this.setState({'fileName' : response.fileName})
          }else{
            //console.log(response);
            alert( response.message);
          }
        }).catch((error) => {
            console.error('Ojo!! Ocurrió un error al subir la imagen. ' + error);
        });
    }

  _saveDatos = async () => {
    if ((this.state.name == null)&&(this.state.detalle == null)) {
      alert('Todos lo campo deben ser dilgenciados.','');
    }else{
      if (this.state.image != null) {
        await this.upLoadImage(this.state.URImanipulatedFile);
        console.log(this.state)
        if (this.state.fileName != null) {
          // Buscar en servidor de BBDD 
          let formdata = new FormData();
          formdata.append('id',params.id);
          formdata.append('name',this.state.name);
          formdata.append('detalle',this.state.detalle);
          formdata.append('filename',this.state.fileName);
          formdata.append('action',params.action);

          await fetch('http://todoya2.aexelm.com/index.php/maincontrol/saveboard', {   
              method: "POST",
              body: formdata,
            })
            .then( (response) => response.json() )
            .then( (responseJson) => {
                if (responseJson.length == 0){
                  alert("¡¡Oops!!. Problemas para guardar la información.");
                }else{
                  alert(responseJson.message);
                  console.log(responseJson);
                  //categorias = responseJson;
                  //this.setState({ categoriasLoaded: true });  
                }
          });                
        }
      }else{
        alert('Es necesario escoger una imagen para cargar!!');
      }
      console.log(this.state.image);
    }

  }

  render() {
    let { image } = this.state;
    const params = this.props.navigation.getParam('params');
    return (
      <KeyboardAvoidingView
        style={{flex: 1, height: '100%'}}
        behavior='padding'
      >
      <View style={localStyles.container}>
      <ScrollView style={{flex:1, width:'100%', marginBottom: 70}}> 
        <TouchableOpacity style={localStyles.imageView} activeOpacity={0.5}  onPress={this._pickImage}
        >
            {
              params.action!='Nuevo' ? (
              <CacheImage
                style={localStyles.image}
                uri= {'http://todoya2.aexelm.com/images/'+params.data.foto}
              />
              ) : null
            }           
            {image &&
              <Image source={{ uri: image }} style={{ position: 'absolute', top:0, left:0, width: '100%', height: '100%' }} />}
            <Ionicons elevation={5} styles={localStyles.iconCamera} name='ios-camera' size={80} color='#fff' />
        </TouchableOpacity>
        <TextInput 
          style={[localStyles.inputText,{fontWeight: '600'}]}
          placeholder='Nombre'
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          maxLength={20}
        />
        <TextInput 
          style={localStyles.inputText}
          placeholder='Detalle'
          multiline={true}
          numberOfLines={2}
          onChangeText={(detalle) => this.setState({detalle})}
          value={this.state.detalle}
          maxLength={50}
        />
      </ScrollView>
      <CustomButton 
                    title={"Grabar"}
                    style={[styles.buttonViewLogin, {position:'absolute',bottom:0, marginBottom: 0}]}
                    onPress={this._saveDatos}
                />
      </View>
      </KeyboardAvoidingView>
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
    backgroundColor:'#eee',
    marginTop: 4,

  }
})