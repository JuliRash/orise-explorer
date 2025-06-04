"use client";
import { SearchBox } from "./search-box";

export function SearchBar() {
  return (
    <div className="flex flex-col w-full bg-black px-4 py-12 min-h-32 pb-20">
      <div className="w-full flex flex-col gap-3">
        <p className="text-white dark:text-muted-foreground text-lg font-medium">
          Explore Universe chain
        </p>
        <SearchBox />
      </div>
    </div>
  );
}