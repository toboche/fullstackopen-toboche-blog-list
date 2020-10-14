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

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }