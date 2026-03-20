declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  export type ReactNode = any;
  export function useState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void];
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
}

declare module 'next' {
  export type Metadata = any;
}

declare module 'next/link' {
  const Link: (props: any) => any;
  export default Link;
}

declare module 'next/navigation' {
  export function usePathname(): string;
  export function useParams<T = any>(): T;
}

declare module 'zustand' {
  export type UseBoundStore<T> = {
    (): T;
    <U>(selector: (state: T) => U): U;
  };
  export function create<T>(): (initializer: any) => UseBoundStore<T>;
}

declare module 'zustand/middleware' {
  export function persist<T>(initializer: any, options: any): any;
  export function createJSONStorage(factory: () => Storage): any;
}
