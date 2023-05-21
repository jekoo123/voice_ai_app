import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Toolbar from "../components/toolbar";
import { useSelector } from "react-redux";
export default function ChatScreen() {
  const data = useSelector((state) => state.mydata);

  const renderItem = ({ item }) => (
    <View style={styles.scroll}>
      <View style={styles.MyTextBoxContainer}>
        <View style={styles.MyTextBox}>
          <Text style={styles.textTitle}>Me</Text>
          <Text style={styles.text}>{item[0]}</Text>
        </View>
      </View>
      <View>
        <View style={styles.AiTextBox}>
          <Text style={styles.textTitle}>AI</Text>
          <Text style={styles.text}>{item[1]}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View style={styles.toolbarContainer}>
        <Toolbar/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 0.9,
  },
  toolbarContainer: {
    flex: 0.1,
  },
  MyTextBoxContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  MyTextBox: {
    backgroundColor: "#CFE6FB",
    width: 200,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop:10,
    paddingBottom:20,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  AiTextBox: {
    backgroundColor: "#DAC2FC",
    width: 200,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop:10,
    paddingBottom:20,

    marginVertical: 10,
    marginHorizontal: 20,
  },
  textTitle: {
    marginBottom: 10,
    width:50,
    textAlign:"center",
    borderRadius:50,
    backgroundColor:"white"

  },
  text: {
    fontWeight: "500",
    textDecorationLine: "none",
    fontSize: 16,
    textAlign: "left",
    textAlignVertical: "top",
    letterSpacing: 0.1,
  },
});


// export default function ChatScreen({ route }) {
//   const { chatdata } = route.params;
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={chatdata}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.chatItem}>
//             <Text style={styles.inputText}>{item.input}</Text>
//             <Text style={styles.responseText}>{item.response}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   chatItem: {
//     marginBottom: 10,
//   },
//   inputText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   responseText: {
//     fontSize: 16,
//     marginLeft: 20,
//   },
// });
