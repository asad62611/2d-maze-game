import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";

export function Settings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="fixed right-4 top-4 z-10 font-medium cursor-pointer"
        >
          <SettingsIcon className="size-4.5" />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-foreground/95 text-white border-black">
        <SheetHeader>
          <SheetTitle className="text-white">Settings</SheetTitle>
          <SheetDescription className="text-white/80">
            Adjust your game settings here.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" className="text-black cursor-pointer">
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
