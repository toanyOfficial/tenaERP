"use client";

import { useEffect, useRef } from "react";
import type { FormEvent, ReactNode } from "react";
import { SearchActions } from "@/components/form/search-bar/SearchActions";

type SearchBarProps = {
  children: ReactNode;
  onSearch: () => void;
  onReset?: () => void;
  autoSearchOnMount?: boolean;
  disableSearch?: boolean;
};

export function SearchBar({ children, onSearch, onReset, autoSearchOnMount = true, disableSearch }: SearchBarProps) {
  const didAutoSearchRef = useRef(false);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (!autoSearchOnMount) return;
    if (didAutoSearchRef.current) return;

    didAutoSearchRef.current = true;
    onSearchRef.current();
  }, [autoSearchOnMount]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded border border-slate-200 bg-white px-3 py-2">
      <div className="flex flex-wrap items-center gap-3">
        {children}
        <SearchActions onSearch={onSearch} onReset={onReset} disableSearch={disableSearch} />
      </div>
    </form>
  );
}
