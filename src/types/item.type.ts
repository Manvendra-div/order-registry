export type VARIENTSTYPE = Array<{
  varientId: number;
  varientName: string;
  price: number;
}>;
export type ITEMTYPE = {
  id: number;
  name: string;
  varients: VARIENTSTYPE;
  veg: boolean;
};
export type FINALITEMTYPE = {
  id: number;
  name: string;
  varients: { varientId: number; varientName: string; price: number };
  veg: boolean;
  quantity: number;
};
