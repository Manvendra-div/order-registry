import { dateAtom } from "@/atoms/date-atom";
import { ordersAtom } from "@/atoms/orders.atom";
import { getOrderList } from "@/firebase/functions";
import { OrderType } from "@/types/order.type";
import { isSameDay } from "date-fns";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "sonner";

const useOrderList = () => {
  const [ordersList, setOrders] = useAtom(ordersAtom);
  const date = useAtomValue(dateAtom);
  const orders = {
    reload: () => {
      getOrderList().then((orders) => {
        if (orders.success) {
          const filteredOrder = orders.data?.filter((order) =>
            isSameDay(
              new Date(
                order.timeStamp.seconds * 1000 +
                  order.timeStamp.nanoseconds / 1000000
              ),
              date
            )
          ) as unknown as OrderType[];
          if (filteredOrder.length > 0) {
            setOrders(filteredOrder);
          } else {
            setOrders(null);
          }
        } else {
          toast.error(orders.message);
        }
      });
    },
    orderList: ordersList,
    setOrders,
  };
  return { ordersObject: orders };
};

export default useOrderList;
