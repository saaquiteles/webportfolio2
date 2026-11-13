import { useMediaQuery } from './useMediaQuery';

export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)', false, false);
}
