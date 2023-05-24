import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyScreen from "./MyScreen";
import OtherScreen from "./OtherScreen";

const Tab = createBottomTabNavigator();

export default function TabComponent() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MyScreen" component={MyScreen} />
      <Tab.Screen name="OtherScreen" component={OtherScreen} />
    </Tab.Navigator>
  );
}
