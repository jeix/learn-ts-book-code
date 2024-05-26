
////////////////////////////////////////////////////////////////////////////////
// 10. 제네릭

////////////////////////////////////////////////////////////
// 10.1 제네릭 함수

{
	function identity<T>(input: T) {
		return input;
	}

	const numeric = identity(123); // const numeric: 123
	const stringy = identity("me"); // const stringy: "me"
}

{
	const identity = <T>(input: T) => input;

	const numeric = identity(123); // const numeric: 123
	const stringy = identity("me"); // const stringy: "me"
}

////////////////////////////////////////
// 10.1.1 명시적 제네릭 호출 타입

{
	function logWrapper<T>(callback: (input: T) => void) {
		return (input: T) => {
			console.log("input:", input);
			callback(input);
		}
	}

	// 매개변수 타입 명시

	logWrapper((input: string) => {
		console.log(input.length);
	})("zzz");
		// function logWrapper<string>(callback: (input: string) => void): (input: string) => void

	logWrapper((input) => { // (parameter) input: unknown
		console.log(input.length);
			// Error
			// 'input' is of type 'unknown'.
	})("xxx");
		// function logWrapper<unknown>(callback: (input: unknown) => void): (input: unknown) => void
	
	// 타입 인수 명시

	logWrapper<string>((input) => {
		console.log(input.length);
	})("ccc");
		// function logWrapper<string>(callback: (input: string) => void): (input: string) => void
	
	// 타입 인수 명시 + 매개변수 타입 명시 -- 불일치

	logWrapper<string>((input: boolean) => {
		// Error
		// Argument of type '(input: boolean) => void' is not assignable to
		// parameter of type '(input: string) => void'.
		//   Types of parameters 'input' and 'input' are incompatible.
		//     Type 'string' is not assignable to type 'boolean'.
	});

	// 타입 인수 명시 + 매개변수 타입 명시 -- 일치 -- 하나만 있어도

	logWrapper<string>((input: string) => {
		console.log(input.length);
	})("vvv");
		// function logWrapper<string>(callback: (input: string) => void): (input: string) => void
}

////////////////////////////////////////
// 10.1.2 다중 함수 타입 매개변수

{
	function makeTuple<T1, T2>(first: T1, second: T2) {
		return [first, second] as const;
	}

	let tuple = makeTuple(true, "abc"); // let tuple: readonly [boolean, string]
}

{
	function makePair<K, V>(key: K, value: V) {
		return { key, value };
	}

	makePair("abc", 123); // { key: string; value: number; }

	makePair<string, number>("abc", 123); // { key: string; value: number; }
	makePair<"abc", 123>("abc", 123); // { key: "abc"; value: 123; }

	makePair<string>("abc", 123);
		// Error
		// Expected 2 type arguments, but got 1.
}

////////////////////////////////////////////////////////////
// 10.2 제네릭 인터페이스

{
	interface Box<T> {
		inside: T;
	}

	let stringBox: Box<string> = {
		inside: "abc",
	};
	let numberBox: Box<number> = {
		inside: 123,
	};
}

{
	/*
	interface Array<T> {
		...

		pop(): T | undefined;
		push(...items: T[]): number;

		...
	}
	*/
}

////////////////////////////////////////
// 10.2.1 유추된 제네릭 인터페이스 타입

{
	interface LinkedNode<V> {
		next?: LinkedNode<V>;
		value: V;
	}

	function getLast<V>(node: LinkedNode<V>): V {
		return node.next ? getLast(node.next) : node.value;
	}

	let lastDate = getLast({
		value: new Date("1993-09-13"),
	});

	let lastFruit = getLast({
		next: {
			value: "banana",
		},
		value: "apple",
	});

	let lastMismatch = getLast({
		next: {
			value: 123,
		},
		value: false,
			// Error
			// Type 'boolean' is not assignable to type 'number'.
	});
}

{
	interface CrateLike<T> {
		contents: T;
	}

	let missingGeneric: CrateLike = {
			// Error
			// Generic type 'CrateLike<T>' requires 1 type argument(s).
		inside: "??"
	};
}

////////////////////////////////////////////////////////////
// 10.3 제네릭 클래스

{
	class Secret<K, V> {
		key: K;
		value: V;

		constructor(key: K, value: V) {
			this.key = key;
			this.value = value;
		}

		getValue(key: K): V | undefined {
			return this.key === key ? this.value : undefined;
		}
	}

	const storage = new Secret(12345, "luggage"); // const storage: Secret<number, string>

	storage.getValue(1987); // string | undefined
}

////////////////////////////////////////
// 10.3.1 명시적 제네릭 클래스 타입

{
	class CurriedCallback<T> {
		#callback: (input: T) => void;

		constructor(callback: (input: T) => void) {
			this.#callback = (input: T) => {
				console.log("input:", input);
				callback(input);
			};
		}

		call(input: T) {
			this.#callback(input);
		}
	}

	// CurriedCallback<string>
	new CurriedCallback((input: string) => {
		console.log(input.length);
	}).call('zzz');

	// CurriedCallback<unknown>
	new CurriedCallback((input) => {
		console.log(input.length);
	}).call('xxx');

	// CurriedCallback<string>
	new CurriedCallback<string>((input) => {
		console.log(input.length);
	}).call('ccc');

	new CurriedCallback<string>((input: boolean) => {
		// Error
		// Argument of type '(input: boolean) => void' is not assignable to
		// parameter of type '(input: string) => void'.
		//   Types of parameters 'input' and 'input' are incompatible.
		//     Type 'string' is not assignable to type 'boolean'
	});
}

////////////////////////////////////////
// 10.3.2 제네릭 클래스 확장

{
	class Quote<T> {
		lines: T;

		constructor(lines: T) {
			this.lines = lines;
		}
	}

	class SpokenQuote extends Quote<string[]> {
		speak() {
			console.log(this.lines.join("\n"));
		}
	}

	new Quote("The only real failure is the failure to try.").lines; // string
	new Quote([4, 8, 15, 16, 23, 42]).lines; // number[]

	new SpokenQuote([
		"Greed is so destructive.",
		"It destroys everything.",
	]).lines; // string[]
	new SpokenQuote([4, 8, 15, 16, 23, 42]);
		// Error
		// Type 'number' is not assignable to type 'string'.
	
	class AttributedQuote<V> extends Quote<V> {
		speaker: string;

		constructor(value: V, speaker: string) {
			super(value);
			this.speaker = speaker;
		}
	}

	new AttributedQuote(
		"The road to success is always under construction.",
		"Lily Tomlin",
	); // AttributedQuote<string>
}

////////////////////////////////////////
// 10.3.3 제네릭 인터페이스 구현

{
	interface ActingCredit<Role> {
		role: Role;
	}

	class MoviePart implements ActingCredit<string> {
		role: string;
		speaking: boolean;

		constructor(role: string, speaking: boolean) {
			this.role = role;
			this.speaking = speaking;
		}
	}

	const part = new MoviePart("Miranda Priestly", true);
	part.role; // string

	class IncorrectExtension implements ActingCredit<string> {
		role: boolean;
			// Error
			// Property 'role' in type 'IncorrectExtension' is not assignable to
			// the same property in base type 'ActingCredit<string>'.
			//   Type 'boolean' is not assignable to type 'string'.
	}
}

////////////////////////////////////////
// 10.3.4 메서드 제네릭

{
	class CreatePairFactory<K> {
		key: K;

		constructor(key: K) {
			this.key = key;
		}

		createPair<V>(value: V) {
			return { key: this.key, value };
		}
	}

	const factory = new CreatePairFactory("role"); // CreatePairFactory<string>
	
	const numberPair = factory.createPair(10); // { key: string; value: number; }
	const stringPair = factory.createPair("Sophie"); // { key: string; value: string; }
}

////////////////////////////////////////
// 10.3.5 정적 클래스 제네릭

{
	class BothLogger<OnInstance> {
		instanceLog(value: OnInstance) {
			console.log(value);
			return value;
		}

		static staticLog<OnStatic>(value: OnStatic) {
			let fromInstance: OnInstance;
				// Error
				// Static members cannot reference class type parameters.

			console.log(value);
			return value;
		}
	}

	const logger = new BothLogger<number[]>;
	let x = logger.instanceLog([1, 2, 3]); // number[]

	BothLogger.staticLog([false, true]); // boolean[]

	BothLogger.staticLog<string>("You can't change the music of your soul."); // string
}

////////////////////////////////////////////////////////////
// 10.4 제네릭 타입 별칭

{
	type Nullish<T> = T | null | undefined;
}

{
	type CreatesValue<Input, Output> = (input: Input) => Output;

	let creator: CreatesValue<string, number>;
	creator = text => text.length;
}

////////////////////////////////////////
// 10.4.1 제네릭 판별된 유니언

{
	type Result<Data> = FailureResult | SuccessfulResult<Data>;

	interface FailureResult {
		error: Error;
		succeeded: false;
	}

	interface SuccessfulResult<Data> {
		data: Data;
		succeeded: true;
	}

	function handleResult(result: Result<string>) {
		if (result.succeeded) {
			// (parameter) result: SuccessfulResult<string>
			console.log(`We did it! ${result.data}`);
		} else {
			// (parameter) result: FailureResult
			console.error(`Awww... ${result.error}`);
		}

		result.data;
			// Error
			// Property 'data' does not exist on type 'Result<string>'.
			//   Property 'data' does not exist on type 'FailureResult'.
	}
}

////////////////////////////////////////////////////////////
// 10.5 제네릭 제한자

////////////////////////////////////////
// 10.5.1 제네릭 디폴트

{
	interface Quote<T = string> {
		value: T;
	}

	let explicit: Quote<number> = { value: 123 };

	let implicit: Quote = { value: "Be yourself. The world worships the original." };

	let mismatch: Quote = { value: 123 };
		// Error
		// Type 'number' is not assignable to type 'string'.
}

{
	interface KeyValuePair<K, V = K> {
		key: K;
		value: V;
	}

	let allExplicit: KeyValuePair<string, number> = {
		key: "rating",
		value: 10,
	};

	let oneDefaulting: KeyValuePair<string> = {
		key: "rating",
		value: "ten";
	};

	let firstMissing: KeyValuePair = {
			// Error
			// Generic type 'KeyValuePair<K, V>' requires
			// between 1 and 2 type arguments.
		key: "rating",
		value: 10,
	}
}

{
	function inTheEnd<T, U, V = number, W = string>() { }

	function inTheMiddle<T, U = boolean, V = number, W>() { }
		// Error
		// Required type parameters may not follow optional type parameters.
}

////////////////////////////////////////////////////////////
// 10.6 제한된 제네릭 타입

{
	interface WithLength {
		length: number;
	}

	function logWithLength<T extends WithLength>(input: T) {
		console.log(`length: ${input.length}`);
		return input;
	}

	logWithLength("No one can figure out your worth but you."); // string
	logWithLength([false, true]); // boolean[]
	logWithLength({ length: 123 }); // { length: number; }

	logWithLength(new Date());
		// Error
		// Argument of type 'Date' is not assignable to parameter of type 'WithLength'.
		//   Property 'length' is missing in type 'Date' but required in type 'WithLength'.
}

////////////////////////////////////////
// 10.6.1 keyof와 제한된 타입 매개변수

{
	function get<T, K extends keyof T>(container: T, key: K) {
		return container[key];
	}

	const roles = {
		favorite: "Fargo",
		others: ["Almost Famous", "Burn After Reading", "Nomadland"],
	};

	const favorite = get(roles, "favorite"); // string
	const others = get(roles, "others"); // string[]
	const missing = get(roles, "extras");
		// Error
		// Argument of type '"extras"' is not assignable to
		// parameter of type '"favorite" | "others"'.
}

{
	function get<T>(container: T, key: keyof T) {
		return container[key];
	}

	const roles = {
		favorite: "Fargo",
		others: ["Almost Famous", "Burn After Reading", "Nomadland"],
	};

	const found = get(roles, "favorite"); // string | string[]
}

////////////////////////////////////////////////////////////
// 10.7 Promise

////////////////////////////////////////
// 10.7.1 Promise 생성

{
	/*
	class PromiseLike<V> {
		constructor(
			executor: (
				resolve: (value: V) => void,
				reject: (reason: unknown) => void,
			) => void,
		) {
			...
		}
	}
	*/
}

{
	const resolvesUnlnown = new Promise((resolve) => {
		setTimeout(() => resolve("Done!"), 1000);
	});
		// Promise<unknown>

	const resolveString = new Promise<string>((resolve) => {
		setTimeout(() => resolve("Done!"), 1000);
	});
		// Promise<string>
}

{
	const textEventually = new Promise<string>((resolve) => {
		setTimeout(() => resolve("Done!"), 1000);
	});
		// Promise<string>

	const lengthEventually = textEventually.then((text) => text.length);
		// Promise<number>
}

////////////////////////////////////////
// 10.7.2 async 함수

{
	async function lengthAfterSecond(text: string) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return text.length;
	}
		// function lengthAfterSecond(text: string): Promise<number>

	async function lengthImmediately(text: string) {
		return text.length;
	}
		// function lengthImmediately(text: string): Promise<number>

	async function givesPromiseForString(): Promise<string> {
		return "Done"!;
	}
		// function givesPromiseForString(): Promise<string>

	async function givesString(): string { }
		// Error
		// The return type of an async function or method must be
		// the global Promise<T> type.
}

////////////////////////////////////////////////////////////
// 10.8 제네릭 올바르게 사용하기

////////////////////////////////////////
// 10.8.1 제네릭 황금률

{
	function logInputOverly<Input extends string>(input: Input) {
		console.log("Hi!", input);
	}

	function logInput(input: string) {
		console.log("Hi!", input);
	}
}

////////////////////////////////////////
// 10.8.2 제네릭 명명 규칙

{
	function labelBoxVague<L, V>(l: L, v: V) { }

	function labelBox<Label, Value>(label: Label, value: Value) { }
}

//:wq