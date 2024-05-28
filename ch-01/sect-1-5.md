
## 1.5 로컬에서 시작하기

```sh
$ npm i -g typescript

$ which tsc
/home/jay/.nvm/versions/node/v20.13.1/bin/tsc

$ tsc --version
Version 5.4.5
```

### 1.5.1 로컬에서 실행하기

```sh
$ tsc --init

Created a new tsconfig.json with:

  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true

$ cat index.ts
console.print('Hello World');

$ tsc index.ts 
index.ts:1:9 - error TS2339: Property 'print' does not exist on type 'Console'.

1 console.print('Hello World');
          ~~~~~


Found 1 error in index.ts:1

$ cat index.js
console.print('Hello World');
```

:wq