import * as React from 'react';
import * as _ from 'lodash';

export default function applyScope(element: React.ReactChild, scope: string, prefix = 'shady') {
  if (_.isString(element) || _.isNumber(element) || _.isNil(element)) {
    return element;
  }

  type props = {
    key: string,
    children?: React.ReactChild | React.ReactChild[],
    'data-scope': string
  };

  const props: props = {
    key: _.uniqueId(`${scope}-`),
    'data-scope': scope
  };

  if (_.has(element, 'props.children')) {
    const { children } = element.props;

    props.children = _.isArray(children)
      ? children.map(c => applyScope(c, scope))
      : applyScope(children, scope, prefix);
  }

  return React.cloneElement(element, props);
}