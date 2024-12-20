import assert from "assert";
import { isNodeVulnerable } from "../check.js";
import { nv } from "../utils/nv/index.js";
/**
 * of course, this test is fragile
 */
async function test() {
	assert.ok(await isNodeVulnerable("20.5.0"));
	assert.ok(await isNodeVulnerable("20.0.0"));
	assert.ok(await isNodeVulnerable("19.0.0"));
	assert.ok(await isNodeVulnerable("18.0.0"));
	assert.ok(await isNodeVulnerable("14.0.0"));
	assert.ok(await isNodeVulnerable("16.0.0"));
	assert.ok(await isNodeVulnerable("19.6.0"));
	assert.ok(await isNodeVulnerable("18.14.0"));
	assert.ok(await isNodeVulnerable("16.19.0"));
	assert.ok(await isNodeVulnerable("20.8.0"));
	assert.ok(await isNodeVulnerable("20.11.0"));

	const activeVersions = await nv("active");
	for (const active of activeVersions) {
		assert.ok(!(await isNodeVulnerable(active.version)));
	}

	const ltsVersions = await nv(["lts"]);
	if (ltsVersions.length > 1) {
		assert.rejects(() => isNodeVulnerable("lts"), /not get exactly one version/);
	}
	assert.rejects(() => isNodeVulnerable("999"), /not get exactly one version/);
	/** i.e. not found */
	assert.rejects(() => isNodeVulnerable("Unobtanium"), /not get exactly one version/);
	assert.rejects(() => isNodeVulnerable("24.0.0"), /not get exactly one version/);

	/** EOL */
	assert.ok(await isNodeVulnerable("19.0.0"));
	assert.ok(await isNodeVulnerable("16.0.0"));
	assert.ok(await isNodeVulnerable("17.0.0"));
	assert.ok(await isNodeVulnerable("15.0.0"));
	assert.ok(await isNodeVulnerable("13.0.0"));
	assert.ok(await isNodeVulnerable("12.0.0"));
	assert.ok(await isNodeVulnerable("v0.12.18"));

	// Platform specific
	assert.ok(await isNodeVulnerable("22.4.0", "win32"));
	assert.ok(await isNodeVulnerable("19.0.0", "linux"));
	assert.ok(await isNodeVulnerable("18.0.0", "win32"));
	assert.ok(await isNodeVulnerable("14.0.0", "android"));
	assert.rejects(
		() => isNodeVulnerable("20.0.0", "non-valid-platform"),
		/platform non-valid-platform is not valid. Please use aix,darwin,freebsd,linux,openbsd,sunos,win32,android/,
	);
}

test();
