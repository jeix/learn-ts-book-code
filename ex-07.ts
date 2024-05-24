
////////////////////////////////////////////////////////////////////////////////
// 7. 인터페이스

////////////////////////////////////////////////////////////
// 7.1 타입 별칭 vs. 인터페이스

////////////////////////////////////////////////////////////
// 7.2 속성 타입

////////////////////////////////////////
// 7.2.1 선택적 속성

{
	interface Book {
		author?: string;
		pages: number;
	}

	const ok: Book = {
		author: "Rita Dove",
		pages: 80,
	};

	const missing: Book = {
		pages: 80
	};
}

////////////////////////////////////////
// 7.2.2 읽기 전용 속성

{
	interface Page {
		readonly text: string;
	}

	function read(page: Page) {
		console.log(page.text);
		page.text += "!";
			// Error
			// Cannot assign to 'text' because it is a read-only property.
	}

	const pageIsh = {
		text: "Hello, world!",
	};

	pageIsh.text += "!"; // ok: pageIsh is not a Page but inferred object

	read(pageIsh); // ok
}

////////////////////////////////////////
// 7.2.3 함수와 메서드

{
	interface HasBothFunctionTypes {
		property: () => string;
		method(): string;
	}

	const hasBoth: HasBothFunctionTypes = {
		property: () => "",
		method() {
			return "";
		}
	};

	hasBoth.property();
	hasBoth.method();
}

{
	interface OptionalFunctions {
		optionalProperty?: () => string;
		optionalMethod?(): string;
	}
}

////////////////////////////////////////
// 7.2.4 호출 시그니처

{
	type FunctionAlias = (input: string) => number;

	interface CallSignature {
		(input: string): number;
	}

	const typedFunctionAlias: FunctionAlias = (input) => input.length;

	const typedCallSignature: CallSignature = (input) => input.length;
}

{
	interface FunctionWithCount {
		count: number;
		(): void;
	}

	let hasCallCount: FunctionWithCount;

	function keepsTrackOfCalls() {
		keepsTrackOfCalls.count += 1;
		console.log(`I've been called ${keepsTrackOfCalls.count} times!`);
	}
	keepsTrackOfCalls.count = 0;

	hasCallCount = keepsTrackOfCalls;
}

////////////////////////////////////////
// 7.2.5 인덱스 시그니처

{
	interface DatesByName {
		[i: string]: Date;
	}

	const publishDates: DatesByName = {
		Frankenstein: new Date("1818, 1, 1"),
	};

	publishDates.Frankenstein.toString();

	publishDates.Beloved.toString();
		// Runtime Error
}

// 속성과 인덱스 시그니처 결합

{
	interface Status {
		begin: number;
		step: 0 | 1 | 2;
		[i: string]: number;
	}

	const progressA: Status = {
		begin: 30,
		step: 3,
			// Error
			// Type '3' is not assignable to type '0 | 1 | 2'.
		retry: 2,
	};
}

// 숫자 인덱스 시그니처

{
	interface MoreNarrowNumbers {
		[i: number]: string;
		[i: string]: string | undefined;
	}

	const mixesNumbersAndStrings: MoreNarrowNumbers = {
		0: '',
		key1: '',
		key2: undefined,
	};

	interface MoreNarrowStrings {
		[i: number]: string | undefined;
			// Error
			// 'number' index type 'string | undefined' is not
			// assignable to 'string' index type 'string'.
		[i: string]: string;
	}
}

////////////////////////////////////////
// 7.2.6 중첩 인터페이스

{
	interface Novel {
		author: {
			name: string;
		};
		setting: Setting;
	}
	interface Setting {
		place: string;
		year: number;
	}

	let myNovel: Novel;
	myNovel = {
		author: {
			name: 'Jane Austen',
		},
		setting: {
			place: 'England',
			year: 1812,
		},
	};
}

////////////////////////////////////////////////////////////
// 7.3 인터페이스 확장

{
	interface Writing {
		title: string;
	}
	interface Novella extends Writing {
		pages: number;
	}

	let myNovella: Novella = {
		pages: 195,
		title: "Ethan Frome",
	};

	let missingPages: Novella = {
			// Error
			// Property 'pages' is missing in type '{ title: string; }'
			// but required in type 'Novella'.
		title: "The Awakening",
	};

	let extraProperty: Novella = {
		pages: 300,
		strategy: "baseline",
			// Error
			// Object literal may only specify known properties,
			// and 'strategy' does not exist in type 'Novella'.
		style: "Naturalism",
	};

	let x = {
		pages: 300,
		strategy: "baseline",
		style: "Naturalism",
	};
	extraProperty = x;
		// Error
		// Property 'title' is missing
		// in type '{ pages: number; strategy: string; style: string; }'
		// but required in type 'Novella'.

	let y = {
		pages: 300,
		strategy: "baseline",
		style: "Naturalism",
		title: "Unknown",
	};
	extraProperty = y;
}

////////////////////////////////////////
// 7.3.1 재정의된 속성

{
	interface WithNullableName {
		name: string | null;
	}

	interface WithNonNullableName extends WithNullableName {
		name: string;
	}

	interface WithNumericName extends WithNullableName {
			// Error
			// Interface 'WithNumericName' incorrectly extends interface 'WithNullableName'.
			//   Types of property 'name' are incompatible.
			//     Type 'string | number' is not assignable to type 'string | null'.
			//       Type 'number' is not assignable to type 'string'.
		name: number | string;
	}
}

////////////////////////////////////////
// 7.3.2 다중 인터페이스 확장

{
	interface GivesNumber {
		giveNumber(): number;
	}
	interface GivesString {
		giveString(): string;
	}
	interface GivesBothAndEither extends GivesNumber, GivesString {
		giveEither(): number | string;
	}

	function useGivesBoth(instance: GivesBothAndEither) {
		instance.giveEither();
		instance.giveNumber();
		instance.giveString();
	}
}

////////////////////////////////////////////////////////////
// 7.4 인터페이스 병합

{
	interface Merged {
		fromFirst: string;
	}

	interface Merged {
		fromSecond: number;
	}

	const merged: Merged = {
			// Error
			// Property 'fromSecond' is missing in type '{ fromFirst: string; }'
			// but required in type 'Merged'.
		fromFirst: 'qaz',
		//fromSecond: 42,
	};
}

////////////////////////////////////////
// 7.4.1 멤버 이름 충돌

{
	interface MergedProperties {
		same: (input: boolean) => string;
		different: (input: string) => string;
	}

	interface MergedProperties {
		same: (input: boolean) => string;
		different: (input: number) => string;
			// Error
			// Subsequent property declarations must have the same type.
			// Property 'different' must be of type '(input: string) => string',
			// but here has type '(input: number) => string'.
	}
}

{
	interface MergedMethods {
		different(input: string): string;
	}

	interface MergedMethods {
		different(input: number): string; // overload
	}
}

//:wq