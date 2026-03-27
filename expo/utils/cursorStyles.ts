/**
 * Пользовательские курсоры для web
 * Контекстно-специфичные курсоры для детской безопасности
 */

export const cursorStyles = {
  // Основной курсор - дружелюбный, но серьезный
  default: `
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23FF8C00" opacity="0.8"/><circle cx="12" cy="12" r="6" fill="%23FFFFFF"/></svg>') 12 12, auto;
  `,
  
  // Курсор для интерактивных элементов
  pointer: `
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 3l18 18M3 21L21 3" stroke="%23FF8C00" stroke-width="2"/><circle cx="12" cy="12" r="8" fill="none" stroke="%23FF8C00" stroke-width="2"/></svg>') 12 12, pointer;
  `,
  
  // Курсор для текста
  text: `
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" fill="%231E90B8" opacity="0.3"/><line x1="8" y1="10" x2="16" y2="10" stroke="%231E90B8" stroke-width="2"/></svg>') 12 12, text;
  `,
  
  // Курсор для загрузки
  wait: `
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="%23FF8C00" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="15.708"><animate attributeName="stroke-dashoffset" values="31.416;0;31.416" dur="1s" repeatCount="indefinite"/></circle></svg>') 12 12, wait;
  `,
  
  // Курсор для запрещенных действий
  notAllowed: `
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23F07D7D" opacity="0.8"/><line x1="8" y1="8" x2="16" y2="16" stroke="%23FFFFFF" stroke-width="3"/></svg>') 12 12, not-allowed;
  `,
  
  // Курсор для перетаскивания
  grab: `
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="8" cy="8" r="2" fill="%23FF8C00"/><circle cx="16" cy="8" r="2" fill="%23FF8C00"/><circle cx="8" cy="16" r="2" fill="%23FF8C00"/><circle cx="16" cy="16" r="2" fill="%23FF8C00"/></svg>') 12 12, grab;
  `,
};

/**
 * Применить пользовательские курсоры к элементу
 */
export const applyCursorStyle = (element: HTMLElement, cursorType: keyof typeof cursorStyles) => {
  if (typeof document !== 'undefined') {
    element.style.cssText += cursorStyles[cursorType];
  }
};

/**
 * Глобальное применение курсоров для web
 */
export const applyGlobalCursorStyles = () => {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    * {
      ${cursorStyles.default}
    }
    button, a, [role="button"] {
      ${cursorStyles.pointer}
    }
    input, textarea, [contenteditable] {
      ${cursorStyles.text}
    }
    [data-loading="true"] {
      ${cursorStyles.wait}
    }
    [data-disabled="true"] {
      ${cursorStyles.notAllowed}
    }
    [data-draggable="true"] {
      ${cursorStyles.grab}
    }
  `;
  document.head.appendChild(style);
};


