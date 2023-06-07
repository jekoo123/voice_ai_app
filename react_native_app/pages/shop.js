import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  Button,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { ListItem } from "react-native-elements";
import Toolbar from "../components/toolbar";
import initialData from "../assets/items";
import axios from "axios";
import { SERVER_IP } from "../config";
import { useSelector, useDispatch } from "react-redux";
import { equip, addItem, setCredit } from "../storage/actions";
const NUM_COLUMNS = 2;

export default function ShopScreen() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState(initialData);
  const [userCredits, setUserCredits] = useState(null);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [equipModalVisible, setEquipModalVisible] = useState(false);
  const reduxData = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setUserCredits(reduxData.CREDIT);
    const updatedData = data.map((item) => {
      if (reduxData.ITEM.includes(item.id)) {
        return { ...item, purchased: true };
      }
      return item;
    });
    setData(updatedData);
  }, []);

  const updateCredit = () => {
    const updateDataAndCredits = async () => {
      const updatedCredits = reduxData.CREDIT + reduxData.POINT;
      try {
        await axios.post(`${SERVER_IP}/update-credits`, {
          id: reduxData.USER[0],
          credits: updatedCredits,
        });
        console.log("User credits updated in the server's database");
      } catch (error) {
        console.log("Error updating user credits in the server:", error);
      }
      setUserCredits(updatedCredits);
      dispatch(setCredit(updatedCredits));
    };

    updateDataAndCredits();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        item.purchased ? handleEquipPress(item) : handleItemPress(item)
      }
    >
      <ImageBackground
        source={item.backgroundImage}
        style={styles.itemBackground}
        imageStyle={styles.itemImage}
      >
        <ListItem
          containerStyle={[
            styles.itemContainer,
            item.purchased ? styles.purchasedItemContainer : null,
          ]}
          title={item.title}
          titleStyle={styles.itemTitle}
        >
          {item.purchased && <Text style={styles.purchasedText}>보유중</Text>}
        </ListItem>
      </ImageBackground>
    </TouchableOpacity>
  );
  const handleItemPress = (item) => {
    setSelectedItem(item);
    setPurchaseModalVisible(true);
  };

  const handleEquipPress = (item) => {
    setSelectedItem(item);
    setEquipModalVisible(true);
  };
  const handleEquip = async () => {
    dispatch(equip(selectedItem.id));
    try {
      await axios.post(`${SERVER_IP}/equip`, {
        id: reduxData.USER[0],
        equip: selectedItem.id,
      });
    } catch (error) {
      console.log(error);
    }
    setEquipModalVisible(false);
  };

  const handlePurchase = async () => {
    if (userCredits >= selectedItem.cost) {
      const updatedCredits = userCredits - selectedItem.cost;
      setUserCredits(updatedCredits);
      dispatch(setCredit(updatedCredits));
      const updatedData = data.map((item) => {
        if (item.id === selectedItem.id) {
          return { ...item, purchased: true };
        }
        return item;
      });
      setData(updatedData);
      setPurchaseModalVisible(false);
      if (!reduxData.ITEM.includes(selectedItem.id)) {
        dispatch(addItem(selectedItem.id));
      }

      try {
        await axios.post(`${SERVER_IP}/update-credits`, {
          id: reduxData.USER[0],
          credits: updatedCredits,
        });
        console.log("User credits updated in the server's database");
      } catch (error) {
        console.log("Error updating user credits in the server:", error);
      }

      try {
        await axios.post(`${SERVER_IP}/update-purchase`, {
          id: reduxData.USER[0],
          items: selectedItem.id,
        });
        console.log("User purchase updated in the server's database");
      } catch (error) {
        console.log("Error updating user purchase in the server:", error);
      }
    } else {
      console.log("Insufficient credits");
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/credit.png")}
          style={styles.creditImage}
        />
        <Text style={styles.creditsValue}>{userCredits}</Text>
        <TouchableOpacity style={styles.getPoint} onPress={updateCredit}>
          <Text>Get Point</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentsContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) => renderItem({ item })}
          keyExtractor={(item, index) => index.toString()}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
        />
        <Modal
  visible={equipModalVisible}
  animationType="slide"
  onRequestClose={() => setEquipModalVisible(false)}
>
  <View style={styles.modalContainer}>
    {selectedItem && (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{selectedItem.title}</Text>
        {/* <Text>{selectedItem.description}</Text> */}
        
        <View style={styles.questionBox}>
          <Text style={styles.questionText}>
            장착하시겠습니까?
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title="장착"
              onPress={handleEquip}
              color={styles.equipButton.backgroundColor}
            />
            <Button
              title="취소"
              onPress={() => setEquipModalVisible(false)}
              color={styles.cancelButton.backgroundColor}
            />
          </View>
        </View>
        
        {selectedItem.purchased && (
          <Text style={styles.purchasedLabel}>구매 완료</Text>
        )}
      </View>
    )}
  </View>
</Modal>
        <Modal
          visible={purchaseModalVisible}
          animationType="slide"
          onRequestClose={() => setPurchaseModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {selectedItem && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                {/* <Text>{selectedItem.description}</Text> */}

                {!selectedItem.purchased && (
                  <View style={styles.questionBox}>
                    <Text style={styles.questionText}>
                      구매하시겠습니까? (가격: {selectedItem.cost} credits)
                    </Text>
                    <View style={styles.buttonContainer}>
                      <Button
                        title="구매"
                        onPress={handlePurchase}
                        color={styles.purchaseButton.backgroundColor}
                      />
                      <Button
                        title="취소"
                        onPress={() => setPurchaseModalVisible(false)}
                        color={styles.cancelButton.backgroundColor}
                      />
                    </View>
                  </View>
                )}
                <Text style={styles.creditsValue}>{userCredits} credits</Text>
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
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: '#f2f2f2',  // 배경색 변경
    shadowColor: "#000",  // 그림자 색상
    shadowOffset: { width: 0, height: 2 },  // 그림자 오프셋
    shadowOpacity: 0.25,  // 그림자 투명도
    shadowRadius: 3.84,  // 그림자 반경
    elevation: 5, 
  },
  creditImage: {
    width: 25,
    height: 25,
    marginRight: 13,
  },
  creditsValue: {
    fontSize: 23,
    fontWeight: "bold",
  },
  contentsContainer: {
    flex: 0.9,
  },
  toolbarContainer: {
    flex: 0.1,
  },
  itemContainer: {
    width: Dimensions.get("window").width / (NUM_COLUMNS + 1),
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "transparent",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  purchasedText: {
    fontSize: 20,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: Dimensions.get("window").width * 0.8,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 170,
    marginTop: 10,
  },
  purchaseButton: {
    backgroundColor: "#6666FF",
  },
  equipButton: {
    backgroundColor: "#FF8989",
  },
  cancelButton: {
    backgroundColor: "darkgray",
  },
  itemBackground: {
    width: Dimensions.get("window").width / (NUM_COLUMNS + 1),
    height: 150,
    margin: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  
  purchasedItemContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  getPoint:{
    position: "absolute",
    right:10,
    paddingHorizontal:10,
    paddingVertical:5,
    backgroundColor: "#FDF6E7",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },

});
