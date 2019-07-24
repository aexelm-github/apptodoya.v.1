import * as React from 'react';
import { Button, Image, View, TextInput, StyleSheet,TouchableOpacity, TouchableHighlight} from 'react-native';
import { Permissions, Constants} from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import CacheImage from '../components/CacheImage';


export default class ImagePickerX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      name: null,
      detalle: null,
      fileName: null,
      URImanipulatedFile: null,
    };
  }

  navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('params').action,
      headerRight: (
        <View style={{marginRight: 8, flexDirection:'row'}}>
          <TouchableHighlight activeOpacity={0.7} underlayColor='#ccc'
            onPress={() => {ImagePickerX._saveDatos()}}
            style={{width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center'}}
          >
              <Ionicons name='ios-checkmark' color='#3498db' size={36} />
          </TouchableHighlight>
        </View>
      ),
    };
  };

  async componentWillMount(){
    const params = this.props.navigation.getParam('params');
    if (params.action !== 'Nuevo')
      this.setState({'name':params.data.name, 'detalle':params.data.detalle});
  }

  _saveDatos =  () => {
    alert('ok'+ ImagePickerX.state);
  }

  render() {
    let { image } = this.state;
    const params = this.props.navigation.getParam('params');
    return (
      <View style={localStyles.container}>
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
          style={localStyles.inputText}
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
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
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