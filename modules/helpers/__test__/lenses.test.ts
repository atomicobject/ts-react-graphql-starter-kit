import {Lens, Prism} from '../lenses';

describe('property lenses', () => {
  it("works for depth 1", () => {
    let o = {foo: 1};
    let l = Lens.from<typeof o>().prop('foo');
    expect(l.get(o)).toBe(1);
    
    let o2 = l.set(o, 10);
    expect(o2).toEqual({foo: 10});
    expect(o2).not.toBe(o);
  });

  it("works for depth 3", () => {
    let o = {foo: {bar: {baz: 1}}};
    let l = Lens.from<typeof o>().prop('foo', 'bar', 'baz');
    expect(l.get(o)).toBe(1);
    
    let o2 = l.set(o, 10);
    expect(o2).toEqual({foo: {bar: {baz: 10}}});
    expect(o2).not.toBe(o);
  });
})

describe('compose', () => {
  it("works at all", () => {
    let bar = {bar: 1};
    let o = {foo: bar};
    let l1 = Lens.from<typeof o>().prop('foo');
    let l2 = Lens.from<typeof bar>().prop('bar');

    let composed = Lens.comp(l1, l2);
    expect(composed.get(o)).toBe(1);
    expect(composed.set(o, 10)).toEqual({
      foo: {bar: 10}
    });
  });

  it("composes lenses and prisms", () => {
    let x = {prop: 1};
    let outer = {
      array: [x]
    };
    let lFoo = Lens.from<typeof outer>().prop('array');
    let lBar = Lens.from<typeof x>().prop('prop');

    let p0 = Prism.forArrayIndex<typeof x>(0);

    let composed = Prism.comp(lFoo, p0, lBar);
    expect(composed.get(outer)).toBe(1);
    expect(composed.set(outer, 10)).toEqual({
      array: [{prop: 10}]
    });

    const empty = {array: []};
    expect(composed.get(empty)).toBeUndefined()
    expect(composed.set(empty, 1)).toEqual({array: []});
  });
});

describe('array index lenses', () => {
  it('works on the right entry', () => {
    let a = ['a'];
    let index0 = Prism.forArrayIndex<string>(0);
    expect(index0.get(a)).toEqual('a');

    let a2 = index0.set(a, 'b');
    expect(a2).toEqual(['b']);
    expect(a2).not.toBe(a);
  });
});

describe('map', () => {
  it("translates a lens from one type to another", () => {
    let o = {bar: 1};
    let l = Lens.from<typeof o>().prop('bar');
    let n2s= {
      to: (n:number) => n.toString(),
      from: (s: string) => parseInt(s, 10)
    };

    let composed = Lens.map(l, n2s);
    expect(composed.get(o)).toBe('1');
    expect(composed.set(o, '10')).toEqual({
      bar: 10
    });
  });
})