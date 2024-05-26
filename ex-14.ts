
////////////////////////////////////////////////////////////////////////////////
// 14. 구문 확장

////////////////////////////////////////////////////////////
// 14.1 클래스 매개변수 속성

{
	class Engineer {
		constructor(readonly area: string) {
			console.log("...");
		}
	}

	class Engineer {
		readonly area: string

		constructor(area: string) {
			this.area = area;
			console.log("...");
		}
	}
}

{
	class NamedEngineer {
		fullName: string;

		constructor(
			name: string,
			public area: string,
		) {
			this.fullName = `${name}, ${area} engineer`;
		}
	}

	class NamedEngineer {
		fullName: string;
		area: string;

		constructor(
			name: string,
			area: string,
		) {
			this.area = area;
			this.fullName = `${name}, ${area} engineer`;
		}
	}
}

////////////////////////////////////////////////////////////
// 14.2 실험적인 데코레이터

{
	/*
	// tsconfig.json

	{
		"compilerOptions": {
			"experimentalDecorators": true
		}
	}

	// tsc option

	$ tsc --experimentalDecorators ex-14.ts
	*/
}

{
	function logOnCall(target: any, key: string, descriptor: PropertyDescriptor) {
		const original = descriptor.value;
		console.log("[logOnCall] I am decorating", target.constructor.name);

		descriptor.value = function (...args: unknown[]) {
			console.log(`[descriptor.value] Calling '${key}' with:`, ...args);
			return original.call(this, ...args);
		}
	}

	class Greeter {
		@logOnCall
		greet(message: string) {
			console.log(`[greet] Hello, ${message}!`);
		}
	}

	new Greeter().greet("you");
		//--> [logOnCall] I am decorating Greeter
		//--> [descriptor.value] Calling 'greet' with: you
		//--> [greet] Hello, you!
}

////////////////////////////////////////////////////////////
// 14.3 열거형

{
	const StatusCodes = {
		InternalServerError: 500,
		NotFound: 404,
		Ok: 200,
		// ...
	} as const;

	StatusCodes.InternalServerError; // 500

	type StatusCodeValue = (typeof StatusCodes)[keyof typeof StatusCodes]; // 500 | 404 | 200

	let statusCodeValue: StatusCodeValue;
	statusCodeValue = 200;
	statusCodeValue = -1;
		// Error
		// Type '-1' is not assignable to type 'StatusCodeValue'.
}

{
	enum StatusCode {
		InternalServerError = 500,
		NotFound = 404,
		Ok = 200,
		// ...
	}

	StatusCode.InternalServerError; // 500

	let statusCode: StatusCode;
	statusCode = StatusCode.Ok;
	statusCode = 200;
	statusCode = -1;
		// Error
		// Type '-1' is not assignable to type 'StatusCodes'.
}

{
	// JavaScript
	
	let StatusCode;
	(function (StatusCode) {
		StatusCode[StatusCode["InternalServerError"] = 500] = "InternalServerError";
		StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
		StatusCode[StatusCode["Ok"] = 200] = "Ok";
	})(StatusCode || (StatusCode = {}));
}

////////////////////////////////////////
// 14.3.1 자동 숫자값

////////////////////////////////////////
// 14.3.2 문자열값을 갖는 열거형

////////////////////////////////////////
// 14.3.3 const 열거형

////////////////////////////////////////////////////////////
// 14.4 네임스페이스

////////////////////////////////////////
// 14.4.1 네임스페이스 내보내기

////////////////////////////////////////
// 14.4.2 중첩된 네임스페이스

////////////////////////////////////////
// 14.4.3 타입 정의에서 네임스페이스

////////////////////////////////////////
// 14.4.4 네임스페이스보다 모듈을 선호

////////////////////////////////////////////////////////////
// 14.5 타입 전용 가져오기와 내보내기

//:wq