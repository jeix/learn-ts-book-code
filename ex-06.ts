
////////////////////////////////////////////////////////////////////////////////
// 6. 배열

////////////////////////////////////////////////////////////
// 6.1 배열 타입

////////////////////////////////////////
// 6.1.1 배열과 함수 타이핑

{
	let createStrings: () => string[];

	let stringCreators: (() => string)[];
}

////////////////////////////////////////
// 6.1.2 유니언 타입 배열

{
	let stringOrArrayOfNumbers: string | number[];

	let arrayOfStringOrNumbers: (string | number)[];
}

////////////////////////////////////////
// 6.1.3 any 배열의 진화

{
	// never[]
	let values = [];

	values.push('');
		// Error
		// Argument of type 'string' is not assignable to parameter of type 'never'.

	values[0] = 0;
		// Error
		// Type 'number' is not assignable to type 'never'.
}

////////////////////////////////////////
// 6.1.4 다차원 배열

{
	let arrayOfArraysOfNumbers: number[][];

	arrayOfArraysOfNumbers = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9],
	];
}

////////////////////////////////////////////////////////////
// 6.2 배열 멤버

{
	const soldiersOrDates = ["Deborah Sampson", new Date(1782, 6, 3)];
		// (string | Date)[]
	
	const soldierOrDate = soldiersOrDates[0];
		// string | Date
}

////////////////////////////////////////
// 6.2.1 주의 사항: 불안정한 멤버

{
	function withElements(elements: string[]) {
		console.log(elements[9001].length); // no error
	}

	withElements(["It's", "over"]);
}

////////////////////////////////////////////////////////////
// 6.3 스프레드와 나머지 매개변수

////////////////////////////////////////
// 6.3.1 스프레드

{
	const soldiers = ["Harriet Tubman", "Joan of Arc", "Khutulun"];
		// string[]

	const soldierAges = [90, 19, 45];
		// number[]

	const conjoined = [...soldiers, ...soldierAges];
		// (string | number)[]
}

////////////////////////////////////////
// 6.3.2 나머지 매개변수 스프레드

{
	function logWarrirors(greeting: string, ...names: string[]) {
		for (const name of names) {
			console.log(`${greeting}, ${name}!`);
		}
	}

	const warrirors = ["Cathay Willians", "Lozen", "Nzinga"];

	logWarrirors("Hello", ...warrirors);
}

////////////////////////////////////////////////////////////
// 6.4 튜플

{
	let yearAndWarrior: [number, string];

	yearAndWarrior = [530, "Tomyris"];
}

{
	let [year, warrior] = Math.random() > 0.5
		? [340, "Archidamia"]
		: [1828, "Rani of Jhansi"];
			// let year: number
			// let warrior: string
}

////////////////////////////////////////
// 6.4.1 튜플 할당 가능성

{
	const pairLoose = [false, 123];
		// (number | boolean)[]
	
	const pairTupleLoose: [boolean, number] = pairLoose;
		// Error
		// Type '(number | boolean)[]' is not assignable to type '[boolean, number]'.
		//   Target requires 2 element(s) but source may have fewer.
	
	const tupleThree: [boolean, number, string] = [false, 1583, "Nzinga"];

	const tupleTwoExact: [boolean, number] = [tupleThree[0], tupleThree[1]];

	const tupleTwoExtra: [boolean, number] = tupleThree;
		// Error
		// Type '[boolean, number, string]' is not assignable to type '[boolean, number]'.
		//   Source has 3 element(s) but target allows only 2.
}

//////////////////////////////
// 나머지 매개변수로서의 튜플

{
	function logPair(name: string, value: number) {
		console.log(`${name} has ${value}`);
	}

	const pairArray = ["Amage", 1];

	logPair(...pairArray);
		// Error
		// A spread argument must either have a tuple type or be passed to a rest parameter.

	const pairTupleIncorrect: [number, string] = [1, "Amage"];

	logPair(...pairTupleIncorrect);
	// Error
	// Argument of type 'number' is not assignable to parameter of type 'string'.

	const pairTupleCorrect: [string, number] = ["Amage", 1];

	logPair(...pairTupleCorrect);
}

{
	function logTrio(name: string, value: [number, boolean]) {
		console.log(`${name} has ${value[0]} (${value[1]})`);
	}

	const trios: [string, [number, boolean]][] = [
		["Amanitore", [1, true]],
		["Æthelflæd", [2, false]],
		["Ann E. Dunwoody", [3, false]],
	];

	trios.forEach(trio => logTrio(...trio));

	trios.forEach(logTrio);
		// Error
		// Argument of type '(name: string, value: [number, boolean]) => void'
		// is not assignable to parameter of type
		// '(value: [string, [number, boolean]], index: number, array: [string, [number, boolean]][]) => void'.
		//   Types of parameters 'name' and 'value' are incompatible.
		//     Type '[string, [number, boolean]]' is not assignable to type 'string'.
}

////////////////////////////////////////
// 6.4.2 튜플 추론

{
	function firstCharAndSize(input: string) {
		return [input[0], input.length];
	}
		// function firstCharAndSize(input: string): (string | number)[]

	const [firstChar, size] = firstCharAndSize("Gudit");
		// const firstChar: string | number
		// const size: string | number
}

//////////////////////////////
// 명시적 튜플 타입

{
	function firstCharAndSizeExplicit(input: string): [string, number] {
		return [input[0], input.length];
	}

	const [firstChar, size] = firstCharAndSizeExplicit("Cathay Williams");
		// const firstChar: string
		// const size: number
}

//////////////////////////////
// const 어서션

{
	const unionArray = [1157, "Tomoe"];
		// const unionArray: (string | number)[]
	
	const readonlyTuple = [1157, "Tomoe"] as const;
		// const readonlyTuple: readonly [1157, "Tomoe"]
}

{
	const pairMutable: [number, string] = [1157, "Tomoe"];
	pairMutable[0] = 1247;

	const pairAlsoMutable: [number, string] = [1157, "Tomoe"] as const;
	pairAlsoMutable[0] = 1247;

	const pairConst = [1157, "Tomoe"] as const;
	pairConst[0] = 1247;
		// Error
		// Cannot assign to '0' because it is a read-only property.
}

{
	function firstCharAndSizeAsConst(input: string) {
		return [input[0], input.length] as const;
	}
		// function firstCharAndSizeAsConst(input: string): readonly [string, number]

	const [firstChar, size] = firstCharAndSizeAsConst("Ching Shih");
		// const firstChar: string
		// const size: number
}

//:wq