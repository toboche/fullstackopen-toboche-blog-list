var _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    return blogs.map(it => it.likes)
        .reduce ((acc, value) => acc + value, 0)
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0){
        return undefined
    }
    const item =  blogs.sort((a,b) => b.likes - a.likes)
        [0]
        return {
            title: item.title,
            author: item.author,
            likes: item.likes
        }
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0){
        return undefined
    }
    const reducer = (acc, value) =>{
        const author = value.author
        const current = acc.get(author)
        if(current === undefined){
            acc.set(author, 1)
        }else {
            acc.set(author, current + 1)
        }
        return acc
    }

    const reduced = blogs.reduce(
        reducer,
        new Map()
    )

    reduced[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    }

    var max = null
    for (let [key, value] of reduced) {
        max = {
            author:key,
            blog: value
        }
    }
    return max
}

const mostLikes = (blogs) => {
    if(blogs.length === 0){
        return undefined
    }
    const reducer = (acc, value) =>{
        const author = value.author
        const current = acc.get(author)
        const likes = value.likes
        if(current === undefined){
            acc.set(author, likes)
        }else {
            acc.set(author, current + likes)
        }
        return acc
    }

    const reduced = blogs.reduce(
        reducer,
        new Map()
    )

    reduced[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    }

    var max = null
    for (let [key, value] of reduced) {
        max = {
            author:key,
            blog: value
        }
    }
    return max
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }