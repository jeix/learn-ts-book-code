
import { Data } from "./types/data";

function logData(data: Data) {
	console.log(`Data version is: ${data.version}`);
}

logData(globallyDeclared);

logData(locallyDeclared);
	// Error
	// Cannot find name 'locallyDeclared'.
