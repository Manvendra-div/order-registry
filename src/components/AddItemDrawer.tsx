import { ReactNode, useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Minus, Plus, ShoppingBag, SquareDot } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { FINALITEMTYPE, ITEMTYPE } from "@/types/item.type";
import { useAtom } from "jotai";
import { foodCartAtom } from "@/atoms/food-cart.atom";
import { toast } from "sonner";

export default function AddItemDrawer({
  children,
  data,
}: {
  children: ReactNode;
  data: ITEMTYPE;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1);
  const [items, setItems] = useAtom(foodCartAtom);
  const [varient, setVarient] = useState<FINALITEMTYPE["varients"]>();


  useEffect(() => {
    setCount(1);
  }, [varient]);

  useEffect(() => {
    setVarient(data.varients[0]);
  }, []);

  const addItems = (item: FINALITEMTYPE) => {
    const existingItem = items?.find(
      (entity) => entity.varients.varientId === item.varients.varientId
    );

    if (existingItem) {
      toast.warning("Duplicate Item found", {
        description: "Item already available in food cart",
      });
    } else {
      setItems(items ? [...items, item] : [item]);
      toast.success("Item Added to Food Cart", {
        description: `${item.name} is added to food cart`,
      });
      setOpen(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="backdrop-blur-lg bg-background/60">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{data.name}</DrawerTitle>
            <DrawerDescription>
              <SquareDot
                className={`stroke-3 w-4 h-4 ${
                  data.veg ? "text-green-400" : "text-red-400"
                }`}
              />
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 flex flex-col gap-4 justify-center items-center">
            <ToggleGroup
              value={varient?.varientName}
              onValueChange={(value: string) => {
                const foundVarient = data.varients.find(
                  (item) =>
                    item.varientName ===
                    (value as unknown as "quarter" | "half" | "full")
                );
                if (foundVarient) {
                  setVarient(foundVarient);
                }
              }}
              type="single"
              className="w-fit gap-0 bg-secondary/60 rounded-md"
            >
              {data.varients.map((varient) => (
                <ToggleGroupItem
                  value={varient.varientName}
                  aria-label="Toggle italic"
                  className="hover:bg-transparent"
                >
                  <span className="text-xs mx-2 capitalize">
                    {varient.varientName} - ₹{varient.price}
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <div className="flex justify-center items-center gap-2 w-fit bg-secondary p-2 rounded-full">
              <Button
                size={"icon"}
                variant={"outline"}
                className="w-8 h-8"
                effect={"ringHover"}
                onClick={() => setCount(count + 1)}
              >
                <Plus />
              </Button>
              <div className="font-bold w-5 flex justify-center items-center text-lg">
                {count}
              </div>
              <Button
                size={"icon"}
                variant={"outline"}
                className="w-8 h-8"
                effect={"ringHover"}
                onClick={() => !(count === 1) && setCount(count - 1)}
              >
                <Minus />
              </Button>
            </div>
            {varient && (
              <div className="mt-3 h-[80px] flex gap-4 items-center justify-center text-4xl font-bold">
                <span className="">₹{varient.price}</span> <span>*</span>{" "}
                <span>{count}</span> = <span>₹{varient.price * count}</span>
              </div>
            )}
          </div>
          <DrawerFooter>
            <Button
              effect={"expandIcon"}
              icon={ShoppingBag}
              iconPlacement="right"
              size={"lg"}
              className="text-lg font-bold"
              onClick={() => {
                if (varient) {
                  addItems({
                    id: data.id,
                    name: data.name,
                    varients: varient,
                    veg: data.veg,
                    quantity: count,
                  });
                }
              }}
            >
              Add
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
