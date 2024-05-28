
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
	/*
	// JavaScript
	
	var StatusCode = void 0;
    (function (StatusCode) {
        StatusCode[StatusCode["InternalServerError"] = 500] = "InternalServerError";
        StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
        StatusCode[StatusCode["Ok"] = 200] = "Ok";
        // ...
    })(StatusCode || (StatusCode = {}));

	var statusCode = void 0;
    statusCode = StatusCode.Ok;
    statusCode = 200;
	*/
}

////////////////////////////////////////
// 14.3.1 자동 숫자값

{
	enum VisualTheme {
		Dark,   // 0
		Light,  // 1
		System, // 2
	}

	enum Direction {
		Top = 1, // 1
		Right,   // 2
		Bottom,  // 3
		Left,    // 4
	}

	let direction = Direction.Right;
}

{
	/*
	// JavaScript

	var VisualTheme = void 0;
    (function (VisualTheme) {
        VisualTheme[VisualTheme["Dark"] = 0] = "Dark";
        VisualTheme[VisualTheme["Light"] = 1] = "Light";
        VisualTheme[VisualTheme["System"] = 2] = "System";
    })(VisualTheme || (VisualTheme = {}));

    var Direction = void 0;
    (function (Direction) {
        Direction[Direction["Top"] = 1] = "Top";
        Direction[Direction["Right"] = 2] = "Right";
        Direction[Direction["Bottom"] = 3] = "Bottom";
        Direction[Direction["Left"] = 4] = "Left";
    })(Direction || (Direction = {}));

    var direction = Direction.Right;
	*/
}

////////////////////////////////////////
// 14.3.2 문자열값을 갖는 열거형

{
	enum LoadStyle {
		AsNeeded = "as-needed",
		Eager = "eager",
	}

	enum Wat {
		FirstString = "first",
		SomeNumber = 9000,
		ImplicitNumber, // 9001
		AnotherString = "anoter",
		NotAllowed,
			// Error
			// Enum member must have initializer.
	}
}

{
	/*
	// JavaScript

	var LoadStyle = void 0;
    (function (LoadStyle) {
        LoadStyle["AsNeeded"] = "as-needed";
        LoadStyle["Eager"] = "eager";
    })(LoadStyle || (LoadStyle = {}));

    var Wat = void 0;
    (function (Wat) {
        Wat["FirstString"] = "first";
        Wat[Wat["SomeNumber"] = 9000] = "SomeNumber";
        Wat[Wat["ImplicitNumber"] = 9001] = "ImplicitNumber";
        Wat["AnotherString"] = "anoter";
        Wat[Wat["NotAllowed"] = void 0] = "NotAllowed";
    })(Wat || (Wat = {}));
	*/
}

////////////////////////////////////////
// 14.3.3 const 열거형

{
	const enum DisplayHint {
		Opaque = 0,
		Semitransparent,
		Transparent,
	}

	let displayHint = DisplayHint.Transparent;
}

{
	`
	// JavaScript

	var displayHint = 2 /* DisplayHint.Transparent */;
	`
}

{
	`
	// tsc option

	$ tsc --experimentalDecorators --preserveConstEnums ex-14.ts

	// JavaScript

    var DisplayHint = void 0;
    (function (DisplayHint) {
        DisplayHint[DisplayHint["Opaque"] = 0] = "Opaque";
        DisplayHint[DisplayHint["Semitransparent"] = 1] = "Semitransparent";
        DisplayHint[DisplayHint["Transparent"] = 2] = "Transparent";
    })(DisplayHint || (DisplayHint = {}));
    var displayHint = 2 /* DisplayHint.Transparent */;
	`
}

////////////////////////////////////////////////////////////
// 14.4 네임스페이스

////////////////////////////////////////
// 14.4.1 네임스페이스 내보내기

//{
	// A namespace declaration is only allowed at the top level of a namespace or module.

	namespace Settings {
		export const name = "My Application";
		export const version = "1.2.3";
		export function describe() {
			return `${Settings.name} at version ${Settings.version}`;
		}
	}
//}

{
	console.log("Initialized", Settings.describe());
		//--> Initialized My Application at version 1.2.3
}

////////////////////////////////////////
// 14.4.2 중첩된 네임스페이스

//{
	namespace Root.Nested {
		export const value1 = true;
	}
//}

//{
	namespace Root {
		export namespace Nested {
			export const value2 = true;
		}
	}
//}

////////////////////////////////////////
// 14.4.3 타입 정의에서 네임스페이스

////////////////////////////////////////
// 14.4.4 네임스페이스보다 모듈을 선호

////////////////////////////////////////////////////////////
// 14.5 타입 전용 가져오기와 내보내기

//:wq