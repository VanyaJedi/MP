export const extend = <T extends unknown> (a: unknown, b: unknown): T => Object.assign({} as T, a, b);

export const uniqueId = (): number => Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

export const generateCSSVarForCorrectMobileHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};