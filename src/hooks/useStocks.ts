import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../services/api';
import {
  StockSearchResponseSchema,
  StockDetailResponseSchema,
  type StockSearchResult,
  type StockDetailResponse,
} from '../types/stock';

export function useStockSearch(query: string) {
  return useQuery({
    queryKey: ['stockSearch', query],
    queryFn: async (): Promise<StockSearchResult[]> => {
      const raw = await apiGet(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      const parsed = StockSearchResponseSchema.parse(raw);
      return parsed.stocks;
    },
    enabled: query.length >= 1,
    staleTime: 30_000,
  });
}

export function useStockDetail(symbol: string) {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: async (): Promise<StockDetailResponse> => {
      const raw = await apiGet(`/api/stocks/${symbol}`);
      return StockDetailResponseSchema.parse(raw);
    },
    enabled: !!symbol,
    refetchInterval: 60_000,
  });
}
