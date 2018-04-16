import { calcPopularityPercentage } from "client/components/snack-voter";

describe("calcPopularity", () => {
  it("Returns 100 if the max vote count is 0", () => {
    expect(calcPopularityPercentage(0, 0)).toEqual("100%");
  });

  it("Is the ratio of the snack votes to the max", () => {
    expect(calcPopularityPercentage(3, 10)).toEqual("30%");
    expect(calcPopularityPercentage(3, 3)).toEqual("100%");
  });
});
