// @ts-ignore
import path from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common';

export default merge(
  common,
  {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 8888,
    },
  },
);

