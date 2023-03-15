import {groupN} from "../utils";

describe('groupN', () => {
  it('should split array into pairs', () => {
    expect(groupN([1,2,3,4,5], 2)).toBe([[1, 2], [3, 4], [5]]);
  });
});
