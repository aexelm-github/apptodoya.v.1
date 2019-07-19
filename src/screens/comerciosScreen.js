import React, { Component } from 'react';
import { Button, Text, View, Image, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import styles from '../styles/stylesOne';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const PRACTICE_TIME = 2* 1000;

export default class cartaScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    onPress = () => {
        alert("exel");
    }

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: props => {return <Text style={{color:'#e74c3c',fontWeight: "500", fontSize: 18}}>
                                            {navigation.getParam('data','')}
                                </Text>},
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerRight: (
            <View style={{marginRight: 12, flexDirection:'row'}}>
              <Ionicons name='md-menu' color='#2980b9' size={36} />
            </View>
          ),
        };
    };
    
    componentDidMount() {
        console.log('>>>>'+this.props.navigation.getParam('data',''));
        this.props.navigation.setParams({headerTitle: 'exe'});
    }

  render() {
    const nombreCategoria = this.props.navigation.getParam('data','');
    
    return (
      <View style={styles.container}>
        <View>
            <View  style={styles.logoContainer}>
                <Text>Screen : {nombreCategoria}</Text>               
            </View>
            <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
        </View>
      </View>
    );
  }
}