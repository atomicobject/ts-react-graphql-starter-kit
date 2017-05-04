import { resolvers } from '../index'
import * as jsv from 'jsverify';
import {uniqWith, isEqual, range} from 'lodash';

describe("answer query", () => {
  it("returns 1, 2, and 3 in some order", () => {
    var prop = jsv.forall("nat", async () => {
        const result = await resolvers.Query.answer();
        result.sort();
        return isEqual([1,2,3], result);
      });

    jsv.check(prop, { tests: 100 })
  });
  
  it("returns different sequences each time", () => {
    const answers = range(100).map(resolvers.Query.answer);
    const uniqAnswers = uniqWith(answers, isEqual);
    expect(uniqAnswers.length).toBeGreaterThan(1);
  });
});