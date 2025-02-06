import { ReactNode, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Minus, Plus, Sparkles, SquareDot, Trash2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useAtom } from "jotai";
import { foodCartAtom } from "@/atoms/food-cart.atom";
import { Button } from "./ui/button";
import { FINALITEMTYPE } from "@/types/item.type";
import { Separator } from "./ui/separator";

const BasketItem = ({
  data,
  onDataChange,
  onDataDelete,
}: {
  data: FINALITEMTYPE;
  onDataChange: (item: FINALITEMTYPE) => void;
  onDataDelete: (item: FINALITEMTYPE) => void;
}) => {
  const [item, setItem] = useState<FINALITEMTYPE>();

  useEffect(() => {
    if (item) {
      onDataChange(item);
    }
  }, [item]);

  useEffect(() => {
    setItem(data);
  }, [data]);

  return (
    <div className="relative w-full flex justify-between items-center bg-secondary/80 rounded-md p-4">
      {item && (
        <>
          <div className="flex items-center gap-2 w-40">
            <SquareDot
              className={`stroke-3 w-4 h-4 ${
                item.veg ? "text-green-400" : "text-red-400"
              }`}
            />
            <span className="font-bold capitalize">
              {item.varients.varientName[0]}
            </span>
            <span className="font-medium text-nowrap truncate">
              {item.name}
            </span>
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="flex justify-center items-center gap-1 w-fit bg-background p-2 rounded-full">
              <Button
                size={"icon"}
                variant={"secondary"}
                className="w-6 h-6"
                effect={"ringHover"}
                onClick={() =>
                  setItem({ ...item, quantity: item.quantity + 1 })
                }
              >
                <Plus />
              </Button>
              <div className="font-bold w-5 flex justify-center items-center text-sm">
                {item.quantity}
              </div>
              <Button
                size={"icon"}
                variant={"outline"}
                className="w-6 h-6"
                effect={"ringHover"}
                onClick={() =>
                  !(item.quantity === 1) &&
                  setItem({ ...item, quantity: item.quantity - 1 })
                }
              >
                <Minus />
              </Button>
            </div>
            <Button
              size={"icon"}
              variant={"ghost"}
              effect={"ringHover"}
              className="w-6 h-6"
              onClick={() => onDataDelete(item)}
            >
              <Trash2 />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default function OrderBasket({ children }: { children: ReactNode }) {
  const [items, setItems] = useAtom(foodCartAtom);

  const updateItem = (data: FINALITEMTYPE) => {
    if (items) {
      const newItemList =
        items.map((item) =>
          item.varients.varientId === data.varients.varientId ? data : item
        ).length > 0
          ? items.map((item) =>
              item.varients.varientId === data.varients.varientId ? data : item
            )
          : null;
      setItems(newItemList);
    }
  };
  const deleteItem = (data: FINALITEMTYPE) => {
    if (items) {
      if (
        items.filter(
          (item) => item.varients.varientId !== data.varients.varientId
        ).length > 0
      ) {
        setItems(
          items.filter(
            (item) => item.varients.varientId !== data.varients.varientId
          )
        );
      } else {
        setItems(null);
      }
    }
  };


  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="top" className="w-92 mb-2 backdrop-blur-lg bg-popover/60">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Sparkles className="w-6 h-6 " /> <span>Food Cart</span>
          </div>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => setItems(null)}
          >
            <Trash2 />
            Delete All
          </Button>
        </div>
        <Separator className="mt-3.5"/>
        <ScrollArea className="h-72 px-2 py-4">
          {items ? (
            <div className="w-full flex flex-col gap-4">
              {items.map((item) => (
                <BasketItem
                  data={item}
                  onDataChange={updateItem}
                  onDataDelete={deleteItem}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-60 text-xl font-bold">
              No Item
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
