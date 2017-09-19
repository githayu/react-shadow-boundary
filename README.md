# React Shadow Boundary
> React component shadow-dom polyfill

## installation
Using yarn:
```sh
$ yarn add github.com/githayu/react-shadow-boundary
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
import ShadowDOM from 'react-shadow-scope';

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
| styles   | string, object, (string\|object)[] || shadow styles. For details see usage |
| native   | boolean | `true` | use Shadow DOM |
| shadowMode | ShadowRootInit | `{ mode: 'open' }` | Mode of Shadow DOM |
| shadyPrefix | string | `'shady'` | shady scope prefix |
| hashLength | number | `10` | The length of shady hash