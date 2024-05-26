
# 11. 선언 파일

## 11.1 선언 파일

```ts
// types.d.ts

export interface Character {
	catchphrase?: string;
	name: string;
}
```

```ts
// index.ts

import { Character  } from "./types";

export const character: Character = {
	catchphrase: "Yeh-haw!",
	name: "Sandy Cheeks",
};
```

## 11.2 런타임 값 선언

```ts
// types.d.ts

declare let declared: string;

declare let initializer: string = "Wanda";
	// Error
	// Initializers are not allowed in ambient contexts.
```

```ts
// fairies.d.ts

declare function canGrantWith(wish: string): boolean;

declare function grantWish(wish: string) { return true; }
	// Error
	// An implementation cannot be declared in ambient contexts.

class Fairy {
		// Error
		// Top-level declarations in .d.ts files must start with either
		// a 'declare' or 'export' modifier.
	canGrantWith(wish: string): VideoColorSpaceInit;

	grantWish(wish: string) {
			// Error
			// An implementation cannot be declared in ambient contexts.
		return true;
	}
}
```

```ts
// index.ts

declare const myGlobalValue: string;

console.log(myGlobalValue);
```

```ts
// index.d.ts

interface Writer {}
declare interface Writer {}

declare const fullName: string;
declare const firstName: "Liz";

const lastName = "Lemon";
	// Error
	// Top-level declarations in .d.ts files must start with either
	// a 'declare' or 'export' modifier.
```

### 11.2.1 전역 변수

```ts
// global.d.ts

declare const version: string;
```

```ts
// version.ts

export function logVersion() {
	console.log(`version: ${version}`);
}
```

### 11.2.2 전역 인터페이스 병합

```html
<script type="text/javascript">
window.myVersion = "3.1.1";
</script>
```

```ts
// types/window.d.ts

interface Window {
	myVersion: string;
}
```

```ts
// index.ts

export function logWindowVersion() {
	console.log(`Window version: ${window.myVersion}`);
	window.alert("Built-in window types still work! Hoooray!");
}
```

### 11.2.3 전역 확장

```ts
// types/data.d.ts

export interface Data {
	version: string;
}
```

```ts
// types/globals.d.ts

import { Data } from "./data";

declare global {
	const globallyDeclared: Data;
}

declare const locallyDeclared: Data;
```

```ts
// index.ts

import { Data } from "./types/data";

function logData(data: Data) {
	console.log(`Data version is: ${data.version}`);
}

logData(globallyDeclared);

logData(locallyDeclared);
	// Error
	// Cannot find name 'locallyDeclared'.
```

## 11.3 내장된 선언

### 11.3.1 라이브러리 선언

### 11.3.2 DOM 선언

## 11.4 모듈 선언

```ts
// modules.d.ts

declare module "my-example-lib" {
	export const value: string;
}
```

```ts
// index.ts

import { value } from "my-example-lib";

console.log(value);
```

### 11.4.1 와일드카드 모듈 선언

```ts
// styles.d.ts

declare module "*.module.css" {
	const styles: { [i: string]: string };
	export default styles;
}
```

```ts
// component.ts

import styles from "./styles.module.css";

styles.anyClassName;
```

## 11.5 패키지 타입

### 11.5.1 선언

```ts
// index.ts

export const greet = (text: string) => {
	console.log(`Hello, ${text}!`);
};
```

```ts
// index.d.ts

export declare const greet: (text: string) => void;
```

```ts
// index.js

export const greet = (text) => {
	console.log(`Hello, ${text}!`);
};
```

### 11.5.2 패키지 타입 의존성

### 11.5.3 패키지 타입 노출

## 11.6 DefinitelyTyped

### 11.6.1 타입 사용 가능성
