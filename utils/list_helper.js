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
    console.log(reduced);

    reduced[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    }

    var max = null
    for (let [key, value] of reduced) {     // get data sorted
        max = {
            author:key,
            blog: value
        }
    }
    // console.log('max');
    // const ordered = {...reduced}
    // console.log(ordered);
    // console.log(ordered[0]);

    // reduced.map(it=> it[0])

    // const max = reduced
    //     .sort((a,b) => a[0] - b[0])
    //     [0]
    return max
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }