
////////////////////////////////////////////////////////////////////////////////
// 8. 클래스

////////////////////////////////////////////////////////////
// 8.1 클래스 메서드

{
	class Greeter {
		greet(name: string) {
			console.log(`${name}, do your stuff!`);
		}
	}

	new Greeter().greet("Miss Frizzle");
}

{
	class Greeted {
		constructor(message: string) {
			console.log(`As I always say: ${message}`);
		}
	}

	new Greeted("take chances, make mistakes, get messy");
}

////////////////////////////////////////////////////////////
// 8.2 클래스 속성

{
	class FieldTrip {
		destination: string;

		constructor(destination: string) {
			this.destination = destination;
			console.log(`We're going to ${this.destination}!`);
			this.notexistent = destination;
				// Error
				// Property 'notexistent' does not exist on type 'FieldTrip'.
		}
	}

	const trip = new FieldTrip('planetarium');
	trip.destination;
	trip.notexistent;
		// Error
		// Property 'notexistent' does not exist on type 'FieldTrip'.
}

////////////////////////////////////////
// 8.2.1 함수 속성

{
	class WithMethod {
		myMethod() {}
	}

	new WithMethod().myMethod === new WithMethod().myMethod;

	class WithProperty {
		myProperty = () => {}
	}

	new WithProperty().myProperty !== new WithProperty().myProperty;

	class WithPropertyParameter {
		takesParameters = (input: boolean) => input ? "Yes" : "No";
	}

	const instance = new WithPropertyParameter();
	instance.takesParameters(true);
}

////////////////////////////////////////
// 8.2.2 초기화 검사

{
	class WithValue {
		immediate = 0;
		later: number;
		mayBeUndefined: number | undefined;
		unused: number;
			// Error
			// Property 'unused' has no initializer
			// and is not definitely assigned in the constructor.

		constructor() {
			this.later = 1;
		}
	}
}

{
	// if we turn off "strict" or "strictPropertyInitialization" option

	class MissingInitializer {
		property: string;
	}

	new MissingInitializer().property.length;
		// Runtime Error
		// TypeError: Cannot read properties of undefined (reading 'length')
}

{
	class ActivitiesQueue {
		pending!: string[];
			// ! means "I know I know"

		initialize(pending: string[]) {
			this.pending = pending;
		}

		next() {
			return this.pending.pop();
		}
	}

	const activities = new ActivitiesQueue();
	activities.initialize(['eat', 'sleep', 'learn']);
	activities.next();
}

////////////////////////////////////////
// 8.2.3 선택적 속성

{
	class MissingInitializer {
		property?: string;
	}

	new MissingInitializer().property?.length;

	new MissingInitializer().property.length;
		// Error
		// Object is possibly 'undefined'.
}

////////////////////////////////////////
// 8.2.4 읽기 전용 속성

{
	class Quote {
		readonly text: string;

		constructor(text: string) {
			this.text = text;
		}

		emphasize() {
			this.text += "!";
				// Error
				// Cannot assign to 'text' because it is a read-only property.
		}
	}

	const quote = new Quote("There is a brilliant child locked inside every student.");
	quote.text = "Ha!";
		// Error
		// Cannot assign to 'text' because it is a read-only property.
}

{
	class RandomQuote {
		readonly explicit: string = "Home is the nicest word there is.";
		readonly implicit = "Home is the nicest word there is.";

		constructor() {
			if (Math.random() > 0.5) {
				this.explicit = "We start learning the minute we're born.";
				this.implicit = "We start learning the minute we're born.";
					// Error
					// Type '"We start learning the minute we're born."'
					// is not assignable to type '"Home is the nicest word there is."'.
			}
		}
	}

	const quote = new RandomQuote();
	quote.explicit; // string
	quote.implicit; // "Home is the nicest word there is."
}

////////////////////////////////////////////////////////////
// 8.3 타입으로서의 클래스

{
	class SchoolBus {
		getAbilities() {
			return ["magic", "shapeshifting"];
		}
	}

	function withSchoolBus(bus: SchoolBus) {
		console.log(bus.getAbilities());
	}

	withSchoolBus(new SchoolBus());

	withSchoolBus({
		getAbilities: () => ["transmogrification"],
	});

	withSchoolBus({
		getAbilities: () => 123,
			// Error
			// Type 'number' is not assignable to type 'string[]'.
	});
}

////////////////////////////////////////////////////////////
// 8.4 클래스와 인터페이스

{
	interface Learner {
		name: string;
		study(hours: number): void;
	}

	class Student implements Learner {
		name: string;

		constructor(name: string) {
			this.name = name;
		}

		study(hours: number) {
			for (let i = 0; i < hours; i++) {
				console.log("...studying...");
			}
		}
	}

	class Slacker implements Learner {
		// Error
		// Class 'Slacker' incorrectly implements interface 'Learner'.
		//   Type 'Slacker' is missing the following properties from type 'Learner': name, study
	}

	class ImproperStudent implements Learner {
		name;
			// Error
			// Member 'name' implicitly has an 'any' type.

		study(hours): void {
			// Error
			// Parameter 'hours' implicitly has an 'any' type.
		}
	}
}

////////////////////////////////////////
// 8.4.1 다중 인터페이스 구현

{
	interface Graded {
		grades: number[];
	}

	interface Reporter {
		report: () => string;
	}

	class ReportCard implements Graded, Reporter {
		grades: number[];

		constructor(grades: number[]) {
			this.grades = grades;
		}

		report() {
			return this.grades.join(", ");
		}
	}
}

////////////////////////////////////////////////////////////
// 8.5 클래스 확장

////////////////////////////////////////
// 8.5.1 할당 가능성 확장

////////////////////////////////////////
// 8.5.2 재정의된 생성자

////////////////////////////////////////
// 8.5.3 재정의된 메서드

////////////////////////////////////////
// 8.5.4 재정의된 속성

////////////////////////////////////////////////////////////
// 8.6 추상 클래스

////////////////////////////////////////////////////////////
// 8.7 멤버 접근성

////////////////////////////////////////
// 8.7.1 정적 필드 제한자

//:wq