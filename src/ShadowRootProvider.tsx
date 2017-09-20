import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';
import toShadyDOM from './toShadyDOM';
import toShadyCSS from './toShadyCSS';

interface ShadowProps {
  styles: string | string[],
  scopeName: string
}

interface ShadyProps {
  styles: string | string[],
  scopeName: string,
  prefix: string
}

interface ShadyState {
  childElements?: React.ReactNode,
  styleElements?: HTMLStyleElement[]
}

export default (context: {[key: string]: any} = {}) => {

  class ContextProvider<P, S> extends React.Component<P, S> {
    static childContextTypes = Object.keys(context).reduce((types: {[key: string]: any}, key) => {
      return types[key] = PropTypes.any, types;
    }, {});

    getChildContext() {
      return context;
    }
  }

  class ShadowRoot extends ContextProvider<ShadowProps, undefined> {
    render() {
      const { styles, children, scopeName } = this.props;
      const wrapper = [ children ];

      if (!_.isUndefined(styles)) {
        if (_.isArray(styles)) {
          wrapper.unshift(styles.reduce((elements: React.ReactElement<any>[], style, index) => {
            elements.push(
              <style key={`${scopeName}-${index}`}>{style}</style>
            );

            return elements;
          }, []));

        } else {
          wrapper.unshift(React.createElement('style', null, styles));
        }
      }

      return wrapper as any;
    }
  }

  class ShadyRoot extends ContextProvider<ShadyProps, ShadyState> {
    componentWillMount() {
      const { styles, children, scopeName, prefix } = this.props;

      let styleElements: HTMLStyleElement[];
      let childElements: React.ReactNode;

      if (!_.isUndefined(styles)) {
        if (_.isArray(styles)) {
          styleElements = styles.map(style => toShadyCSS(style, scopeName));

        } else {
          styleElements = [ toShadyCSS(styles, scopeName) ]
        }
      }

      if (!_.isUndefined(children)) {
        if (_.isArray(children)) {
          childElements = children.reduce((elements: any[], element) => {
            if (_.every(['type', 'props', 'key', 'ref'], _.partial(_.has, element))) {
              elements.push(toShadyDOM(element as any, scopeName, prefix));

            } else if (_.isString(element) || _.isNumber(element)) {
              elements.push(element);
            }

            return elements;
          }, []);

        } else {
          childElements = children;
        }
      }

      this.setState({
        childElements,
        styleElements
      });
    }

    componentWillUnmount() {
      this.state.styleElements.forEach(element => {
        document.head.removeChild(element);
      });
    }

    render() {
      return this.state.childElements as JSX.Element;
    }
  }

  return {
    native: ShadowRoot,
    shady: ShadyRoot
  }
};