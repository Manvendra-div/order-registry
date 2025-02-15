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
  const updateFilters = async (isZomato: boolean, isSwiggy: boolean) => {
    const response = await getOrderList();

    if (response.success && response.data) {
      // First filter by date
      const dateFiltered = response.data.filter((order) =>
        isSameDay(
          new Date(
            order.timeStamp.seconds * 1000 +
              order.timeStamp.nanoseconds / 1000000,
          ),
          date,
        ),
      ) as unknown as OrderType[];

      // Then apply platform filters
      if (isZomato || isSwiggy) {
        const platformFiltered = dateFiltered.filter((order) => {
          if (isZomato) return order.isZomato;
          if (isSwiggy) return order.isSwiggy;
          return false;
        });

        setOrders(platformFiltered.length > 0 ? platformFiltered : null);
      } else {
        // If no platform filter, show all orders for the date
        setOrders(dateFiltered.length > 0 ? dateFiltered : null);
      }
    } else {
      toast.error(response.message);
      setOrders(null);
    }
  };
  const orders = {
    reload: () => {
      getOrderList().then((orderListRaw) => {
        if (orderListRaw.success) {
          const filteredOrder = orderListRaw.data?.filter((order) =>
            isSameDay(
              new Date(
                order.timeStamp.seconds * 1000 +
                  order.timeStamp.nanoseconds / 1000000,
              ),
              date,
            ),
          ) as unknown as OrderType[];
          if (filteredOrder.length > 0) {
            setOrders(filteredOrder);
          } else {
            setOrders(null);
          }
        } else {
          toast.error(orderListRaw.message);
        }
      });
    },
    orderList: ordersList,
    setOrders,
    setConstraints: updateFilters,
  };
  return { ordersObject: orders };
};

export default useOrderList;
