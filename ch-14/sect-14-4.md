
## 14.4 네임스페이스

### 14.4.1 네임스페이스 내보내기

```ts
// settings/constants.ts

namespace Settings {
	export const name = "My Application";
	export const version = "1.2.3";
}
```

```ts
// settings/describe.ts

namespace Settings {
	export function describe() {
		return `${Settings.name} at version ${Settings.version}`;
		console.log("Initializing", describe());
	}
}
```

```ts
// index.ts

console.log("Initialized", Settings.describe());
```

### 14.4.2 중첩된 네임스페이스

### 14.4.3 타입 정의에서 네임스페이스

```ts
// node_modules/@types/my-example-lib/index.d.ts

export const value: number;
export as namespace libExample;
```

```ts
// src/index.ts

import * as libExample from "my-example-lib";
const value = window.libExample.value;
```

### 14.4.4 네임스페이스보다 모듈을 선호

```ts
// settings/constants.ts

export const name = "My Application";
export const version = "1.2.3";
```

```ts
// settings/describe.ts

import { name, version } from "./constants";

export function describe() {
	return `${Settings.name} at version ${Settings.version}`;
}

console.log("Initializing", describe());
```

```ts
// index.ts

import { describe } from "./settings/describe";

console.log("Initialized", describe());
```

```sh
$ tsc --init

$ tsc -b

$ node index.js
Initializing My Application at version 1.2.3
Initialized My Application at version 1.2.3
```

:wq