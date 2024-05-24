
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

{
	class Lesson {
		subject: string;

		constructor(subject: string) {
			this.subject = subject;
		}
	}

	class OnlineLesson extends Lesson {
		url: string;

		constructor(subject: string, url: string) {
			super(subject);
			this.url = url;
		}
	}

	let lesson: Lesson;
	lesson = new Lesson("coding");
	lesson = new OnlineLesson("coding", "oreilly.com");

	let online: OnlineLesson;
	online = new OnlineLesson("coding", "oreilly.com");
	online = new Lesson("coding");
		// Error
		// Property 'url' is missing in type 'Lesson' but required in type 'OnlineLesson'.
}

{
	class PastGrades {
		grades: number[] = [];
	}

	class LabeledPastGrades extends PastGrades {
		label?: string;
	}

	let subClass: LabeledPastGrades;
	subClass = new LabeledPastGrades();
	subClass = new PastGrades();
}

////////////////////////////////////////
// 8.5.2 재정의된 생성자

{
	class GradeAnnouncer {
		message: string;

		constructor(grade: number) {
			this.message = grade >= 65 ? "Maybe next time..." : "You pass!";
		}
	}

	class PassingAnnouncer extends GradeAnnouncer {
		constructor() {
			super(100);
		}
	}

	class FailingAnnouncer extends GradeAnnouncer {
		constructor() { }
			// Error
			// Constructors for derived classes must contain a 'super' call.
	}
}

{
	class GradesTally {
		grades: number[] = [];

		addGrades(...grades: number[]) {
			this.grades.push(...grades);
			return this.grades.length;
		}
	}

	class ContinuedGradesTally extends GradesTally {
		constructor(previousGrades: number[]) {
			this.grades = [...previousGrades];
				// Error
				// 'super' must be called before accessing 'this'
				// in the constructor of a derived class.
			super();
			console.log("Starting with length", this.grades.length);
		}
	}
}

////////////////////////////////////////
// 8.5.3 재정의된 메서드

{
	class GradeCounter {
		countGrades(grades: string[], letter: string) {
			return grades.filter(grade => grade === letter).length;
		}
	}

	class FailureCounter extends GradeCounter {
		countGrades(grades: string[]) {
			return super.countGrades(grades, "F");
		}
	}

	class AnyFailureChecker extends GradeCounter {
		countGrades(grades: string[]) {
				// Error
				// Property 'countGrades' in type 'AnyFailureChecker' is not
				// assignable to the same property in base type 'GradeCounter'.
				//   Type '(grades: string[]) => boolean' is not
				//   assignable to type '(grades: string[], letter: string) => number'.
				//     Type 'boolean' is not assignable to type 'number'.
			return super.countGrades(grades, "F") !== 0;
		}
	}

	const failCounter: GradeCounter = new FailureCounter();
	const failCount = failCounter.countGrades(["A", "C", "F"]);
		// Error
		// Expected 2 arguments, but got 1.

	const counter: GradeCounter = new AnyFailureChecker();
		// Error
		// Type 'AnyFailureChecker' is not assignable to type 'GradeCounter'.
		//   The types returned by 'countGrades(...)' are incompatible between these types.
		//     Type 'boolean' is not assignable to type 'number'.
	const count = counter.countGrades(["A", "C", "F"]);
		// Error
		// Expected 2 arguments, but got 1.

}

////////////////////////////////////////
// 8.5.4 재정의된 속성

{
	class Assignment {
		grade?: number;
	}

	class GradeAssignment extends Assignment {
		grade: number;

		constructor(grade: number) {
			super();
			this.grade = grade;
		}
	}
}

{
	class NumericGrade {
		value = 0;
	}

	class VagueGrade extends NumericGrade {
		value = Math.random() > 0 ? 1 : "...";
			// Error
			// Property 'value' in type 'VagueGrade' is not
			// assignable to the same property in base type 'NumericGrade'.
			//   Type 'string | number' is not assignable to type 'number'.
			//     Type 'string' is not assignable to type 'number'.
	}

	const instance: NumericGrade = new VagueGrade();
		// Error
		// Type 'VagueGrade' is not assignable to type 'NumericGrade'.
		//   Types of property 'value' are incompatible.
		//     Type 'string | number' is not assignable to type 'number'.
		//       Type 'string' is not assignable to type 'number'.
	instance.value
}

////////////////////////////////////////////////////////////
// 8.6 추상 클래스

{
	abstract class School {
		readonly name: string;

		constructor(name: string) {
			this.name = name;
		}

		abstract getStudentTypes(): string[];
	}

	class Preschool extends School {
		getStudentTypes() {
			return ["preschooler"];
		}
	}

	class Absence extends School { }
		// Error
		// Non-abstract class 'Absence' does not implement all abstract members of 'School'
		// Non-abstract class 'Absence' does not implement
		// inherited abstract member 'getStudentTypes' from class 'School'.
	
		let school: School;
		school = new School("somewhere else");
			// Error
			// Cannot create an instance of an abstract class.
		school = new Preschool("Sunnyside Daycare");
}

////////////////////////////////////////////////////////////
// 8.7 멤버 접근성

{
	class Base {
		isPublicImplicit = 0;
		public isPublicExplicit = 1;
		protected isProtected = 2;
		private isPrivate = 3;
		#truePrivate = 4;
	}

	class Subclass extends Base {
		examples() {
			this.isPublicImplicit;
			this.isPublicExplicit;
			this.isProtected;
			this.isPrivate;
				// Error
				// Property 'isPrivate' is private and only accessible within class 'Base'.
			this.#truePrivate;
				// Error
				// Property '#truePrivate' is not accessible outside class 'Base'
				// because it has a private identifier.
		}
	}

	new Subclass().isPublicImplicit;
	new Subclass().isPublicExplicit;
	new Subclass().isProtected;
		// Error
		// Property 'isProtected' is protected
		// and only accessible within class 'Base' and its subclasses.
	new Subclass().isPrivate;
		// Error
		// Property 'isPrivate' is private and only accessible within class 'Base'.
}

{
	class TwoKeywords {
		private readonly name: string;

		constructor() {
			this.name = "Anne Sullivan";
		}

		log() {
			console.log(this.name);
		}
	}

	const two = new TwoKeywords();
	two.name = "Savitribai Phule";
		// Error
		// Property 'name' is private and only accessible within class 'TwoKeywords'.
		// Cannot assign to 'name' because it is a read-only property.
}

////////////////////////////////////////
// 8.7.1 정적 필드 제한자

{
	class Question {
		protected static readonly answer: "bash";
		protected static readonly prompt =
			"What's an ogre's favorite programming language?"
		
		guess(getAnswer: (prompt: string) => string) {
			const answer = getAnswer(Question.prompt);
			if (answer === Question.answer) {
				console.log("You got it!");
			} else {
				console.log("Try agaib...");
			}
		}
	}

	Question.answer;
		// Error
		// Property 'answer' is protected and only accessible
		// within class 'Question' and its subclasses.
}

//:wq