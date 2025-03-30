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

export function Settings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-md transition duration-300">
          <SettingsIcon className="size-4.5" />
          Settings
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Adjust your game settings here.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <button className="flex justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition duration-300">
              Save changes
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
