import { getPageItems } from './getPageItems'

describe('getPageItems', () => {
  it.each([
    [1, 12, [1, 2, 3, 'ellipsis', 12]],
    [2, 12, [1, 2, 3, 'ellipsis', 12]],
    [3, 12, [1, 2, 3, 4, 'ellipsis', 12]],
    [4, 12, [1, 2, 3, 4, 5, 'ellipsis', 12]],
    [6, 12, [1, 'ellipsis', 5, 6, 7, 'ellipsis', 12]],
    [11, 12, [1, 'ellipsis', 10, 11, 12]],
    [12, 12, [1, 'ellipsis', 10, 11, 12]],
  ])('page %i of %i', (current, total, expected) => {
    expect(getPageItems(current, total)).toEqual(expected)
  })

  it.each([
    [1, 1, [1]],
    [1, 2, [1, 2]],
    [2, 3, [1, 2, 3]],
    [3, 5, [1, 2, 3, 4, 5]],
  ])('shows every page when there are few (page %i of %i)', (current, total, expected) => {
    expect(getPageItems(current, total)).toEqual(expected)
  })
})
