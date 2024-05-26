
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

```sh
$ tsc index.ts 
```
