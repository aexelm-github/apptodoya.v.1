import * as React from 'react';
import { Button, Image, View, StyleSheet,TouchableOpacity } from 'react-native';
import { Permissions, Constants} from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default class ImagePickerExample extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;

    return (
      <View style={localStyles.container}>
        <TouchableOpacity style={localStyles.imageView} activeOpacity={0.5}  onPress={this._pickImage}
        >
            {image &&
              <Image source={{ uri: image }} style={{ position: 'absolute', top:0, left:0, width: '100%', height: '100%' }} />}
            <Ionicons elevation={5} styles={localStyles.iconCamera} name='ios-camera' size={40} color='#fff' />
        </TouchableOpacity>
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
      console.log(manipResult);
      await this.upLoadImage(manipResult.uri);
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
            console.log('imagen cargada!!')
          }else{
            console.log(response);
            alert( response.message);
          }
        }).catch((error) => {
            console.error('paso algo' + error);
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
    
  }
})