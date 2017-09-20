import * as React from 'react';
import toShadyCSS from '../src/toShadyCSS';

test(':host selector', () => {
  const styleElement = toShadyCSS(':host {}', 'scope');

  expect(styleElement.innerText).toBe('.shady-scope {}');
});

test(':host-context selector', () => {
  const styleElement = toShadyCSS(':host-context(.is-test) {}', 'scope');

  expect(styleElement.innerText).toBe('.is-test .shady-scope {}')
});