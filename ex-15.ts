
////////////////////////////////////////////////////////////////////////////////
// 15. 타입 운영

////////////////////////////////////////////////////////////
// 15.1 매핑된 타입

{
	type Animals = "alligator" | "baboon" | "cat";

	type AnimalCounts = {
		[K in Animals]: number;
	};
		// type AnimalCounts = {
		//     alligator: number;
		//     baboon: number;
		//     cat: number;
		// }
}

////////////////////////////////////////
// 15.1.1 타입에서 매핑된 타이핑

{
	interface AnimalVariants {
		alligator: boolean;
		baboon: number;
		cat: string;
	}

	type AnimalCounts = {
		[K in keyof AnimalVariants]: number;
	};
		// type AnimalCounts = {
		//     alligator: number;
		//     baboon: number;
		//     cat: number;
		// }
}

{
	interface BirdVariants {
		dove: string;
		eagle: boolean;
	}

	type NullableBirdVariants = {
		[K in keyof BirdVariants]: BirdVariants[K] | null;
	};
		// type NullableBirdVariants = {
		//     dove: string | null;
		//     eagle: boolean | null;
		// }
}

//////////////////////////////
// 매핑된 타입과 시그니처

{
	interface Researcher {
		researchMethod(): void;
		researchProperty: () => string;
	}

	type JustPropertis<T> = {
		[K in keyof T]: T[K];
	};

	type ResearcherProperties = JustPropertis<Researcher>;
		// type ResearcherProperties = {
		//     researchMethod: () => void;
		//     researchProperty: () => string;
		// }
}

////////////////////////////////////////
// 15.1.2 제한자 변경

{
	interface Environmentalist {
		area: string;
		name: string;
	}

	type ReadOnlyEnvironmentalist = {
		readonly [K in keyof Environmentalist]: Environmentalist[K];
	};
		// type ReadOnlyEnvironmentalist = {
		//     readonly area: string;
		//     readonly name: string;
		// }

	type OptionalReadOnlyEnvironmentalist = {
		//readonly [K in keyof Environmentalist]?: Environmentalist[K];
		[K in keyof ReadOnlyEnvironmentalist]?: ReadOnlyEnvironmentalist[K];
	};
		// type OptionalReadOnlyEnvironmentalist = {
		//     readonly area?: string | undefined;
		//     readonly name?: string | undefined;
		// }
}

{
	interface Conservationist {
		name: string;
		catchphrase?: string;
		readonly born: number;
		readonly died?: number;
	}

	type WritableConservationist = {
		-readonly [K in keyof Conservationist]: Conservationist[K];
	};
		// type WritableConservationist = {
		//     name: string;
		//     catchphrase?: string | undefined;
		//     born: number;
		//     died?: number | undefined;
		// }

	type RequiredWritableConservationist = {
		//-readonly [K in keyof Conservationist]-?: Conservationist[K];
		[K in keyof WritableConservationist]-?: WritableConservationist[K]
	};
		// type RequiredWritableConservationist = {
		//     name: string;
		//     catchphrase: string;
		//     born: number;
		//     died: number;
		// }
}

////////////////////////////////////////
// 15.1.3 제네릭 매핑된 타입

{
	type MakeReadonly<T> = {
		readonly [K in keyof T]: T[K];
	};

	interface Species {
		henus: string;
		name: string;
	}

	type ReadonlySpecies = MakeReadonly<Species>;
		// type ReadonlySpecies = {
		//     readonly henus: string;
		//     readonly name: string;
		// }
}

{
	type MakeOptional<T> = {
		[K in keyof T]?: T[K];
	};

	interface GenusData {
		family: string;
		name: string;
	}

	function createGenusData(overrides?: MakeOptional<GenusData>): GenusData {
		return {
			family: 'unknown',
			name: 'unknown',
			...overrides,
		};
	}

	console.log(createGenusData({}));
	console.log(createGenusData({family:'qaz'}));
	console.log(createGenusData({name:'wsx'}));
	console.log(createGenusData({family:'qaz',name:'wsx'}));
}

////////////////////////////////////////////////////////////
// 15.2 조건부 타입

////////////////////////////////////////
// 15.2.1 제네릭 조건부 타입

{
	type CheckAgainstNumber<T> = T extends number ? true : false;

	type CheckString = CheckAgainstNumber<'rapakeet'>; // false
	type CheckNumber = CheckAgainstNumber<1891>; // true
}

{
	type CallableSetting<T> = T extends () => any ? T : () => T;

	type GetNumbersSetting = CallableSetting<() => number[]>; // () => number[]
	type StringSetting = CallableSetting<string>; // () => string
}

{
	interface QueryOptions {
		throwIfNotFound: boolean;
	}

	type QueryResult<Options extends QueryOptions> =
		Options["throwIfNotFound"] extends true ? string : string | undefined;

	/*
	declare function retrieve<Options extends QueryOptions>(
		key: string,
		options?: Options,
	): Promise<QueryResult<Options>>;

	await retrieve("Birutė Gaidikas"); // string | undefined
	await retrieve("Jane Goodall", { throwIfNotFound: Math.random() > 0.5 }); // string | undefined
	await retrieve("Dian Fossey", { throwIfNotFound: true }); // string
	*/
}

////////////////////////////////////////
// 15.2.2 타입 분산

{
	type ArrayifyUnlessString<T> = T extends string ? T : T[];

	type HalfArrayified = ArrayifyUnlessString<string | number>; // string | number[]
}

////////////////////////////////////////
// 15.2.3 유추된 타입

{
	type ArrayItems<T> = T extends (infer Item)[] ? Item : T;

	type StringItem = ArrayItems<string>; // string
	type StringArrayItem = ArrayItems<string[]>; // string
	type String2DItem = ArrayItems<string[][]>; // string[]
}

{
	type ArrayItemsRecursive<T> =
		T extends (infer Item)[]
			? ArrayItemsRecursive<Item>
			: T;
	
	type StringItem = ArrayItemsRecursive<string>; // string
	type StringArrayItem = ArrayItemsRecursive<string[]>; // string
	type String2DItem = ArrayItemsRecursive<string[][]>; // string
}

////////////////////////////////////////
// 15.2.4 매핑된 조건부 타입

{
	type MakeAllMembersFunctions<T> = {
		[K in keyof T]: T[K] extends (...args: any[]) => any
			? T[K]
			: () => T[K]
	};

	type MemberFunctions = MakeAllMembersFunctions<{
		alreadyFunction: () => string,
		notYetFunction: number,
	}>;
		// type MemberFunctions = {
		//     alreadyFunction: () => string;
		//     notYetFunction: () => number;
		// }
}

////////////////////////////////////////////////////////////
// 15.3 never

////////////////////////////////////////
// 15.3.1 never와 교차, 유니언 타입

{
	type NeverIntersection = never & string; // never
	type NeverUnion = never | string; // string
}

////////////////////////////////////////
// 15.3.2 never와 조건부 타입

{
	type OnlyStrings<T> = T extends string ? T : never;

	type RedOrBlue = OnlyStrings<"red" | "blue" | 0 | false>; // "red" | "blue"
}

{
	type FirstParameter<T extends (...args: any[]) => any> =
		T extends (arg: infer Arg) => any ? Arg : never;
	
	type GetsString = FirstParameter<(arg0: string) => void>; // string
}

////////////////////////////////////////
// 15.3.3 never와 매핑된 타입

{
	type OnlyStringProperties<T> = {
		[K in keyof T]: T[K] extends string ? K : never;
	}[keyof T];

	interface AllEventData {
		participants: string[];
		location: string;
		name: string;
		year: number;
	}

	type OnlyStringEventData = OnlyStringProperties<AllEventData>; // "location" | "name"
}

////////////////////////////////////////////////////////////
// 15.4 템플릿 리터럴 타입

{
	type Greeting = `Hello${string}`;

	let matches: Greeting = "Hello, world!";
	let outOfOrder: Greeting = "World! Hello!";
		// Error
		// Type '"World! Hello!"' is not assignable to type '`Hello${string}`'.
	let missingAlltogether: Greeting = "hi";
		// Error
		// Type '"hi"' is not assignable to type '`Hello${string}`'.
}

{
	type Brightness = "dark" | "light";
	type Color = "blue" | "red";

	type BrightnessAndColor = `${Brightness}-${Color}`;
		// "dark-blue" | "dark-red" | "light-blue" | "light-red"

	let colorOk: BrightnessAndColor = "dark-blue";
	let colorWrongStart: BrightnessAndColor = "medium-blue";
		// Error
		// Type '"medium-blue"' is not assignable to
		// type '"dark-blue" | "dark-red" | "light-blue" | "light-red"'.
	let colorWrongEnd: BrightnessAndColor = "light-green";
		// Error
		// Type '"light-green"' is not assignable to type
		// '"dark-blue" | "dark-red" | "light-blue" | "light-red"'.
}

{
	type ExtolNumber = `much ${number} wow`;

	function extol(extolee: ExtolNumber) { /* ... */ }

	extol('much 0 wow');
	extol('much -7 wow');
	extol('much 9.001 wow');
	extol('much false wow');
		// Error
		// Argument of type '"much false wow"' is not assignable
		// to parameter of type '`much ${number} wow`'.
}

////////////////////////////////////////
// 15.4.1 고유 문자열 조작 타입

// Uppercase, Lowercase, Capitalize, Uncapitalize

{
	type FormalGreeting = Capitalize<"hello.">; // "Hello."
}

////////////////////////////////////////
// 15.4.2 템플릿 리터럴 키

{
	type DataKey = "location" | "name" | "year";

	type ExistenceChecks = {
		[K in `check${Capitalize<DataKey>}`]: () => boolean;
	};
		// type ExistenceChecks = {
		//     checkName: () => boolean;
		//     checkLocation: () => boolean;
		//     checkYear: () => boolean;
		// }

	function checkExistence(checks: ExistenceChecks) {
		checks.checkLocation();
		checks.checkName();
		checks.checkWrong();
			// Error
			// Property 'checkWrong' does not exist on type 'ExistenceChecks'.
	}
}

////////////////////////////////////////
// 15.4.3 매핑된 타입 키 다시 매핑하기

{
	interface DataEntry<T> {
		key: T;
		value: string;
	}

	type DataKey = "location" | "name" | "year";

	type DataEntryGetters = {
		[K in DataKey as `get${Capitalize<K>}`]: () => DataEntry<K>;
	};
		// type DataEntryGetters = {
		//     getLocation: () => DataEntry<"location">;
		//     getName: () => DataEntry<"name">;
		//     getYear: () => DataEntry<"year">;
		// }
}

{
	const config = {
		location: "unknown",
		name: "anonymous",
		year: 0,
	};

	type LazyValues = {
		[K in keyof typeof config as `${K}Lazy`]: () => Promise<typeof config[K]>;
	};
		// type LazyValues = {
		//     locationLazy: () => Promise<string>;
		//     nameLazy: () => Promise<string>;
		//     yearLazy: () => Promise<number>;
		// }

	async function withLazyValues(configGetter: LazyValues) {
		await configGetter.locationLazy;
		await configGetter.missingLazy();
			// Error
			// Property 'missingLazy' does not exist on type 'LazyValues'.
	}
}

{
	type TurnIntoGettersDirect<T> = {
		[K in keyof T as `get${K}`]: () => T[K];
			// Error
			// Type 'K' is not assignable to type
			// 'string | number | bigint | boolean | null | undefined'.
			//   Type 'keyof T' is not assignable to type
			//   'string | number | bigint | boolean | null | undefined'.
			//     Type 'string | number | symbol' is not assignable to type
			//     'string | number | bigint | boolean | null | undefined'.
			//       Type 'symbol' is not assignable to type
			//       'string | number | bigint | boolean | null | undefined'.
	}
}

{
	const someSymbol = Symbol("");

	interface HasStringAndSymbol {
		StringKey: string;
		[someSymbol]: number;
	}

	type TurnIntoGetters<T> = {
		[K in keyof T as `get${string & K}`]: () => T[K];
	};

	type GettersJustString = TurnIntoGetters<HasStringAndSymbol>;
		// {
		//     getStringKey: () => string;
		// }
}

////////////////////////////////////////////////////////////
// 15.5 타입 운영과 복잡성

//:wq