import { transformKinderprogramm } from "../transform-data";

describe("transformKinderprogramm", () => {
	const defaultKinderprogramm = [
		{ id: 1, title: { rendered: "Freitag Vormittag" } }
	];
	it("works", () => {
		expect(transformKinderprogramm(defaultKinderprogramm)).toEqual({
			Freitag: [{ id: 1, zeit: "Vormittag" }]
		});
	});
});
