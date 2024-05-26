
```ts
// types.d.ts

declare let declared: string;

declare let initializer: string = "Wanda";
	// Error
	// <pre>Initializers are not allowed in ambient contexts.</pre>
```

```ts
// fairies.d.ts

declare function canGrantWith(wish: string): boolean;

declare function grantWish(wish: string) { return true; }

class Fairy {
	canGrantWith(wish: string): VideoColorSpaceInit;

	grantWish(wish: string) {
		return true;
	}
}
```
