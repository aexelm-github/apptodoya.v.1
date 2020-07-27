import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
 
const exampleData = [...Array(20)].map((d, index) => ({
  key: `item-${index}`, // For example only -- don't use index as your key!
  label: index,
  backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index *
    5}, ${132})`
}));
 
class DragList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data
          };
    }
 
  

  renderItem = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          marginBottom: 5,
          backgroundColor: isActive ? "blue" : item.backgroundColor,
          alignItems: "center",
          justifyContent: "center",
        }}
          delayLongPress={200}
         onLongPress={drag}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            fontSize: 18
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  setData(data) {
    console.log(data)
    this.setState({ data })
    this.props.onDragEnd({data})
  }
 
  render() {
    return (
      <View style={{ flex: 1 , marginLeft: 40, marginEnd: 40, marginVertical: 30 }}>
        <DraggableFlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({ data }) => this.setData(data) }
        />
      </View>
    );
  }
}
 
export default DragList;