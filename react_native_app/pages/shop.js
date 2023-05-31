import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  Button,
  TouchableOpacity,
} from "react-native";
import { ListItem } from "react-native-elements";
import Toolbar from "../components/toolbar";
import initialData from "../assets/items";

const NUM_COLUMNS = 2;
const itemWidth = Dimensions.get("window").width / NUM_COLUMNS;

const renderItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <ListItem
      containerStyle={styles.itemContainer}
      title={item.title}
      titleStyle={styles.itemTitle}
    >
      {item.purchased && <Text style={styles.purchasedText}>구매함</Text>}
    </ListItem>
  </TouchableOpacity>
);

export default function ShopScreen() {
  const windowWidth = Dimensions.get("window").width;
  const itemWidth = windowWidth / NUM_COLUMNS;

  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handlePurchase = () => {
    // 선택한 아이템을 구매 상태로 변경합니다.
    const updatedData = data.map((item) => {
      if (item.title === selectedItem.title) {
        return { ...item, purchased: true };
      }
      return item;
    });
    // 데이터를 업데이트하고 모달을 닫습니다.
    setData(updatedData);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentsContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) =>
            renderItem({ item, onPress: () => handleItemPress(item) })
          }
          keyExtractor={(item, index) => index.toString()}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
        />
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {selectedItem && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text>{selectedItem.description}</Text>

                {!selectedItem.purchased && (
                  <View style={styles.questionBox}>
                    <Text style={styles.questionText}>구매하시겠습니까?</Text>
                    <View style={styles.buttonContainer}>
                      <Button title="구매" onPress={handlePurchase} />
                      <Button
                        title="취소"
                        onPress={() => setModalVisible(false)}
                      />
                    </View>
                  </View>
                )}

                {selectedItem.purchased && (
                  <Text style={styles.purchasedLabel}>구매 완료</Text>
                )}
              </View>
            )}
          </View>
        </Modal>
      </View>
      <View style={styles.toolbarContainer}>
        <Toolbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentsContainer:{
    flex:0.9,
  },
  toolbarContainer:{
    flex:0.1,
  },
  itemContainer: {
    width: Dimensions.get("window").width / (NUM_COLUMNS + 1),
    height: 150,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  purchasedText: {
    color: "green",
  },
  columnWrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentContainer: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionBox: {
    alignItems: "center",
  },

  questionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 170,
    marginTop: 10,
  },
  purchasedLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});
