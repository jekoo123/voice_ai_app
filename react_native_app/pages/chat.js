
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function ChatScreen({ route }) {
  const { chatdata } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={chatdata}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.chatItem}>
            <Text style={styles.inputText}>{item.input}</Text>
            <Text style={styles.responseText}>{item.response}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chatItem: {
    marginBottom: 10,
  },
  inputText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  responseText: {
    fontSize: 16,
    marginLeft: 20,
  },
});

// import React, { useState } from "react";
// import axios from "axios";
// import {
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   View,
//   Button,
// } from "react-native";

// export default function ChatScreen() {

//   const [input, setInput] = useState("");
//   const [array, setArray] = useState([]);
//   const submitMessage = async () => {
//     try {
//       const result = await axios.post("http://192.168.0.8:5000/chat", {
//         input: input,
//       });
//       setArray([...array, [input,result.data.response],]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <>  
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView style={styles.container}>

//         <Text style={styles.title}>ChatLog</Text>
//         <View style={styles.chatBox}>

//           {array.map((e) => {
//             return <>
//               <Text style={styles.response}>{e[0]}</Text>
//               <Text style={styles.response}>{e[1]}</Text>
//             </>;
//           })}
          
//         </View> 
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.textInput}
//             onChangeText={setInput}
//             value={input}
//             placeholder="Type your message here"
//           />
//           <TouchableOpacity style={styles.button} onPress={submitMessage}>
//             <Text style={styles.buttonText}>Send</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   chatBox: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "gray",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 20,
//   },
//   response: {
//     fontSize: 16,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   textInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "gray",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     marginRight: 10,
//   },
//   button: {
//     backgroundColor: "#1E90FF",
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });
