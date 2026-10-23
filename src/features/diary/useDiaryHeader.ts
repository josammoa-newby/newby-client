import { getDiaryHeader } from './service';
import { useAsyncData } from './useAsyncData';

export function useDiaryHeader() {
  return useAsyncData(getDiaryHeader);
}
