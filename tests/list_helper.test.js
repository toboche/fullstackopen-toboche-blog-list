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

describe('pick the most liked', () =>{
    test('pick one', () => {
        const testList = [
            {
                    title: "test title",
                    author: "noone",
                    url: "www.google.com",
                    likes: 122
            },
            {
                title: "1",
                author: "2",
                url: "www.google.com",
                likes: 1111
            }
        ]

        expect(listHelper.favoriteBlog(testList))
            .toEqual(
                {
                    title: "1",
                    author: "2",
                    likes: 1111
                  }
            )
    })

    test('pick first', () => {
        const testList = [
            {
                title: "1",
                author: "2",
                url: "www.google.com",
                likes: 1111
            },
            {
                    title: "test title",
                    author: "noone",
                    url: "www.google.com",
                    likes: 122
            }
        ]
        
        expect(listHelper.favoriteBlog(testList))
            .toEqual(
                {
                    title: "1",
                    author: "2",
                    likes: 1111
                  }
            )
    })

    test('handle empty', () => {
        expect(listHelper.favoriteBlog([]))
            .toEqual(
                undefined
            )
    })
})