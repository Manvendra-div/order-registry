import {
  FirestoreOrderOutputType,
  OrderType,
} from "@/types/order.type";
import { collection, addDoc, getDocs } from "firebase/firestore";
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

