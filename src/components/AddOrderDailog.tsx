import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Button } from "./ui/button";
import {
  ArrowRight,
  Copy,
  Plus,
  QrCode,
  Search,
  ShoppingCart,
  SquareDot,
  Trash,
  Wallet,
} from "lucide-react";
import { Input } from "./ui/input";
import AddItemDrawer from "./AddItemDrawer";
import { ITEMTYPE } from "@/types/item.type";
import OrderBasket from "./OrderBasket";
import { useAtom } from "jotai";
import { foodCartAtom } from "@/atoms/food-cart.atom";
import { AnimatePresence, motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { generate6DigitId } from "@/lib/utils";
import { postOrder } from "@/firebase/functions";
import { loaderAtom } from "@/atoms/loading.atom";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { MenuType } from "@/types/menu.type";
import { Helmet } from "react-helmet";
import useOrderList from "@/hooks/ordersList.hook";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const Item = ({ data }: { data: ITEMTYPE }) => {
  return (
    <div className="z-0 bg-secondary/80 rounded-md px-3 py-2 w-full lg:w-fit min-w-44 flex flex-col justify-between gap-4 hover:bg-secondary/60 h-fit">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold">{data.name}</span>
        <SquareDot
          className={`stroke-3 w-4 h-4 ${
            data.veg ? "text-green-400" : "text-red-400"
          } `}
        />
      </div>
      <AddItemDrawer data={data}>
        <Button
          size={"sm"}
          effect={"expandIcon"}
          icon={Plus}
          variant={"outline"}
          iconPlacement="right"
        >
          Add
        </Button>
      </AddItemDrawer>
    </div>
  );
};

export default function AddOrderDailog({
  children,
  MenuItem,
}: {
  children: ReactNode;
  MenuItem: MenuType["categories"];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [foodBasket, setFoodBasket] = useAtom(foodCartAtom);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">();
  const [searchInput, setSearchInput] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [onlinePartners, setOnlinePartners] = useState<{
    isZomato: boolean;
    isSwiggy: boolean;
  }>({
    isZomato: false,
    isSwiggy: false,
  });
  const { ordersObject } = useOrderList();

  const setLoading = useAtom(loaderAtom)[1];

  const handleNextScreen = () => {
    if (foodBasket && foodBasket.length > 0) {
      setCurrentScreen(1);
    } else {
      toast.error("Add alteast one item to proceed");
    }
  };

  const totalAmount = useMemo(() => {
    return (
      foodBasket?.reduce(
        (total, item) => total + item.quantity * item.varients.price,
        0,
      ) || 0
    );
  }, [foodBasket]);

  const itemNames = useMemo(() => {
    return foodBasket
      ? foodBasket.map((item) => item.name).join(", ")
      : "No Item";
  }, [foodBasket]);

  const handleConfirm = () => {
    if (paymentMethod && totalAmount && foodBasket) {
      setLoading(true);

      postOrder({
        isPaid: false,
        allTotal: totalAmount,
        items: foodBasket,
        name: itemNames,
        orderId,
        isCash: paymentMethod === "cash",
        timeStamp: new Date(),
        isSwiggy: onlinePartners.isSwiggy,
        isZomato: onlinePartners.isZomato,
      })
        .then((output) => {
          if (output.success) {
            toast.success(output.message);
            setLoading(false);
            setOpen(false);
          } else {
            toast.error(output.message);
            setLoading(false);
          }
        })
        .finally(() => {
          ordersObject.reload();
        });
    } else {
      toast.error("Select Payment Method");
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentScreen(0);
      setFoodBasket(null);
      setOrderId(generate6DigitId());
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {orderId !== "" && (
        <Helmet>
          <title>
            {orderId} | {itemNames}
          </title>
        </Helmet>
      )}

      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-[100vw] sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>
            Create a Order{" "}
            <Button
              size={"sm"}
              effect={"expandIcon"}
              icon={Copy}
              iconPlacement="right"
              variant={"secondary"}
              className="select-none h-6 text-xs"
            >
              {orderId}
            </Button>
          </DialogTitle>
          <DialogDescription>
            Select At Least One Item To Finalize Order
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex justify-center items-center">
          <AnimatePresence mode="wait">
            {currentScreen === 0 ? (
              <motion.div
                key="menuScreen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full h-fit"
              >
                <div className="flex flex-col justify-center w-full">
                  <div className="relative w-[99%] mt-4 mb-2 ml-2">
                    <Input
                      className="capitalize peer pe-2 ps-9 backdrop-blur-xs bg-background/60"
                      placeholder="Search..."
                      type="search"
                      value={searchInput}
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase());
                        setSearchInput(value);
                      }}
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <Search size={16} strokeWidth={2} />
                    </div>
                  </div>
                  <ScrollArea className="w-full h-[400px] relative pb-10">
                    <div className="absolute top-0 w-full bg-gradient-to-b from-background/60 to-transparent z-10 h-10" />
                    <div className="w-full flex flex-col gap-8 h-full p-4">
                      {MenuItem.map(
                        (category) =>
                          category.items.filter((item) =>
                            item.name.includes(searchInput),
                          ).length > 0 && (
                            <div
                              key={category.id}
                              className="flex flex-col gap-4"
                            >
                              <span className="leading-tight text-2xl font-medium">
                                {category.title}
                              </span>
                              <div className="flex flex-wrap gap-4 w-full">
                                {category.items
                                  .filter((item) =>
                                    item.name.includes(searchInput),
                                  )
                                  .map((item) => (
                                    <Item data={item} key={item.id} />
                                  ))}
                              </div>
                            </div>
                          ),
                      )}
                    </div>
                    <div className="absolute bottom-10 w-full bg-gradient-to-t from-background/60 to-transparent z-10 h-10" />
                  </ScrollArea>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="confirmScreen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className="flex flex-col w-full gap-4 items-center">
                  <ScrollArea className="w-full h-fit max-w-[90vw] max-h-96 sm:w-full flex flex-col gap-2">
                    <Table className="bg-secondary/10 border rounded-lg">
                      <TableHeader>
                        <TableRow className="text-xs">
                          <TableHead>Quantity</TableHead>
                          <TableHead className="w-[100px]">Variant</TableHead>
                          <TableHead className="w-[100px]">Name</TableHead>
                          <TableHead className=" text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {foodBasket &&
                          foodBasket.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-xs font-semibold text-left text-nowrap">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-xs font-semibold capitalize text-nowrap">
                                {item.varients.varientName}
                              </TableCell>
                              <TableCell className="text-xs font-semibold">
                                <span className="text-nowrap">{item.name}</span>
                              </TableCell>
                              <TableCell className="text-base font-bold text-right text-nowrap">
                                ₹{item.quantity * item.varients.price}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-base font-semibold"
                          >
                            Total
                          </TableCell>
                          <TableCell className="text-lg font-bold text-right">
                            ₹{totalAmount}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod as (value: string) => void}
                  >
                    <SelectTrigger className="w-full bg-secondary/20">
                      <SelectValue placeholder="Select a Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-xs">
                          Payment Methods
                        </SelectLabel>
                        <SelectItem value="online">
                          <div className="flex gap-2 items-center font-medium">
                            <QrCode className="text-muted-foreground" /> Online
                          </div>
                        </SelectItem>
                        <SelectItem value="cash">
                          <div className="flex gap-2 items-center font-medium">
                            <Wallet className="text-muted-foreground" /> Cash
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {paymentMethod === "online" && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="zomato"
                          checked={onlinePartners.isZomato}
                          onCheckedChange={(bool: boolean) =>
                            setOnlinePartners({
                              ...onlinePartners,
                              isZomato: bool,
                            })
                          }
                        />
                        <Label
                          htmlFor="zomato"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Zomato
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="swiggy"
                          checked={onlinePartners.isSwiggy}
                          onCheckedChange={(bool: boolean) =>
                            setOnlinePartners({
                              ...onlinePartners,
                              isSwiggy: bool,
                            })
                          }
                        />
                        <Label
                          htmlFor="swiggy"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Swiggy
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button size={"icon"} variant={"outline"}>
              <Trash className="text-primary" />
            </Button>
            <div className="relative w-fit">
              {foodBasket && (
                <div className="absolute -top-1 -right-3 outline bg-background text-primary outline-primary rounded-full px-2 py-1 text-xs z-10">
                  {foodBasket.length}
                </div>
              )}
              <OrderBasket>
                <Button effect={"shineHover"} size={"icon"} className="">
                  <ShoppingCart />
                </Button>
              </OrderBasket>
            </div>
            <Button
              variant={"outline"}
              className="w-fit"
              onClick={() => setCurrentScreen(0)}
              disabled={currentScreen === 0}
            >
              Back
            </Button>
            <Button
              effect={"expandIcon"}
              icon={ArrowRight}
              iconPlacement="right"
              className="w-fit"
              onClick={currentScreen === 0 ? handleNextScreen : handleConfirm}
            >
              {currentScreen === 0 ? "Next" : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
