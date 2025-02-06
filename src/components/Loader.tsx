import { loaderAtom } from "@/atoms/loading.atom";
import { useAtomValue } from "jotai";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

export default function Loader() {
  const loading = useAtomValue(loaderAtom);
  return (
    <Dialog open={loading}>
      <DialogContent className="max-w-62">
        <DialogTitle>On it...</DialogTitle>
        <Loader2 className="animate-spin w-20 h-20 mx-auto"/>
      </DialogContent>
    </Dialog>
  );
}
