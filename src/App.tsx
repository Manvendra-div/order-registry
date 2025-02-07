import { useAtom } from "jotai";
import "./App.css";
import OrderBox from "./components/OrderBox";
import { ModeToggle } from "./components/ui/mode-toggle";
import Loader from "./components/Loader";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import { format} from "date-fns";
import { Calendar } from "./components/ui/calendar";
import { useEffect } from "react";
import { dateAtom } from "./atoms/date-atom";
import useOrderList from "./hooks/ordersList.hook";

function App() {
  const [date, setDate] = useAtom(dateAtom);
  const { ordersObject } = useOrderList();

  useEffect(() => {
    ordersObject.reload();
  }, [, date]);

  const onDateChange = (d?: Date) => {
    if (d) {
      setDate(d);
    }
  };

  const disableFutureDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to compare only the date part
    return date > today;
  };

  return (
    <div className="h-screen flex justify-center items-center bg-muted/20">
      <ModeToggle />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal fixed top-10 ",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            disabled={disableFutureDates}
          />
        </PopoverContent>
      </Popover>

      <OrderBox />
      <Loader />
    </div>
  );
}

export default App;
