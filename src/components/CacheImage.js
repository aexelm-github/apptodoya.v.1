import React from 'react';
import { Image, ImageEditor } from 'react-native';
import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system'

export default class CacheImage extends React.Component {
  state = {
    source: null,
  };

  cropThis (img) {
    ImageEditor.cropImage(img.uri, {
      offset: { x:140 , y:0 },
      size: { width: 200, height: 270},
      resizeMode : 'content'
    },
    uri => this.setState({ source : {uri: uri}}),
    err => alert(err))
    console.log(img);
  }

  componentDidMount = async () => {
    const { uri,crop } = this.props;
    const name = shorthash.unique(uri);
    console.log(name+" "+crop);
    const path = `${FileSystem.cacheDirectory}${name}`;
    const image = await FileSystem.getInfoAsync(path);
    if (image.exists) {
      crop ? this.cropThis(image) : (
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
