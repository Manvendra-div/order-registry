import { Plus, QrCode, Search, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import NoDataSVG from "@/assets/no-data.svg";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import AddOrderDailog from "./AddOrderDailog";
import zomatoDark from "@/assets/zomato-dark.png";
import zomatoLight from "@/assets/zomato-light.png";
import swiggyDark from "@/assets/swiggy-dark.png";
import swiggyLight from "@/assets/swiggy-light.png";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useTheme } from "./ui/theme-provider";
import { toast } from "sonner";
import { getMenuItems } from "@/api/menu.api";
import { MenuType } from "@/types/menu.type";
import Order from "./Order";
import useOrderList from "@/hooks/ordersList.hook";

export default function OrderBox() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const {ordersObject} = useOrderList();
  const [menu, setMenu] = useState<MenuType["items"] | null>(null);

  const todayTotal = useMemo(() => {
    return ordersObject.orderList?.reduce((total, order) => total + order.allTotal, 0);
  }, [ordersObject.orderList]);

  useEffect(() => {
    getMenuItems().then((response) => {
      if (response.success && response.data) {
        setMenu(response.data);
      } else {
        toast.error(response.message);
      }
    });

    const container = containerRef.current;
    if (container) {
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);

      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <div
      className="relative w-[96%] lg:w-1/3 bg-background mx-auto rounded-md p-2 flex flex-col justify-between items-center h-[600px] max-w-[800px] overflow-hidden border"
      ref={containerRef}
    >
      {ordersObject.orderList ? (
        <>
          <motion.div
            className="absolute top-10 z-20 flex flex-col gap-4 justify-center items-center w-[80%]"
            initial={{ top: -30 }}
            animate={{ top: isHovered ? 30 : -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full">
              <Input
                className="peer pe-2 ps-9 backdrop-blur-xs bg-background/60 h-14"
                placeholder="Search..."
                type="search"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Search size={16} strokeWidth={2} />
              </div>
            </div>
          </motion.div>

          <ScrollArea className="w-full h-full pb-16">
            <div className="p-4 flex flex-col gap-4">
              <h4 className="mb-4 text-sm font-semibold leading-none">
                Orders
              </h4>
              {ordersObject.orderList.map((order) => (
                <Order order={order} />
              ))}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <img src={NoDataSVG} className="w-[50%] opacity-40" />
          <span className="font-medium text-xl">No Order till now</span>
        </div>
      )}
      <div className="absolute bottom-0 w-full">
        <div className="bg-background border-t border-x p-2 w-fit ml-auto font-bold text-2xl">
          ₹{todayTotal}
        </div>
        <div className="flex items-center justify-between p-4 backdrop-blur-lg bg-secondary/20 w-full rounded-b-md border-t">
          <ToggleGroup
            type="multiple"
            className="w-[40%] flex justify-between items-center"
          >
            <ToggleGroupItem value="zomato" aria-label="Toggle italic">
              <img
                src={theme === "light" ? zomatoLight : zomatoDark}
                className="w-16"
              />
            </ToggleGroupItem>
            <ToggleGroupItem value="swiggy" aria-label="Toggle italic">
              <img
                src={theme === "light" ? swiggyLight : swiggyDark}
                className="w-16"
              />
            </ToggleGroupItem>
          </ToggleGroup>
          {menu && (
            <AddOrderDailog MenuItem={menu}>
              <Button size={"icon"}>
                <Plus />
              </Button>
            </AddOrderDailog>
          )}
          <ToggleGroup
            type="multiple"
            className="w-[40%] flex justify-between items-center"
          >
            <ToggleGroupItem value="online" aria-label="Toggle italic">
              <div className="flex justify-center items-center gap-1 sm:gap-2 text-xs sm:text-sm sm:mx-0 mx-1">
                <QrCode />
                Online
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value="cash" aria-label="Toggle italic">
              <div className="flex justify-center items-center gap-1 sm:gap-2 text-xs sm:text-sm sm:mx-0 mx-1">
                <Wallet />
                Cash
              </div>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
