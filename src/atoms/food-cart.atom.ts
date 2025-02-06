import { FINALITEMTYPE } from "@/types/item.type";
import { atom } from "jotai";

export const foodCartAtom = atom<FINALITEMTYPE[] | null>(null);
