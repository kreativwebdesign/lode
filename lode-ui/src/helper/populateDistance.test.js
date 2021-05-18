import populateDistance from "./populateDistance";

describe("populateDistance", () => {
  it("aggregates distance from previous levels", () => {
    const levels = populateDistance({
      levels: [{ threshold: 10 }, { threshold: 15 }, { threshold: -1 }],
    });

    expect(levels[0]).toMatchObject({ distance: 10 });
    expect(levels[1]).toMatchObject({ distance: 25 });
    expect(levels[2]).toMatchObject({ distance: Infinity });
  });
});
