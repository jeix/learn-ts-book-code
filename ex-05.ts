
////////////////////////////////////////////////////////////////////////////////
// 5. 함수

////////////////////////////////////////////////////////////
// 5.1 함수 매개변수

////////////////////////////////////////
// 5.1.1 필수 매개변수

////////////////////////////////////////
// 5.1.2 선택적 매개변수

{
	function announceSong(song: string, singer?: string) { // singer is optional
		console.log(`Song: ${song}`);
		if (singer) {
			console.log(`Singer: ${singer}`);
		}
	}

	announceSong("Greensleeves");
	announceSong("Greensleeves", undefined);
	announceSong("Candelier", "Sia");

	function announceSongBy(song: string, singer: string | undefined) { // singer is required
		console.log(`Song: ${song}`);
		if (singer) {
			console.log(`Singer: ${singer}`);
		}
	}

	announceSongBy("Greensleeves");
		// Error
		// Expected 2 arguments, but got 1.
		// An argument for 'singer' was not provided.
	announceSongBy("Greensleeves", undefined);
	announceSongBy("Candelier", "Sia");
}

////////////////////////////////////////
// 5.1.3 디폴트 매개변수

{
	function rateSong(song: string, rating = 0) {
		console.log(`${song} gets ${rating}/5 stars!`);
	}

	rateSong("Photograph");
	rateSong("Set Fire to the Rain", 5);
	rateSong("Set Fire to the Rain", undefined);
}

////////////////////////////////////////
// 5.1.4 나머지 매개변수

{
	function singAllTheSongs(singer: string, ...songs: string[]) {
		for (const song of songs) {
			console.log(`$song}, by ${singer}`);
		}
	}

	singAllTheSongs("Alicia Keys");
	singAllTheSongs("Lady Gaga", "Bad Romance", "Just Dance", "Poker Face");
		// Error
		// Argument of type 'number' is not assignable to parameter of type 'string'.
}

////////////////////////////////////////////////////////////
// 5.2 반환 타입

{
	function getSongFromAt(songs: string[], index: number) {
		return index < songs.length ? songs[index] : undefined;
	}
		// getSongFromAt(songs: string[], index: number): string | undefined
}

////////////////////////////////////////
// 5.2.1 명시적 반환 타입

{
	function singSongRecursive(songs: string[], count = 0): number {
		return songs.length ? singSongRecursive(songs.slice(1), count + 1) : count;
	}
}

{
	const singSongRecursive = (songs: string[], count = 0): number =>
		songs.length ? singSongRecursive(songs.slice(1), count + 1) : count;
}

////////////////////////////////////////////////////////////
// 5.3 함수 타입

{
	let nothingInGivesString: () => string;
}

{
	const songs = ["Juice", "Shake It Off", "What's Up"];

	function runOnSongs(getSongAt: (index: number) => string) {
		for (let i = 0; i < songs.length; i++) {
			console.log(getSongAt(i));
		}
	}

	function getSongAt(index: number) {
		return '${songs[index]}';
	}
	runOnSongs(getSongAt);
}

////////////////////////////////////////
// 5.3.1 함수 타입 괄호

{
	let returnStringOrUndefined: () => string | undefined;

	let maybeReturnString: (() => string) | undefined;
}

////////////////////////////////////////
// 5.3.2 매개변수 타입 추론

{
	let singer: (song: string) => string;

	singer = function (song) {
			// song: string
		return 'Singing: ${song.toUpperCase()}!';
	}
}

{
	const songs = ["Call Me", "Jolene", "The Chain"];

	songs.forEach((song, index) => {
			// song: string
			// index: number
		console.log(`${song} is at index ${index}`);
	});
}

////////////////////////////////////////
// 5.3.3 함수 타입 별칭

{
	type StringToNumber = (input: string) => number;

	let stringToNumber: StringToNumber;
	
	stringToNumber = (input) => input.length;
}

{
	type NumberToString = (input: number) => string;

	function usesNumberToString(numberToString: NumberToString) {
		console.log(`The string is: ${numberToString(1234)}`);
	}

	usesNumberToString((input) => '${input}! Hooray!');
}

////////////////////////////////////////////////////////////
// 5.4 그 외 반환 타입

////////////////////////////////////////
// 5.4.1 void 반환 타입

// void 는 undefined 가 아니다.
// void 는 타입이고 undefined 는 (반환되는) 리터럴이다.
// void 는 함수의 반환 타입이 무시됨을 의미한다.

{
	function returnsVoid() {
		return;
	}

	let lazyValue: string | undefined;

	lazyValue = returnsVoid();
		// Error
		// Type 'void' is not assignable to type 'string | undefined'.
}

{
	const records: string[] = [];

	function saveRecords(newRecords: string[]) {
		newRecords.forEach(record => records.push(record));
			// Array<string>.forEach(
			//   callbackfn: (value: string, index: number, array: string[]) => void,
			//   thisArg?: any
			// ): void
	}

	saveRecords(['21', 'Come On Over', 'The Bodyguard']);
}

{
	function expectFunctionReturnsVoid(f: () => void) {
		f();
	}

	function returnsNumberNotVoid() {
		return 42;
	}
	expectFunctionReturnsVoid(returnsNumberNotVoid);
}

////////////////////////////////////////
// 5.4.2 never 반환 타입

{
	function fail(message: string): never {
		throw new Error('Invariant failure: ${message}');
	}

	function workWithUnsafeParam(param: unknown) {
		if (typeof param !== 'string') {
			fail('param should be a string, not ${typeof param}');
		}
		// param is string
		param.toLocaleUpperCase();
	}
}

////////////////////////////////////////////////////////////
// 5.5 함수 오버로드

{
	function createDate(timestamp: number): Date;
	function createDate(year: number, month: number, day: number): Date;
	function createDate(yearOrTimestamp: number, month?: number, day?: number) {
		return month === undefined || day === undefined
			? new Date(yearOrTimestamp)
			: new Date(yearOrTimestamp, month, day);
	}

	createDate(1716210091478);
	createDate(2024, 5, 20);
}

////////////////////////////////////////
// 5.5.1 호출 시그니처 호환성

{
	(function () {
		function format(data: string): string;
		function format(data: string, needle: string, haystack: string): string;
		function format(getData: () => string): string;
			// Error
			// This overload signature is not compatible with its implementation signature.
		function format(data: string, needle?: string, haystack?: string) {
			return needle && haystack ? data.replace(needle, haystack) : data;
		}
	})();
}

{
	(function () {
		function format(data: string): string;
		function format(data: string, needle: string, haystack: string): string;
		function format(getData: () => string): string;
		function format(data: string | (() => string), needle?: string, haystack?: string) {
			typeof data === 'function' && (data = data());
			return needle && haystack ? data.replace(needle, haystack) : data;
		}
	})();
}

//:wq