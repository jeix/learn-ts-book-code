
////////////////////////////////////////////////////////////////////////////////
// 4. 객체

////////////////////////////////////////////////////////////
// 4.1 객체 타입

////////////////////////////////////////
// 4.1.1 객체 타입 선언

{

	let poetLater: {
		born: number;
		name: string;
	};

	poetLater = {
		born: 1935,
		name: "Mary Oliver",
	};

}

////////////////////////////////////////
// 4.1.2 객체 타입 alias

{

	type Poet = {
		born: number;
		name: string;
	};

	let poetLater: Poet;

	poetLater = {
		born: 1935,
		name: "Sara Teasdale",
	};

}

////////////////////////////////////////////////////////////
// 4.2 구조적 Typing

{
	type WithFirstName = {
		firstName: string;
	};

	type WithLastName = {
		lastName: string;
	};

	const hasBoth = {
		firstName: "Lucille",
		lastName: "Clifton",
	};

	let withFirstName: WithFirstName = hasBoth;

	let withLastName: WithLastName = hasBoth;
}

////////////////////////////////////////
// 4.2.1 Usage Checking

////////////////////////////////////////
// 4.2.2 타입에 선언된 속성 외의 속성

{
	type Poet = {
		born: number;
		name: string;
	};

	const poetMatch: Poet = {
		born: 1928,
		name: "Maya Angelou",
	};

	const extraProperty: Poet = {
		activity: "walking",
			// Error
			// Object literal may only specify known properties,
			// and 'activity' does not exist in type 'Poet'.
		born: 1935,
		name: "Mary Oliver",
	};

	const existingObject = {
		activity: "walking",
		born: 1935,
		name: "Mary Oliver",
	};
	const extraPropertyButOk: Poet = existingObject;
}

////////////////////////////////////////
// 4.2.3 중첩된 객체 타입

{
	type Author = {
		firstName: string;
		lastName: string;
	};

	type Poem = {
		author: Author;
		name: string;
	};

	const poemMatch: Poem = {
		author: {
			firstName: "Sylvia",
			lastName: "Plath",
		},
		name: "Lady Lazarus",
	};
}

////////////////////////////////////////
// 4.2.4 필수가 아닌 선택 속성

{
	type Writers = {
		author: string | undefined;
		editor?: string;
	};

	const hasRequired: Writers = {
		author: undefined, // required -- not optional
	};
}

////////////////////////////////////////////////////////////
// 4.3 객체 타입의 합집합

////////////////////////////////////////
// 4.3.1 추론된 객체 타입 합집합

{
	const poem = Math.random() > 0.5
		? { name: "The Double Image", pages: 7 }
		: { name: "Her Kind", rhymes: true };

		// const poem: {
		//     name: string;
		//     pages: number;
		//     rhymes?: undefined;
		// } | {
		//     name: string;
		//     rhymes: boolean;
		//     pages?: undefined;
		// }
	
	poem.name; // string
	poem.pages; // number | undefined
	poem.rhymes; // boolean | undefined
}

////////////////////////////////////////
// 4.3.2 명시된 객체 타입 합집합

{
	type PoemWithPages = {
		name: string;
		pages: number;
	};

	type PoemWithRhymes = {
		name: string;
		rhymes: boolean;
	};

	type Poem = PoemWithPages | PoemWithRhymes;

	const poem = Math.random() > 0.5
		? { name: "The Double Image", pages: 7 }
		: { name: "Her Kind", rhymes: true };
	
	poem.name; // string
	poem.pages; // number | undefined
	poem.rhymes; // boolean | undefined
}

////////////////////////////////////////
// 4.3.3 객체 타입 Narrowing

{
	type PoemWithPages = {
		name: string;
		pages: number;
	};

	type PoemWithRhymes = {
		name: string;
		rhymes: boolean;
	};

	type Poem = PoemWithPages | PoemWithRhymes;

	const poem = Math.random() > 0.5
		? { name: "The Double Image", pages: 7 }
		: { name: "Her Kind", rhymes: true };
	
	if ("pages" in poem) { // PoemWithPages
		poem.pages;
	} else { // PoemWithRhymes
		poem.rhymes;
	}
}

////////////////////////////////////////
// 4.3.4 식별된 합집합

{
	type PoemWithPages = {
		name: string;
		pages: number;
		type: 'pages';
	};

	type PoemWithRhymes = {
		name: string;
		rhymes: boolean;
		type: 'rhymes';
	};

	type Poem = PoemWithPages | PoemWithRhymes;

	const poem = Math.random() > 0.5
		? { name: "The Double Image", pages: 7, type: "pages" }
		: { name: "Her Kind", rhymes: true, type: "rhymes" };
	
	if (poem.type === "pages") { // PoemWithPages
		console.log(`pages: ${poem.pages}`);
	} else { // PoemWithRhymes
		console.log(`rhymes: ${poem.rhymes}`);
	}

	poem.type; // string
}

////////////////////////////////////////////////////////////
// 4.4 교집합 타입

{
	type Artwork = {
		genre: string;
		name: string;
	};

	type Writing = {
		pages: number;
		name: string;
	};

	type WrittenArt = Artwork & Writing;
}

{
	type ShortPoem = { author: string } & (
		| { kigo: string; type: "haiku"; }
		| { meter: number; type: "villanelle"; }
	);

	const morningGlory: ShortPoem = {
		author: "Fukuda Chiyo-ni",
		kigo: "Morning Glory",
		type: "haiku",
	};

	const oneArt: ShortPoem = {
		author: "Elizabeth Bishop",
		type: "villanelle",
			// Error
			// Type '{ author: string; type: "villanelle"; }' is not assignable to
			// type 'ShortPoem'.
			//   Type '{ author: string; type: "villanelle"; }' is not assignable to
			//   type '{ author: string; } & { meter: number; type: "villanelle"; }'.
			//     Property 'meter' is missing in type '{ author: string; type: "villanelle"; }'
			//     but required in type '{ meter: number; type: "villanelle"; }'.
	};
}

////////////////////////////////////////
// 4.4.1 교집합 타입의 위험

{
	type ShortPoemBase = { author: string };
	type Haiku = ShortPoemBase & { kigo: string; type: "haiku"; };
	type Villanelle = ShortPoemBase & { meter: number; type: "villanelle"; };
	type ShortPoem = Haiku | Villanelle;

	const morningGlory: ShortPoem = {
		author: "Fukuda Chiyo-ni",
		kigo: "Morning Glory",
		type: "haiku",
	};

	const oneArt: ShortPoem = {
		author: "Elizabeth Bishop",
		type: "villanelle",
			// Error
			// Type '{ author: string; type: "villanelle"; }' is not assignable to
			// type 'ShortPoem'.
			//   Type '{ author: string; type: "villanelle"; }' is not assignable to
			//   type 'Villanelle'.
			//     Property 'meter' is missing in type '{ author: string; type: "villanelle"; }'
			//     but required in type '{ meter: number; type: "villanelle"; }'.
	};
}

//////////////////////////////
// never 타입

{
	type NotPossible = number & string; // never

	let notNumber: NotPossible = 0;
		// Error
		// Type 'number' is not assignable to type 'never'.

	let notString: NotPossible = "";
		// Error
		// Type 'string' is not assignable to type 'never'.
}

//:wq