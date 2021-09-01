import { merge } from 'webpack-merge';
import common from './webpack.common';

export default [
  merge(
    common.libConfig,
    {
      mode: 'production',
      devtool: 'source-map',
    },
  ),
  merge(
    common.exampleConfig,
    {
      mode: 'production',
      devtool: 'source-map',
    },
  ),
];
