import type { Href } from 'expo-router';

type RouterLike = {
  back: () => void;
  replace: (href: Href) => void;
  canGoBack?: () => boolean;
};

export function goBackOrReplace(router: RouterLike, fallback: Href) {
  if (typeof router.canGoBack === 'function' && router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallback);
}
