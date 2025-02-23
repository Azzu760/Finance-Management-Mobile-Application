import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  storeItemToCategory,
  deleteItemFromCategory,
  deleteBudgetPlan,
  getBudgetPlans,
} from "../configs/TransactionServices";
import Colors from "../constants/Colors";

const AddPlanCard = ({ currentBalance, userId }) => {
  const [categories, setCategories] = useState([]);
  const [selectedbudgetPlanId, setSelectedbudgetPlanId] = useState(null);
  const [itemDescription, setItemDescription] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(currentBalance);

  // Fetch Budget Plans & Calculate Available Balance
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const budgetData = await getBudgetPlans(userId);
        setCategories(budgetData || []);

        const totalExpenses = budgetData.reduce(
          (sum, plan) => sum + (plan.totalAmount || 0),
          0
        );

        // Compute Available Balance
        setAvailableBalance(currentBalance - totalExpenses);

        // if (budgetData.length > 0) {
        //   setSelectedbudgetPlanId(budgetData[0].id);
        // }
      } catch (error) {
        console.error("Error fetching budget plans:", error);
      }
    };

    fetchBudgetData();
  }, [userId, currentBalance]);

  // Function to Add Item to Category
  const addItemToCategory = async (budgetPlanId) => {
    if (!itemDescription || !itemAmount) return;
    setIsSubmitting(true);
    try {
      await storeItemToCategory(userId, budgetPlanId, {
        description: itemDescription,
        amount: parseFloat(itemAmount),
        itemId: Date.now(),
      });

      const budgetData = await getBudgetPlans(userId);
      setCategories(budgetData || []);
      const totalExpenses = budgetData.reduce(
        (sum, plan) => sum + (plan.totalAmount || 0),
        0
      );
      setAvailableBalance(currentBalance - totalExpenses);

      setItemDescription("");
      setItemAmount("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
    setIsSubmitting(false);
  };

  // Function to Remove Item from Category
  const removeItemFromCategory = async (budgetPlanId, index, itemAmount) => {
    try {
      await deleteItemFromCategory(userId, budgetPlanId, index, itemAmount);

      const budgetData = await getBudgetPlans(userId);
      setCategories(budgetData || []);
      const totalExpenses = budgetData.reduce(
        (sum, plan) => sum + (plan.totalAmount || 0),
        0
      );
      setAvailableBalance(currentBalance - totalExpenses);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Function to Remove Budget Plan
  const removeCategory = async (budgetPlanId) => {
    try {
      await deleteBudgetPlan(userId, budgetPlanId);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== budgetPlanId)
      );

      if (selectedbudgetPlanId === budgetPlanId) {
        setSelectedbudgetPlanId(null);
      }

      const budgetData = await getBudgetPlans(userId);
      const totalExpenses = budgetData.reduce(
        (sum, plan) => sum + (plan.totalAmount || 0),
        0
      );
      setAvailableBalance(currentBalance - totalExpenses);
    } catch (error) {
      console.error(`Error removing category with ID ${budgetPlanId}:`, error);
    }
  };

  return (
    <FlatList
      data={categories.length > 0 ? categories : [null]}
      ListHeaderComponent={
        <View style={styles.balanceCard}>
          <Text style={styles.balanceText}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
            }).format(availableBalance)}
          </Text>
        </View>
      }
      keyExtractor={(item, index) =>
        item ? item.id.toString() : index.toString()
      }
      renderItem={({ item }) => {
        // If categories is empty, display "Create Your Plan"
        if (!item) {
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Create Your Plan</Text>
            </View>
          );
        }

        return (
          <TouchableOpacity
            onPress={() =>
              setSelectedbudgetPlanId(
                selectedbudgetPlanId === item.id ? null : item.id
              )
            }
            style={[
              styles.cardWrapper,
              selectedbudgetPlanId === item.id && styles.selectedCard,
            ]}
          >
            <View style={styles.cardItem}>
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardAmount}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "INR",
                  }).format(item.totalAmount)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeCategory(item.id)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-bin" size={20} color="red" />
              </TouchableOpacity>
            </View>

            {selectedbudgetPlanId === item.id && (
              <View style={styles.itemsContainer}>
                <FlatList
                  data={item.items}
                  renderItem={({ item, index }) => (
                    <View style={styles.itemCard}>
                      <View>
                        <Text style={styles.itemText}>{item.description}</Text>
                        <Text style={styles.itemAmount}>
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "INR",
                          }).format(item.amount)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          removeItemFromCategory(
                            selectedbudgetPlanId,
                            index,
                            item.amount
                          )
                        }
                      >
                        <Ionicons name="trash-bin" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity
                  style={styles.addItemButton}
                  onPress={() => setShowInput(!showInput)}
                >
                  <Text style={styles.addItemText}>Add Item</Text>
                </TouchableOpacity>
                {showInput && (
                  <View style={styles.itemInputSection}>
                    <TextInput
                      style={[styles.input, styles.descriptionInput]}
                      placeholder="Item Description"
                      value={itemDescription}
                      onChangeText={setItemDescription}
                    />
                    <TextInput
                      style={[styles.input, styles.amountInput]}
                      placeholder="Amount"
                      value={itemAmount}
                      keyboardType="numeric"
                      onChangeText={setItemAmount}
                    />
                    <TouchableOpacity
                      style={styles.addItemButtonSubmit}
                      onPress={() => addItemToCategory(item.id)}
                      disabled={isSubmitting}
                    >
                      <Ionicons
                        name="add-circle"
                        size={40}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 200,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    fontFamily: "outfit-bold",
    color: "gray",
  },

  itemsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  itemText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
    color: "#333",
  },

  itemAmount: {
    fontSize: 12,
    fontFamily: "outfit-regular",
    color: "#666",
    marginTop: 5,
  },

  addItemButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: "center",
  },

  addItemText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },

  itemInputSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  input: {
    height: 40,
    width: 120,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 14,
    fontFamily: "outfit-regular",
    color: "#333",
  },

  addItemButtonSubmit: {
    marginBottom: 15,
  },

  balanceCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  balanceText: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.dark,
  },

  balanceAmount: {
    fontSize: 20,
    fontFamily: "outfit-medium",
    color: Colors.primary,
  },

  cardWrapper: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },

  selectedCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },

  cardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardContent: {
    flexDirection: "column",
  },

  cardName: {
    fontSize: 14,
    fontFamily: "outfit-bold",
  },

  cardAmount: {
    fontSize: 12,
    color: "#333",
    fontFamily: "outfit-regular",
  },

  removeButton: {
    padding: 5,
  },

  itemList: {
    fontFamily: "outfit-regular",
  },
});

export default AddPlanCard;
