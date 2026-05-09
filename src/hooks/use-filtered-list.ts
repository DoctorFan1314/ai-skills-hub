"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface FilterDef {
  /** URL param key */
  key: string;
  /** Default value (initial value when no URL param) */
  defaultValue: string;
  /** The value that means "no filter" (e.g. "__all__") */
  allValue: string;
  /** Human-readable label for active filter tags */
  label: string;
}

interface UseFilteredListOptions<T> {
  items: T[];
  filters: FilterDef[];
  defaultSort: string;
  validSorts: readonly string[];
  basePath: string;
  filterFn: (item: T, query: string, filters: Record<string, string>) => boolean;
  sortFn: (a: T, b: T, sortBy: string) => number;
  pageSize?: number;
  debounceMs?: number;
  queryKey?: string;
  sortKey?: string;
}

export interface ActiveFilter {
  key: string;
  label: string;
  clear: () => void;
}

export function useFilteredList<T>({
  items,
  filters,
  defaultSort,
  validSorts,
  basePath,
  filterFn,
  sortFn,
  pageSize = 12,
  debounceMs = 300,
  queryKey = "q",
  sortKey = "sort",
}: UseFilteredListOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Read initial values from URL (use ref to compute only once)
  const initialRef = useRef<{ query: string; sort: string; filters: Record<string, string> } | null>(null);
  if (initialRef.current === null) {
    const q = searchParams.get(queryKey) || "";
    const s = validSorts.includes(searchParams.get(sortKey) || "") ? searchParams.get(sortKey)! : defaultSort;
    const f: Record<string, string> = {};
    for (const filt of filters) {
      f[filt.key] = searchParams.get(filt.key) || filt.defaultValue;
    }
    initialRef.current = { query: q, sort: s, filters: f };
  }

  const [query, setQuery] = useState(initialRef.current.query);
  const [sortBy, setSortBy] = useState(initialRef.current.sort);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(initialRef.current.filters);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  // Use a ref to always have the latest filter values for URL sync
  const filterValuesRef = useRef(filterValues);
  filterValuesRef.current = filterValues;

  const queryRef = useRef(query);
  queryRef.current = query;

  const sortByRef = useRef(sortBy);
  sortByRef.current = sortBy;

  // --- URL sync ---
  const updateURL = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const q = overrides[queryKey] ?? queryRef.current;
      const sort = overrides[sortKey] ?? sortByRef.current;

      if (q) params.set(queryKey, q);
      if (sort && sort !== defaultSort) params.set(sortKey, sort);

      for (const f of filters) {
        const val = overrides[f.key] ?? filterValuesRef.current[f.key];
        if (val && val !== f.allValue) params.set(f.key, val);
      }

      const url = params.toString() ? `${basePath}?${params.toString()}` : basePath;
      router.replace(url, { scroll: false });
    },
    [router, basePath, queryKey, sortKey, defaultSort, filters],
  );

  const handleQueryChange = useCallback(
    (val: string) => {
      setQuery(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => updateURL({ [queryKey]: val }), debounceMs);
    },
    [updateURL, queryKey, debounceMs],
  );

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // Reset pagination when filters/sort change OR items identity changes
  const filterDeps = filters.map((f) => filterValues[f.key]).join("|");
  const itemsRef = useRef(items);
  useEffect(() => {
    // If items identity changed, reset pagination
    if (itemsRef.current !== items) {
      itemsRef.current = items;
      setVisibleCount(pageSize);
    }
  }, [items, pageSize]);
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [filterDeps, sortBy, pageSize]);

  // --- Set a single filter value + sync URL ---
  const setFilter = useCallback(
    (key: string, val: string) => {
      setFilterValues((prev) => ({ ...prev, [key]: val }));
      updateURL({ [key]: val });
    },
    [updateURL],
  );

  const setSortWithSync = useCallback(
    (val: string) => {
      setSortBy(val);
      updateURL({ [sortKey]: val });
    },
    [updateURL, sortKey],
  );

  // --- Active filters ---
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const list: ActiveFilter[] = [];
    for (const f of filters) {
      const val = filterValues[f.key];
      if (val !== f.allValue) {
        list.push({
          key: f.key,
          label: `${f.label}: ${val}`,
          clear: () => setFilter(f.key, f.allValue),
        });
      }
    }
    return list;
  }, [filters, filterValues, setFilter]);

  const filterFnRef = useRef(filterFn);
  filterFnRef.current = filterFn;

  const sortFnRef = useRef(sortFn);
  sortFnRef.current = sortFn;

  // --- Filtered + sorted list ---
  const filtered = useMemo(() => {
    const result = items.filter((item) => filterFnRef.current(item, query, filterValues));
    result.sort((a, b) => sortFnRef.current(a, b, sortBy));
    return result;
  }, [items, query, sortBy, filterValues]);

  const visibleList = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const loadMore = useCallback(() => setVisibleCount((prev) => prev + pageSize), [pageSize]);

  const clearFilters = useCallback(() => {
    setQuery("");
    setSortBy(defaultSort);
    const cleared: Record<string, string> = {};
    for (const f of filters) {
      cleared[f.key] = f.allValue;
    }
    setFilterValues(cleared);
    router.replace(basePath, { scroll: false });
  }, [router, basePath, defaultSort, filters]);

  return {
    query,
    setQuery,
    handleQueryChange,
    sortBy,
    setSortBy: setSortWithSync,
    filterValues,
    setFilter,
    filtered,
    visibleList,
    visibleCount,
    loadMore,
    clearFilters,
    activeFilters,
  };
}
