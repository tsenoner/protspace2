import { GroupBy } from './search';
import { truncate } from './search';

describe('GroupBy function', () => {
  it('groups items by given key', () => {
    const items = [
      { category: 'fruit', name: 'apple' },
      { category: 'vegetable', name: 'carrot' },
      { category: 'fruit', name: 'banana' }
    ];

    const grouped = GroupBy(items, 'category');

    expect(grouped.size).toBe(2);
    expect(grouped.get('fruit')).toEqual([
      { category: 'fruit', name: 'apple' },
      { category: 'fruit', name: 'banana' }
    ]);
    expect(grouped.get('vegetable')).toEqual([{ category: 'vegetable', name: 'carrot' }]);
  });
});

describe('truncate function', () => {
  it('truncates a string to the specified length', () => {
    const str = 'Hello, world!';
    const result = truncate(str, 5);

    expect(result).toBe('Hell...');
  });

  it('returns the original string if it is shorter than the specified length', () => {
    const str = 'Hi!';
    const result = truncate(str, 5);

    expect(result).toBe('Hi!');
  });
});
