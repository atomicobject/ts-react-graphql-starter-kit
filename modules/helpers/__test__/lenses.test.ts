import {Lens, Prism} from '../lenses';

describe('property lenses', () => {
  it("works for depth 1", () => {
    let o = {foo: 1};
    let l = Lens.from<typeof o>().prop('foo');
    expect(l(o)).toBe(1);
    expect(l.get(o)).toBe(1);
    
    let o2 = l.set(o, 10);
    expect(o2).toEqual({foo: 10});
    expect(o2).not.toBe(o);

    let o3 = l.set(10)(o);
    expect(o3).toEqual(o2);
  });

  it("works for depth 3", () => {
    interface O { foo: {bar: {baz: number}}}
    let o: O = {foo: {bar: {baz: 1}}};
    let l = Lens.from<typeof o>().prop('foo', 'bar', 'baz');
    expect(l.get(o)).toBe(1);
    
    let o2 = l.set(o, 10);
    expect(o2).toEqual({foo: {bar: {baz: 10}}});
    expect(o2).not.toBe(o);
  });
})

describe('compose', () => {
  it("works at all", () => {
    interface Bar { bar: number; }
    let bar: Bar = {bar: 1};
    interface Foo { foo: Bar; }
    let o: Foo = {foo: bar};
    let l1 = Lens.from<typeof o>().prop('foo');
    let l2 = Lens.from<typeof bar>().prop('bar');

    let composed = Lens.comp(l1, l2);
    expect(composed(o)).toBe(1);
    expect(composed.get(o)).toBe(1);
    expect(composed.set(o, 10)).toEqual({
      foo: {bar: 10}
    });
    expect(composed.set(10)(o)).toEqual({
      foo: { bar: 10 }
    });
  });

  it("composes lenses and prisms", () => {
    interface X { prop: number }
    let x = {prop: 1};

    interface Outer { array: X[]}
    let outer: Outer = {
      array: [x]
    };
    let lFoo = Lens.from<typeof outer>().prop('array');
    let lBar = Lens.from<typeof x>().prop('prop');

    let p0 = Prism.forArrayIndex<typeof x>(0);

    let composed = Prism.comp(lFoo, p0, lBar);
    expect(composed(outer)).toBe(1);
    expect(composed.get(outer)).toBe(1);
    expect(composed.set(outer, 10)).toEqual({
      array: [{prop: 10}]
    });

    const empty = {array: []};
    expect(composed(empty)).toBeUndefined()
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
    interface O { bar: number };
    let o: O= {bar: 1};
    let l = Lens.from<O>().prop('bar');
    let n2s= {
      to: (n:number) => n.toString(),
      from: (s: string) => parseInt(s, 10)
    };

    let composed = Lens.map(l, n2s);
    expect(composed(o)).toBe('1');
    expect(composed.get(o)).toBe('1');
    expect(composed.set(o, '10')).toEqual({
      bar: 10
    });
  });
})