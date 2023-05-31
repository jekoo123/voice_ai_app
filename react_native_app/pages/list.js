import { View, Text } from "react-native";
import { useSelector } from "react-redux";

export default function ListScreen() {
  const data = useSelector((state) => {
    return state.save;
  });
  return (
    <View>
      {data.map((e) => {
        return <Text>{e}</Text>;
      })}
    </View>
  );
}
