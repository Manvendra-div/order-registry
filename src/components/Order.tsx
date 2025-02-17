import zomatoDark from "@/assets/zomato-dark.png";
import zomatoLight from "@/assets/zomato-light.png";
import swiggyDark from "@/assets/swiggy-dark.png";
import swiggyLight from "@/assets/swiggy-light.png";
import { Button } from "./ui/button";
import { Copy, Info, Loader2, QrCode, Wallet } from "lucide-react";
import { useTheme } from "./ui/theme-provider";
import { OrderType } from "@/types/order.type";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";
import { updateOrder } from "@/firebase/functions";
import { toast } from "sonner";
import useOrderList from "@/hooks/ordersList.hook";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function Order({ order }: { order: OrderType }) {
  const { theme } = useTheme();
  const [paidToggle, setPaidToggle] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const { ordersObject } = useOrderList();

  useEffect(() => {
    if (paidToggle && order.id) {
      setToggleLoading(true);
      updateOrder(order.id, { ...order, isPaid: paidToggle }).then(
        (response) => {
          if (response.success) {
            toast.success("Order Payment Status Updated");
            setToggleLoading(false);
          } else {
            toast.error(response.message);
          }
        },
      );
      ordersObject.reload();
    }
  }, [paidToggle]);

  return (
    <div className="w-full p-2 relative h-20 border bg-muted/20 rounded-md flex justify-between items-center px-4">
      <span className="absolute top-1.5 left-3.5 text-sm font-mono text-muted-foreground">
        {order.id}
      </span>
      {order.isZomato && (
        <img
          src={theme === "light" ? zomatoLight : zomatoDark}
          className="absolute bottom-2 left-4 w-12 opacity-60"
        />
      )}
      {order.isSwiggy && (
        <img
          src={theme === "light" ? swiggyLight : swiggyDark}
          className="absolute bottom-2 left-4 w-12 opacity-60"
        />
      )}
      <span className="text-sm sm:text-base font-thin max-w-32 sm:max-w-48 truncate">
        {order.name}
      </span>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"secondary"}
            effect={"ringHover"}
            className="w-8 h-8"
            size={"icon"}
          >
            <Info />
          </Button>
        </DialogTrigger>
        <DialogContent className="pb-0 overflow-hidden w-full sm:w-fit max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              <Button
                size={"sm"}
                effect={"expandIcon"}
                icon={Copy}
                iconPlacement="right"
                variant={"secondary"}
                className="select-none h-6 text-xs"
              >
                {order.orderId}
              </Button>
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableCaption className="text-xs pb-4">
              {format(
                "seconds" in order.timeStamp
                  ? new Date(
                      order.timeStamp.seconds * 1000 +
                        order.timeStamp.nanoseconds / 1000000,
                    )
                  : (order.timeStamp as Date),
                "MMMM d, yyyy HH:mm",
              )}
            </TableCaption>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Quantity</TableHead>
                <TableHead className="w-[100px]">Variant</TableHead>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className=" text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
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
                <TableCell colSpan={3} className="text-base font-semibold">
                  Total
                </TableCell>
                <TableCell className="text-lg font-bold text-right">
                  ₹{order.allTotal}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </DialogContent>
      </Dialog>

      <div className="text-xs font-medium flex flex-col justify-center items-end gap-1.5 text-muted-foreground">
        <span className="text-xl sm:text-2xl font-bold text-foreground">
          ₹{order.allTotal}
        </span>
        {order.isPaid ? (
          <div className="flex justify-center items-center gap-1.5">
            {" "}
            Paid via{" "}
            {order.isCash ? (
              <>
                <Wallet className="w-4 h-4" /> Cash
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4" /> Online
              </>
            )}
          </div>
        ) : (
          <div className="relative flex justify-center items-center gap-1.5">
            <Label htmlFor="paid-switch">Paid -</Label>{" "}
            <Switch
              checked={paidToggle}
              onCheckedChange={setPaidToggle}
              id="paid-switch"
            />
            {toggleLoading && (
              <div className="absolute bg-background/80 z-10 inset-0 flex justify-center items-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
