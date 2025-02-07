import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hovercard";
import zomatoDark from "@/assets/zomato-dark.png";
import zomatoLight from "@/assets/zomato-light.png";
import swiggyDark from "@/assets/swiggy-dark.png";
import swiggyLight from "@/assets/swiggy-light.png";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Info, Loader2, QrCode, Wallet } from "lucide-react";
import { useTheme } from "./ui/theme-provider";
import { OrderType } from "@/types/order.type";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useEffect, useState } from "react";
import { updateOrder } from "@/firebase/functions";
import { toast } from "sonner";
import useOrderList from "@/hooks/ordersList.hook";

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
        }
      );
      ordersObject.reload();
    }
  }, [paidToggle]);

  return (
    <div className="w-full p-2 relative h-20 border bg-muted/20 rounded-md flex justify-between items-center px-4">
      <span className="absolute top-1.5 left-3.5 text-sm font-mono text-muted-foreground">
        {order.orderId}
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
      <span className="text-sm sm:text-base font-thin max-w-[60%] truncate">
        {order.name}
      </span>
      <HoverCard openDelay={0}>
        <HoverCardTrigger asChild>
          <Button
            variant={"secondary"}
            effect={"ringHover"}
            className="w-8 h-8"
            size={"icon"}
          >
            <Info />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="p-0 mt-2 overflow-hidden">
          {order.items.map((item) => (
            <>
              <div
                key={item.id}
                className="text-muted-foreground flex justify-between items-center px-4 py-2"
              >
                <span className="text-sm font-semibold">{item.name}</span>
                <span className="text-base font-bold">
                  ₹{item.varients.price}
                </span>
              </div>
              <Separator className="w-full" />
            </>
          ))}
          <div className="text-muted-foreground flex justify-between items-center px-4 py-2">
            <span className="text-base font-semibold">Total</span>
            <span className="text-lg font-bold">₹{order.allTotal}</span>
          </div>
        </HoverCardContent>
      </HoverCard>

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
