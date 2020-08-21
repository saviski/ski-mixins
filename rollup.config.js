import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main
    },
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true
      }),
      terser({
        output: {
          comments: false
        }
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module
    },
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true
      })
    ]
  }
]
