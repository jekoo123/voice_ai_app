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
import { setItem,addItem, setCredits } from "../storage/actions";
const NUM_COLUMNS = 2;

export default function ShopScreen() {
  const windowWidth = Dimensions.get("window").width;
  const itemWidth = windowWidth / NUM_COLUMNS;

  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState(initialData);
  const [userCredits, setUserCredits] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const reduxData = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    
    setUserCredits(reduxData.CREDIT);
    const updateDataAndCredits = async () => {
        const updatedData = data.map((item) => {
            if (reduxData.ITEM.includes(item.id)) {
                return { ...item, purchased: true };
            }
            return item;
        });
        setData(updatedData);
        const updatedCredits = reduxData.CREDIT + reduxData.point;
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
    };

    updateDataAndCredits();
}, []);


  // useEffect(() => {
  //   const fetchUserCredits = async () => {
  //     try {
  //       const response = await axios.post(`${SERVER_IP}/credits`, {
  //         id: user_id,
  //       });
  //       setUserCredits(response.data.credits);
  //     } catch (error) {
  //       console.log("Error fetching user credits:", error);
  //     }
  //   };
  //   const fetchUserPurchases = async () => {
  //     try {
  //       const response = await axios.post(`${SERVER_IP}/user-purchases`, {
  //         id: user_id,
  //       });

  //       const purchasedItems = response.data.purchases;

  //       const updatedData = data.map((item) => {
  //         if (purchasedItems.includes(item.title)) {
  //           return { ...item, purchased: true };
  //         }
  //         return item;
  //       });

  //       setData(updatedData);
  //     } catch (error) {
  //       console.log("Error fetching user purchases:", error);
  //     }
  //   };

  //   fetchUserPurchases();
  //   fetchUserCredits();
  // }, []);

  const renderItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress}>
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
    setModalVisible(true);
  };
  const handlePurchase = async () => {
    if (userCredits >= selectedItem.cost) {
      const updatedCredits = userCredits - selectedItem.cost;
      setUserCredits(updatedCredits);
      dispatch(setCredits(updatedCredits));
      const updatedData = data.map((item) => {
        if (item.id === selectedItem.id) {
          return { ...item, purchased: true };
        }
        return item;
      });
      setData(updatedData);
      setModalVisible(false);
      if(!reduxData.ITEM.includes(selectedItem.id)){
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
        <Text style={styles.creditsText}>
          <Image
            source={require("../assets/credit.png")}
            style={styles.creditImage}
          />
          <Text style={styles.creditsValue}>{userCredits}</Text>
        </Text>
      </View>
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
                        onPress={() => setModalVisible(false)}
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
  },
  creditsText: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 22,
  },
  creditImage: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  creditsValue: {
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
    margin: 25,
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
  },
  itemImage: {},
  purchasedItemContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
