import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Toolbar from "../components/toolbar";
import { deleteSave } from "../storage/actions";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { SERVER_IP } from "../config";
import { useIsFocused } from "@react-navigation/native";

export default function ListScreen() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const data = useSelector((state) => {
    return state;
  });
  
  useEffect(() => {
    if (!isFocused) {
      const updateList = async () => {
        await axios.post(`${SERVER_IP}/update_list`, {
          id: data.USER[0],
          list: data.SAVE,
        });
      };
      updateList();
    }

  }, [isFocused]);


  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemClick = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleDeleteSelectedItems = () => {
    selectedItems.forEach((item) => {
      dispatch(deleteSave(item));
    });
    setSelectedItems([]);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item);

    return (
      <TouchableOpacity
        style={[
          styles.textContainer,
          isSelected && styles.selectedTextContainer,
        ]}
        onPress={() => handleItemClick(item)}
      >
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContianer}>
            <Text style={styles.title}>My Sentence</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteSelectedItems}
            >
              <Icon name="trash" size={27} color="gray" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={data.SAVE}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
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
  screenContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  toolbarContainer: {
    flex: 0.1,
  },
  modalContainer: {
    height: 300,
  },
  contentContainer: {
    width: 350,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: "#FFE4AF",
    height: 600,
    borderRadius: 15,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: "center",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    width: 290,
    paddingHorizontal: 10,
    backgroundColor: "#FDF6E7",
    marginBottom: 10,
  },
  selectedTextContainer: {
    backgroundColor: "#FFC0CB",
  },
  titleContianer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 290,
    marginTop: 5,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontStyle: "italic",
  },
  deleteButton: {
    position: "absolute",
    left: 265,
  },
});
