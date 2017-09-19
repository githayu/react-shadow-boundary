import * as postcss from 'postcss';

export default function toShadyCSS(css: string, scope: string, prefix = 'shady') {
  const style = postcss.parse(css);
  const hostClassName = `.${prefix}-${scope}`;

  style.walkRules(rule => {
    let addScope = true;

    if (/^:host-context/.test(rule.selector)) {
      addScope = false;

      rule.selector = rule.selector
        .replace(/^:host-context\((.*)\)(.*)$/, (match, p1, p2) => {
          return `${p1} ${hostClassName} ${p2}`.trim();
        });

    } else if (/^:host/.test(rule.selector)) {
      addScope = false;

      rule.selector = rule.selector
        .replace(':host', hostClassName)
        .replace(/\(|\)/g, '');
    }

    if (rule.selector.includes(' /deep/ ')) {
      addScope = false;

      rule.selector = rule.selector.replace('/deep/ ', '');
    }

    if (addScope) {
      rule.selector = rule.selector.concat(`[data-scope=${scope}]`);
    }
  });

  const element = document.createElement('style');
  element.innerText = style.toString();
  document.head.appendChild(element);

  return element;
}