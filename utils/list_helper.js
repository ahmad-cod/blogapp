const dummy = (blogs) => 1

const totalLikes = blogs => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favouriteBlog = blogs => {
    return blogs.sort((a, b) => b.likes - a.likes)[0]
}

const authorWithMostBlogs = blogs => {
    const authors = blogs.map(blog => blog.author)
    
    const authorsArr = authors.reduce((acc, author) => {
        const obj = acc.find(el => el.name === author)
        if (!obj) {
            acc.push({
                name: author,
                blogs: 1
            })
        }
        else {
            obj.blogs++
        }

        return acc
    }, [])
    
    authorsArr.sort((a, b) => b.blogs - a.blogs)
    const author = authorsArr[0]

    return {
        author: author.name,
        blogs: author.blogs
    }
}

const authorWithMostLikes = blogs => {
    const authors = blogs.map(blog => {
        return { name: blog.author, likes: blog.likes }
    })
    
    const authorsArr = authors.reduce((acc, author) => {
        const obj = acc.find(el => el.name === author.name)

        if (!obj) {
            acc.push(author)
        } else {
            obj.likes += author.likes
        }
        return acc
    }, [])

    const favouriteAuthor = authorsArr.sort((a, b) => b.likes - a.likes)[0]

    return {
        author: favouriteAuthor.name,
        likes: favouriteAuthor.likes
    }
}

module.exports = { 
    dummy,
    totalLikes,
    favouriteBlog,
    authorWithMostBlogs,
    authorWithMostLikes
}