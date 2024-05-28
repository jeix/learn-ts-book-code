
namespace Settings {
	export function describe() {
		return `${Settings.name} at version ${Settings.version}`;
	}
	console.log("Initializing", describe());
}
