import { ITEMTYPE } from "./item.type";

export interface MenuType {
  items: {
    veg: ITEMTYPE[];
    nonVeg: ITEMTYPE[];
    snacks: ITEMTYPE[];
    accompaniments: ITEMTYPE[];
  };
}
