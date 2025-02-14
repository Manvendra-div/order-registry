import { ITEMTYPE } from "./item.type";

export interface MenuType {
  categories: { id: number; title: string; items: ITEMTYPE[] }[];
}
