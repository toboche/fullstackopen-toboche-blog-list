const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
    test('0 for 0', () => {
        const testList = []
        expect(listHelper.totalLikes(testList)).toBe(0)
    })

    test('1 for 1', () => {
        const testList = [
            {
                    title: "test title",
                    author: "noone",
                    url: "www.google.com",
                    likes: 1
            }
        ]
        expect(listHelper.totalLikes(testList)).toBe(1)
    })

    test('123 for 122 + 1', () => {
        const testList = [
            {
                    title: "test title",
                    author: "noone",
                    url: "www.google.com",
                    likes: 122
            },
            {
                title: "test title",
                author: "noone",
                url: "www.google.com",
                likes: 1
        }
        ]
        expect(listHelper.totalLikes(testList)).toBe(123)
    })
})