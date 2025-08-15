/**
 * Получает значения safe-area-inset через getComputedStyle.
 * Работает только если браузер поддерживает env(safe-area-inset-*).
 */
export function getSafeAreaInsets(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const div = document.createElement('div');
  div.style.cssText = `
    position: absolute;
    top: 0; left: 0;
    padding-top: env(safe-area-inset-top);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    visibility: hidden;
    pointer-events: none;
    z-index: -1;
  `;
  document.body.appendChild(div);

  const style = getComputedStyle(div);
  const top = parseInt(style.paddingTop) || 0;
  const right = parseInt(style.paddingRight) || 0;
  const bottom = parseInt(style.paddingBottom) || 0;
  const left = parseInt(style.paddingLeft) || 0;

  document.body.removeChild(div);

  return {top, right, bottom, left};
}
