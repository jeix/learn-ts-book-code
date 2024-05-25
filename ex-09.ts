
////////////////////////////////////////////////////////////////////////////////
// 9. 타입 제한자

////////////////////////////////////////////////////////////
// 9.1 top 타입

////////////////////////////////////////
// 9.1.1 any 다시 보기

{
	let anyValue: any;
	anyValue = "Lucille Ball";
	anyValue = 123;
	console.log(anyValue);

	function greetComedian(name: any) {
		console.log(`Announcing ${name.toUpperCase()}!`);
	}
	greetComedian({name: "Bea Arthur"});
		// Runtime Error
		// TypeError: name.toUpperCase is not a function
}

////////////////////////////////////////
// 9.1.2 unknown

{
	function greetComedian(name: unknown) {
		console.log(`Announcing ${name.toUpperCase()}!`);
			// Error
			// 'name' is of type 'unknown'.
	}

	function greetComedianSafety(name: unknown) {
		if (typeof name === "string") {
			console.log(`Announcing ${name.toUpperCase()}!`);
		} else {
			console.log("Well, I'm off.");
		}
	}
	greetComedianSafety("Betty White");
	greetComedianSafety({});
}

////////////////////////////////////////////////////////////
// 9.2 타입 서술어

{
	function isNumberOrString(value: unknown): value is number | string {
		return ['number', 'string'].includes(typeof value);
	}

	function longValueIfExists(value: number | string | null | undefined) {
		if (isNumberOrString(value)) { // number | string
			value.toString();
		} else { // null | undefined
			console.log("value does not exist:", value);
		}
	}
}

{
	interface Comedian {
		funny: boolean;
	}

	interface StandupComedian extends Comedian {
		routine: string;
	}

	function isStandupComedian(value: Comedian): value is StandupComedian {
		return 'routine' in value;
	}

	function workWithComedian(value: Comedian) {
		if (isStandupComedian(value)) {
			console.log(value.routine);
		}
		console.log(value.routine);
			// Error
			// Property 'routine' does not exist on type 'Comedian'.
	}
}

{
	function isLongString(input: string | undefined): input is string {
		return !!(input && input.length >= 7);
	}

	function workWithText(text: string | undefined) {
		if (isLongString(text)) {
			console.log("Long text:", text.length);
		} else { // tsc expect undefined BUT string which length <= 6 may
			console.log("Short text", text?.length);
				// Error
				// Property 'length' does not exist on type 'never'.
		}
	}
}

////////////////////////////////////////////////////////////
// 9.3 타입 연산자

////////////////////////////////////////
// 9.3.1 keyof

{
	interface Ratings {
		audience: number;
		critics: number;
	}

	const ratings: Ratings = { audience: 66, critics: 84 };

	function getRating(ratings: Ratings, key: string): number {
		return ratings[key];
			// Error
			// Element implicitly has an 'any' type
			// because expression of type 'string' can't be used to index type 'Ratings'.
			//   No index signature with a parameter of type 'string' was found on type 'Ratings'.
	}

	getRating(ratings, 'audience');
	getRating(ratings, 'not valid'); // Oops -- undefined

	function getRating2(ratings: Ratings, key: 'audience' | 'critics'): number {
		return ratings[key];
	}

	getRating2(ratings, 'audience');
	getRating2(ratings, 'not valid');
		// Error
		// Argument of type '"not valid"' is not assignable to parameter of
		// type '"audience" | "critics"'.
	
	function getCountKeyOf(ratings: Ratings, key: keyof Ratings): number {
		return ratings[key];
	}

	getCountKeyOf(ratings, 'audience');
	getCountKeyOf(ratings, 'not valid');
		// Error
		// Argument of type '"not valid"' is not assignable to parameter of type 'keyof Ratings'.
}

////////////////////////////////////////
// 9.3.2 typeof

{
	const original = {
		medium: "movie",
		title: "Mean Girls",
	};

	let adaptation: typeof original;

	if (Math.random() > 0.5) {
		adaptation = { ...original, medium: "play" };
	} else {
		adaptation = { ...original, medium: 2 };
			// Error
			// Type 'number' is not assignable to type 'string'.
	}
}

//////////////////////////////
// keyof typeof

{
	const ratings = {
		imdb: 8.4,
		metacritic: 82,
	};

	function logRating(key: keyof typeof ratings) {
		console.log(ratings[key]);
	}

	logRating("imdb");
	logRating("invalid");
		// Error
		// Argument of type '"invalid"' is not assignable to parameter of
		// type '"imdb" | "metacritic"'.
}

////////////////////////////////////////////////////////////
// 9.4 타입 어서션

{
	const rawData = '["grace", "frankie"]';

	JSON.parse(rawData); // any

	JSON.parse(rawData) as string[];

	JSON.parse(rawData) as [string, string];

	JSON.parse(rawData) as ["grace", "frankie"];
}

////////////////////////////////////////
// 9.4.1 포착된 오류 타입 어서션

{
	// no doubt

	try {
		// ...
	} catch (error) {
		console.warn("Oh no!", (error as Error).message);
	}

	// safer

	try {
		// ...
	} catch (error) {
		console.warn("Oh no!", error instanceof Error ? error.message : error);
	}
}

////////////////////////////////////////
// 9.4.2 non-null 어서션

{
	let maybeDate = Math.random() > 0.5 ? undefined : new Date;
		// let maybeDate: Date | undefined
	
	let asDate = maybeDate as Date;
		// let asDate: Date

	let obviousDate = maybeDate!;
		// let obviousDate: Date
}

{
	const seasonCounts = new Map([
		["I Love Lucy", 6],
		["The Golden Girls", 7],
	]);

	const maybeValue = seasonCounts.get("I Love Lucy");
		// const maybeValue: number | undefined
	maybeValue.toString();
		// Error
		// 'maybeValue' is possibly 'undefined'.
	
	const knownValue = seasonCounts.get("I Love Lucy")!;
		// const knownValue: number
	knownValue.toString();
}

////////////////////////////////////////
// 9.4.3 타입 어서션 주의 사항

{
	// changed

	const seasonCounts = new Map([
		["Broad City", 5],
		["Community", 6],
	]);

	const knownValue = seasonCounts.get("I Love Lucy")!;
		// const knownValue: number
		// BUT ...
	knownValue.toString();
		// Runtime Error
		// TypeError: Cannot read properties of undefined (reading 'toString')
}

//////////////////////////////
// 어서션 vs. 선언

{
	interface Entertainer {
		acts: string[];
		name: string;
	}

	const declared: Entertainer = {
			// Error
			// Property 'acts' is missing in type '{ name: string; }'
			// but required in type 'Entertainer'.
		name: "Moms Mabley",
	};

	const asserted = {
		name: "Moms Mabley",
	} as Entertainer;
	
	asserted.acts.join(", ");
		// Runtime Error
		// TypeError: Cannot read properties of undefined (reading 'join')
}

//////////////////////////////
// 어서션 할당 가능성

{
	let myValue = "Stella!" as number;
		// Error
		// Conversion of type 'string' to type 'number' may be a mistake
		// because neither type sufficiently overlaps with the other.
		// If this was intentional, convert the expression to 'unknown' first.
	
	let myValueDouble = "Stella!" as unknown as number; // Oops
}

////////////////////////////////////////////////////////////
// 9.5 const 어서션

// as const
// 배열 -- 읽기 전용 튜플
// 리터럴 -- 타입 말고 리터럴
// 객체 속성 -- readonly

{
	[0, '']; // (string | number)[]

	[0, ''] as const; // readonly [0, ""]
}

////////////////////////////////////////
// 9.5.1 리터럴에서 원시 타입으로

{
	const getName = () => "Maria Bamford";
		// const getName: () => string

	const getNameConst = () => "Maria Bamford" as const;
		// const getNameConst: () => "Maria Bamford"
}

{
	interface Joke {
		quote: string;
		style: "story" | "one-liner";
	}

	function tellJoke(joke: Joke) {
		if (joke.style === "one-liner") {
			console.log(joke.quote);
		} else {
			console.log(joke.quote.split("\n"));
		}
	}

	const narrowJoke = {
		quote: "If you stay alive for no other reason do it for spite",
		style: "one-liner" as const,
	};
		// const narrowJoke: {
		//     quote: string;
		//     style: "one-liner";
		// }
	tellJoke(narrowJoke);

	const wideObject = {
		quote: "Time files when you are anxious!",
		style: "one-liner",
	};
		// const wideObject: {
		//     quote: string;
		//     style: string;
		// }
	tellJoke(wideObject):
		// Error
		// Argument of type '{ quote: string; style: string; }' is not
		// assignable to parameter of type 'Joke'.
		//   Types of property 'style' are incompatible.
		//     Type 'string' is not assignable to type '"story" | "one-liner"'.
}

////////////////////////////////////////
// 9.5.2 읽기 전용 객체

{
	function descrivePreference(preference: "maybe" | "no" | "yes") {
		switch (preference) {
			case "maybe":
				return "I suppose...";
			case "no":
				return "No thanks.";
			case "yes":
				return "Yes please!"
		}
	}

	const preferencesMutable = {
		movie: "maybe",
		standup: "yes",
	};
		// const preferencesMutable: {
		//     movie: string;
		//     standup: string;
		// }

	descrivePreference(preferencesMutable.movie);
		// Error
		// Argument of type 'string' is not assignable to parameter of
		// type '"maybe" | "no" | "yes"'

	preferencesMutable.movie = "no";

	const preferencesReadonly = {
		movie: "maybe",
		standup: "yes",
	} as const;
		// const preferencesReadonly: {
		//     readonly movie: "maybe";
		//     readonly standup: "yes";
		// }

	descrivePreference(preferencesReadonly.movie);

	preferencesReadonly.movie = "no";
		// Error
		// Cannot assign to 'movie' because it is a read-only property.
}

//:wq