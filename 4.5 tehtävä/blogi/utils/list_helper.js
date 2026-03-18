export const dummy = (blogs) => 1
export const totallikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
export const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

  return blogs.reduce((favorite, current) => {
    return current.likes > favorite.likes ? current : favorite
  })
}