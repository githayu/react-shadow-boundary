import * as React from 'react';
import * as _ from 'lodash';

export default function applyScope(element: React.ReactChild, scopeName = 'shady') {
  if (_.isString(element) || _.isNumber(element)) {
    return element;
  }

  type props = {
    key: string,
    children?: React.ReactChild | React.ReactChild[],
    'data-scope': string
  };

  const props: props = {
    key: _.uniqueId(`${scopeName}-`),
    'data-scope': scopeName
  };

  if (_.has(element, 'props.children')) {
    const { children } = element.props;

    props.children = _.isArray(children)
      ? children.map(c => applyScope(c, scopeName))
      : applyScope(children, scopeName);
  }

  return React.cloneElement(element, props);
}