import React from 'react';
import { Image } from 'react-native';
import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system'
import ImageEditor from "@react-native-community/image-editor";

export default class CacheImage extends React.Component {
  state = {
    source: null,
  };

  async cropThis (img) {
    // ImageEditor.cropImage(img.uri, {
    //   offset: { x:0 , y:0 },
    //   size: { width: 280, height: 150},
    //   resizeMode : 'content'
    // },
    // uri => this.setState({ source : {uri: uri}}),
    // err => alert(err))
    console.log("IMAGE",img)
    await ImageEditor.cropImage(img.uri, {
      offset: { x:0 , y:0 },
      size: { width: 280, height: 150},
      resizeMode : 'content'
    })
    .then((url) => {
            this.setState({ source : {uri: url}})
            console.log("URI", url  )
         }
    )
  }

  componentDidMount = async () => {
    const { uri,crop } = this.props;
    const name = shorthash.unique(uri);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",name+" "+crop);
    const path = `${FileSystem.cacheDirectory}${name}`;
    const image = await FileSystem.getInfoAsync(path);
    if (image.exists) {
      false && crop ? this.cropThis(image) : (
      //console.log('read image from cache: '+name+" "+uri+ " " + path);
        this.setState({
          source: {
            uri: image.uri,
          },
        })
      )
      return;
    }

    //console.log('downloading image to cache');
    const newImage = await FileSystem.downloadAsync(uri, path);
    this.setState({
      source: {
        uri: newImage.uri,
      },
    });
  };

  render() {
    const {crop, blurRadius} = this.props;
    return <Image style={this.props.style} 
                  source={this.state.source} 
                  blurRadius={blurRadius ? blurRadius : null}
            />;
  }
}
