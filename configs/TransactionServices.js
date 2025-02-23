import { db } from "./FirebaseConfig";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";

// Store a transaction in Firestore
export const storeTransaction = async (transaction, user) => {
  if (!user) {
    console.error("User is not logged in");
    return;
  }

  try {
    const transactionData = {
      ...transaction,
      userId: user.id,
      createdAt: new Date(),
    };

    const userTransactionsRef = collection(
      db,
      "users",
      user.id,
      "transactions"
    );
    await addDoc(userTransactionsRef, transactionData);

    console.log("Transaction successfully stored in Firestore");
  } catch (error) {
    console.error("Error storing transaction to Firestore:", error);
    throw error;
  }
};

// Fetch transactions for a user
export const getTransactions = async (userId) => {
  try {
    const transactionsRef = collection(db, "users", userId, "transactions");
    const querySnapshot = await getDocs(transactionsRef);

    const transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return transactions;
  } catch (error) {
    console.error("Error fetching transactions from Firestore:", error);
    throw error;
  }
};

// Delete a specific transaction
export const deleteTransaction = async (userId, transactionId) => {
  try {
    const transactionRef = doc(
      db,
      "users",
      userId,
      "transactions",
      transactionId
    );
    await deleteDoc(transactionRef);
    console.log("Transaction deleted successfully from Firestore");
  } catch (error) {
    console.error("Error deleting transaction from Firestore:", error);
    throw error;
  }
};

// Store a new budget plan in Firestore
export const storeBudgetPlan = async (userId, newCategory) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "budgetPlans"),
      {
        ...newCategory,
        createdAt: new Date(),
      }
    );
    console.log("Budget plan stored with ID:", docRef.id);
  } catch (error) {
    console.error("Error storing budget plan to Firestore:", error);
    throw error;
  }
};

// Store an item to a specific category
export const storeItemToCategory = async (userId, budgetPlanId, item) => {
  try {
    const categoryRef = doc(db, "users", userId, "budgetPlans", budgetPlanId);
    const categorySnapshot = await getDoc(categoryRef);

    if (categorySnapshot.exists()) {
      const categoryData = categorySnapshot.data();
      const currentTotalAmount = categoryData.totalAmount || 0;

      console.log("Item being added:", item);

      await updateDoc(categoryRef, {
        items: arrayUnion(item),
        totalAmount: currentTotalAmount + item.amount,
      });

      console.log("Item successfully added to category!");
    } else {
      console.error("Category not found");
    }
  } catch (error) {
    console.error("Error storing item to category in Firestore:", error);
    throw error;
  }
};

// Fetch budget plans for a user
export const getBudgetPlans = async (userId) => {
  try {
    const transactionsRef = collection(db, "users", userId, "budgetPlans");
    const querySnapshot = await getDocs(transactionsRef);

    const budgetPlans = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      budgetPlanId: doc.id,
      ...doc.data(),
    }));

    return budgetPlans;
  } catch (error) {
    console.error("Error fetching budget plans from Firestore:", error);
    throw error;
  }
};

// Delete a specific budget plan
export const deleteBudgetPlan = async (userId, budgetPlanId) => {
  try {
    const budgetPlanRef = doc(db, "users", userId, "budgetPlans", budgetPlanId);
    await deleteDoc(budgetPlanRef);
    console.log(
      `Budget Plan with ID ${budgetPlanId} deleted successfully from Firestore`
    );
  } catch (error) {
    console.error(
      `Error deleting Budget Plan with ID ${budgetPlanId} from Firestore:`,
      error
    );
    throw error;
  }
};

// Function to delete an item from a specified category and update the available balance
export const deleteItemFromCategory = async (
  userId,
  budgetPlanId,
  index,
  itemAmount
) => {
  try {
    const categoryRef = doc(db, "users", userId, "budgetPlans", budgetPlanId);
    const categorySnapshot = await getDoc(categoryRef);

    if (!categorySnapshot.exists()) {
      console.error("Category not found");
      return;
    }

    const categoryData = categorySnapshot.data();

    if (!categoryData.items || !Array.isArray(categoryData.items)) {
      console.error("No items found in category");
      return;
    }

    const itemToRemove = categoryData.items[index];
    if (!itemToRemove) {
      console.error("Item not found in category at index:", index);
      return;
    }

    const updatedTotalAmount = Math.max(
      (categoryData.totalAmount || 0) - itemAmount,
      0
    );

    const updatedItems = categoryData.items.filter((_, idx) => idx !== index);

    await updateDoc(categoryRef, {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    });

    console.log("Item successfully removed from category!");
  } catch (error) {
    console.error("Error deleting item from category in Firestore:", error);
    throw error;
  }
};
