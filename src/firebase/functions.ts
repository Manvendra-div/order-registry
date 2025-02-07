import { FirestoreOrderOutputType, OrderType } from "@/types/order.type";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";

export const postOrder = async (order: OrderType) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), order);
    return {
      success: true,
      message: `Document written with ID: ${docRef.id})`,
    };
  } catch (e) {
    return {
      success: false,
      message: `Error adding document: ${e}`,
    };
  }
};

export const getOrderList = async (): Promise<{
  success: boolean;
  data: FirestoreOrderOutputType[] | null;
  message: string | null;
}> => {
  try {
    const collectionRef = collection(db, "orders");
    const querySnapshot = await getDocs(collectionRef);
    const orders = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as unknown as FirestoreOrderOutputType;
    });
    return { success: true, data: orders, message: null };
  } catch (error: any) {
    return { success: false, data: null, message: error.message };
  }
};

export const updateOrder = async (
  id: string,
  order: OrderType
): Promise<{
  success: boolean;
  data: null;
  message: string | null;
}> => {
  try {
    const orderRef = doc(db, "orders", id);
    await setDoc(orderRef, order, { merge: true });
    return { success: true, data: null, message: "Not implemented" };
  } catch (error: any) {
    return { success: false, data: null, message: error.message };
  }
};
