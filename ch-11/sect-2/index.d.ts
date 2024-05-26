
interface Writer {}
declare interface Writer {}

declare const fullName: string;
declare const firstName: "Liz";

const lastName = "Lemon";
	// Error
	// Top-level declarations in .d.ts files must start with either
	// a 'declare' or 'export' modifier.
