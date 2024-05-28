
## 14.5 타입 전용 가져오기와 내보내기

```ts
// index.ts

const action = { area: "people", name: "Bella Abzug", role: "politician" };

type ActivistArea = "nature" | "people";

export { action, ActivistArea };
```

```ts
// index.js

const action = { area: "people", name: "Bella Abzug", role: "politician" };

export { action };
```

```ts
// index.ts

import { type TypeOne, value } from "my-example-types";
import type { TypeTwo } from "my-example-types";
import type DefaultType from "my-example-types";

export { type TypeOne, value };
export type { DefaultType, TypeTwo };
```

```ts
// index.js

import { value } from "my-example-types";

export { value };
```

:wq