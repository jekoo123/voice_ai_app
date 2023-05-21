import { View, Text, StyleSheet,Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

export default function LogoTitle(props) {
  const navigation = useNavigation();

  return (
    <View style={stlyes.container}>
      <Text style={stlyes.pagename}>{props.title}</Text>
      <TouchableOpacity
        style={stlyes.button}
        onPress={() => navigation.navigate("설정")}
      >
        <Image
          source={require("../assets/Settings_img.png")}
        />
      </TouchableOpacity>
    </View>
  );
}


const stlyes= StyleSheet.create({
  container :{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    width:"105%",
  },
  button:{
    width:50,
  },
  pagename:{
    fontSize:22,
  }
})