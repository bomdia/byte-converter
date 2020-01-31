import commonjs from '@rollup/plugin-commonjs' // Convert CommonJS modules to ES6
import buble from '@rollup/plugin-buble' // Transpile/polyfill with reasonable browser support
import resolve from '@rollup/plugin-node-resolve' // handle including of module

export default {
  input: 'src/byte-converter.class.js', // Path relative to package.json
  output: {
    name: 'ByteConverter',
    exports: 'named'
  },
  plugins: [
    commonjs(),
    resolve(),
    buble({ target: { chrome: 60 } }) // Transpile to ES5
  ]
}
