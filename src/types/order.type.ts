import { FINALITEMTYPE } from "@/types/item.type";

export interface OrderType {
  timeStamp: Date;
  orderId: string;
  isCash: boolean;
  contact?: string;
  name: string;
  items: FINALITEMTYPE[];
  allTotal: number;
  isZomato: boolean;
  isSwiggy: boolean;
}

export interface FirestoreOrderOutputType {
  timeStamp: {
    nanoseconds: number;
    seconds: number;
  };
  orderId: string;
  isCash: boolean;
  contact?: string;
  name: string;
  items: FINALITEMTYPE[];
  allTotal: number;
  isZomato: boolean;
  isSwiggy: boolean;
}



