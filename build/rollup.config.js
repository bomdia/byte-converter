import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts', // Path relative to package.json
  output: {
    name: 'ByteConverter',
    exports: 'named'
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' })
  ]
}
