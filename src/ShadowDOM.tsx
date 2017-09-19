import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import * as hash from 'object-hash';
import ShadowRootProvider from './ShadowRootProvider';

export interface Props {
  styles?: string | Promise<any> | (string|Promise<any>)[]
  native?: boolean
  className?: string
  shadowRoot?: ShadowRootInit
  shadyPrefix?: string
  hashLength?: number
}

export interface State {
  scopeName: string
  isNative: boolean
  styles?: string[]
}

class ShadowDOM extends React.Component <Props, State> {
  root: ShadowRoot & { tagName?: string };
  node: HTMLDivElement;

  static defaultProps = {
    native: true,
    shadowRoot: {
      mode: 'open'
    },
    shadyPrefix: 'shady',
    hashLength: 10
  }

  static contextTypes = {
    router: PropTypes.object
  }

  componentWillMount() {
    const { styles, native, hashLength } = this.props;
    const isNative = native && _.isFunction(document.body.attachShadow);

    if (!_.isUndefined(styles)) {
      const promiseStyles = _.isArray(styles) ? styles : [ styles ];

      Promise.all(promiseStyles)
        .then(res => {
          const nextStyles = res.map(item => _.isArray(item)
            ? item.toString()
            : item
          );

          const scopeName = hash.MD5(nextStyles).substr(0, hashLength);

          this.setState({
            scopeName,
            styles: nextStyles
          });
        });
    }

    this.setState({
      isNative
    });
  }

  componentDidMount() {
    const {
      props: { shadowRoot },
      state: { isNative }
    } = this;

    if (isNative) {
      this.root = this.node.attachShadow(shadowRoot);
      this.root.tagName = 'div';
    }

    this.renderer();
  }

  componentDidUpdate() {
    this.renderer();
  }

  renderer() {
    const {
      context,
      props: { children, shadyPrefix },
      state: { isNative, scopeName, styles }
    } = this;

    if (_.isUndefined(styles)) {
      return;
    }

    if (isNative) {
      ReactDOM.render(
        React.createElement(ShadowRootProvider(context).native, {
          styles,
          scopeName
        }, children),
        this.root as any
      );

    } else {
      ReactDOM.render(
        React.createElement(ShadowRootProvider(context).shady, {
          styles,
          scopeName,
          prefix: shadyPrefix
        }, children),
        this.node
      );
    }
  }

  render() {
    const {
      props: { className, shadyPrefix },
      state: { scopeName, isNative }
    } = this;

    return (
      <div
        ref={(e) => this.node = e}
        className={[
          className,
          isNative ? '' : [shadyPrefix, scopeName].join('-')
        ].join(' ').trim()}
      />
    );
  }
}

export default ShadowDOM;