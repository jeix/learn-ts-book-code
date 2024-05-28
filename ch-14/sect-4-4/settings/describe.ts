
import { name, version } from "./constants";

export function describe() {
	return `${name} at version ${version}`;
}

console.log("Initializing", describe());
