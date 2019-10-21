import React, { Component, Flatlist } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { Divider } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import * as GestureHandler from 'react-native-gesture-handler'
const { Swipeable } = GestureHandler;

const color = new Array("#FFC312","#C4E538","#12CBC4","#FDA7DF","#ED4C67","#F79F1F","#A3CB38","#1289A7","#D980FA","#B53471","#EE5A24","#009432","#0652DD","#9980FA","#833471","#EA2027","#006266","#1B1464","#5758BB","#6F1E51")

showDetalle = (DATA) => {
    const render =
    <View>
        <Divider style={{ backgroundColor: '#747d8c', marginTop: 4, marginBottom: 4 }} />
        <FlatList
          data={DATA}
          renderItem={({ item,index }) => 
            <View style={styles.sameRow}>
                <Text >{item.name}</Text>
                <Text  style={{position:'absolute', right:10}}>$ {item.precio}.00</Text>
            </View>
          }
          keyExtractor={(item,index) => index.toString()}
        />
    </View>
    return render
}

onSwipeFromLeft = () => {
    alert('Eliminar')
}

const LeftActions = (progress, dragX) =>  {
    const scale = dragX.interpolate({
        inputRange: [0,100],
        outputRange: [0,1],
        extrapolate: 'clamp',
    })
    return (
        <View style={styles.LeftActions}>
            <Animated.Text style={[styles.actionText, {transform: [{ scale }]}]}>Eliminar</Animated.Text>
        </View>
    )
}

const MyCard = (props) => {
    const {DATA = 'Enter', style={}, textStyle={}, onPress, Icon=null , fontSize=16, } = props;
    const idxColor = props.index-(parseInt(props.index/color.length)*color.length)
    console.log(props.DATA.productName + ' productName')
    return (
        <Swipeable 
            renderLeftActions={LeftActions}
            onSwipeableLeftOpen={onSwipeFromLeft}
            //renderRightActions={RightActions}
        >
            <View style={{flex:1}}>
                <Circle color={color[idxColor]} elevation={50}/>
                <View 
                        onPress={onPress} style={[styles.tittle1, style]}
                        activeOpacity={0.7}
                >
                    <View style={styles.sameRow}>
                        <Text style={[styles.text, textStyle,{fontSize:fontSize}]}>{props.DATA.productName}</Text>
                        <TouchableOpacity 
                            style={{fontSize:fontSize, position:'absolute', right:10}}
                            onPress={onPress}
                        >
                            <Ionicons name={'md-close-circle'} size={25} />
                        </TouchableOpacity>
                    </View>
                    { DATA.detalle.length > 0 ? 
                        <View style={{width: '100%'}}>
                            {this.showDetalle(DATA.detalle)}
                        </View>
                    : null }
                    <Divider style={{ backgroundColor: color[idxColor], marginTop: 4, marginBottom: 4 }} />
                    <View style={styles.sameRow}>
                        <Text style={[styles.text, textStyle,{fontSize:fontSize}]}>Sub total: </Text>
                        <Text style={[styles.text, textStyle,{fontSize:fontSize, position:'absolute', right:10}]}>
                            $ {DATA.totalCalculado==0 ? DATA.precio : DATA.totalCalculado}.00
                        </Text>
                    </View>
                    { DATA.informacionAdicional ? 
                        <View style={{width: '100%'}}>
                            <Divider style={{ backgroundColor: color[idxColor], marginTop: 4, marginBottom: 4 }} />
                            <Text style={{color:color[idxColor]}}>Información adicional</Text>
                            <Text >{DATA.informacionAdicional}</Text>
                        </View>
                    : null }
                    { props.selected ?
                    <View style={{position:'absolute', top:0, left:0, height:'100%', width: '100%', backgroundColor: '#00000033'}}></View>
                        :null
                    }
                </View>
            </View>
        </Swipeable>
    );  
};

var Circle = (props) => {
    console.log(props.style)
    return (
        <View style={[styles.circle, {backgroundColor:props.color} ]} elevation={props.elevation}/>
    )
}



const styles = StyleSheet.create({
    tittle1: {
        flex: 1,
        shadowColor: '#2AC062',
        shadowOpacity: 0.4,
        shadowOffset: { height: 10, width: 0 },
        shadowRadius: 20,
        //alignItems: 'center',
        margin: 5, marginLeft: 18, marginRight: 18,
        borderRadius: 8,
        padding: 10,
        paddingLeft: 45,
        color: "#00000055",
        backgroundColor: '#fff',
    },
    sameRow : {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    text: {
        fontSize: 16,
        color: '#00000077',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 20/2,
        backgroundColor: 'red',
        position: 'absolute',
        top: 20, left: 30,
    },
    circlePosition: {
        position: 'absolute',
        left: 22,top: 35
    },
    LeftActions: {
        backgroundColor: '#ff5252',
        justifyContent: 'center',
        flex: 1
    },
    actionText: {
        color: '#fff',
        padding: 20,
    },
});

export default MyCard




;
