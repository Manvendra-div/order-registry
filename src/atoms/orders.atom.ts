import { OrderType } from "@/types/order.type";
import { atom } from "jotai";

export const ordersAtom = atom<OrderType[] | null>(null);
