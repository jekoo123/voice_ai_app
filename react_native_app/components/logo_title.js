import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

export default function LogoTitle(props) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.pagename}>{props.title}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("설정")}
      >
        <Icon
          style={styles.icon}
          name="settings-outline"
          size={35}
          color={"black"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "105%",
  },
  button: {
    width:50,
  },
  pagename: {
    fontSize: 22,
  },
  icon: {
    marginLeft:6,
  },
});
