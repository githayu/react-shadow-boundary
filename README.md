# React Shadow Boundary
> encapsulate style with shadow dom react component

## installation
Using yarn:
```sh
yarn add github:githayu/react-shadow-boundary#dev
```

<!-- ```sh
$ yarn add react-shadow-boundary
``` -->

## Usage
### webpack.config.js
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'css-loader'
      }
    ]
  }
}
```

### MyComponent.js
```js
import React from 'react';
import ReactDOM from 'react-dom';
import ShadowDOM from 'react-shadow-boundary';

// css-loader
import styles from './styles.css';

class MyComponent extends React.Component {
  render() {
    return (
      <ShadowDOM
        styles={[
          ':host { background: #fff }',
          styles,
          import(/* webpackChunkName: async-styles */ 'async-styles.css')
        ]}
      >
        <h1>Title</h1>
        <p>description</p>
      </ShadowDOM>
    );
  }
}

ReactDOM.render(<MyComponent />, document.getElementById('app'));
```

## Prop Types
| Property | Type | Default | Description |
| -------- |:----:|:-------:|:------------|
| styles   | string, object, (string\|object)[] || Encapsulate styles. For details see usage |
| native   | boolean | `true` | Use shadow DOM if available |
| shadowRoot | ShadowRootInit | `{ mode: 'open' }` | Shadow Root options |
| shadyPrefix | string | `'shady'` | Shady scope class prefix |
| hashLength | number | `10` | Shady scope class hash length |