// @ts-ignore
import path from "path";
import { merge } from 'webpack-merge';
import common from './webpack.common';

export default [
  merge(
    common.libConfig,
    {
      mode: 'development',
    }
  ),
  merge(
    common.exampleConfig,
    {
      mode: 'development',
      devtool: 'cheap-module-source-map',
      devServer: {
        static: {
          directory: path.join(__dirname, 'docs'),
        },
        compress: true,
        port: 8080,
      },
    }
  ),
];
