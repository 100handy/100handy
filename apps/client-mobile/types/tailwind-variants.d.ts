// Type declaration to fix missing module error in @gluestack-ui/nativewind-utils
// This resolves: Cannot find module 'tailwind-variants/dist/config'
declare module 'tailwind-variants/dist/config' {
  import type { Config as TwMergeConfig } from 'tailwind-merge';

  export type TVVariants = Record<string, Record<string, any>>;

  export type TWMConfig = {
    twMerge?: boolean;
    twMergeConfig?: Partial<TwMergeConfig>;
  };

  export type TVConfig<
    V extends TVVariants | undefined = any,
    EV extends TVVariants | undefined = any,
  > = {
    responsiveVariants?: boolean | string[] | Record<string, boolean | string[]>;
  } & TWMConfig;
}
