## demo usage

```bash
wasm-pack build
cd pkg
pnpm link --global
cd ../site
pnpm i
pnpm link --global md2html
pnpm run serve
```
