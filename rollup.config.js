import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
// import uglify from 'rollup-plugin-uglify'

const extensions = ['.js']
export default
{
  input: './src/main.js',
  output: [
    {
      file: 'lib/main.js',
      format: 'cjs'
      // exports: 'named'
    }
  ],
  plugins: [
    json(),
    nodeResolve(extensions),
    babel({
      include: 'src/**/*',
      exclude: '**/node_modules/**',
      babelHelpers: 'runtime',
      extensions
    }),
    commonjs()
  ]
}
