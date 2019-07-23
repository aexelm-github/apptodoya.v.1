import React from 'react';
import {
        View,
        StyleSheet,
        TouchableOpacity,
       } from 'react-native';
import { Ionicons, FontAwesome ,Entypo} from '@expo/vector-icons';

export default class ActionMenu extends React.Component {
    constructor(props){
        super(props);
        state = {};
    }

    componentDidMount = () => {
    };

    render() {
        const boton = this.props.estosBotonesActivos;
        const {style={}, textStyle={}, onPress } = this.props;
        return (
            <View style={styles.actionBar}>
                {
                    boton.add ? (
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={() => {this.props.callbackFromParent('add') }}
                        >
                            <View style={[styles.actionIcon,{backgroundColor: '#f39c12'}]} elevation={15}>
                                <Ionicons name='ios-add' size={25} color="#ffffff" />
                            </View>
                        </TouchableOpacity>
                    ) : null
                }
                {
                    boton.delete ? (
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={() => {this.props.callbackFromParent('delete') }}
                        >
                        <View style={[styles.actionIcon,{backgroundColor: '#e74c3c'}]} elevation={15}>
                            <Ionicons name='ios-trash' size={25} color="#ffffff" />
                        </View>
                    </TouchableOpacity>                   
                    ) : null
                }
                {
                    boton.edit ? (
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={() => {this.props.callbackFromParent('edit') }}   
                        >
                            <View style={[styles.actionIcon,{backgroundColor: '#27ae60'}]} elevation={15}>
                                <Entypo name='edit' size={25} color="#ffffff" />
                            </View>
                        </TouchableOpacity>                   
                    ) : null
                }
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    actionBar : {
        position: 'absolute',
        bottom: 10,
        right: 0,
        flexDirection: 'row-reverse',
       // width: '100%',
        //backgroundColor: '#000000aa',
        padding: 5,
        borderRadius: 30
    },
    actionIcon: {
        borderWidth: 0,
        borderColor: 'white',
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        backgroundColor: 'orange',
        marginRight: 5,


    }  
})