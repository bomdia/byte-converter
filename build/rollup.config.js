import commonjs from '@rollup/plugin-commonjs' // Convert CommonJS modules to ES6
import buble from '@rollup/plugin-buble' // Transpile/polyfill with reasonable browser support
import resolve from '@rollup/plugin-node-resolve' // handle including of module
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts', // Path relative to package.json
  output: {
    name: 'ByteConverter',
    exports: 'named'
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' })
    // commonjs(),
    // resolve(),
    // buble({ target: { chrome: 60 } }) // Transpile to ES5
  ]
}
