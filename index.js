const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const { buildSchema } = require('graphql')

const User = require('./models/User')
const Post = require('./models/Post')

// Création du serveur Express
const app = express()

// Connexion à la base de données
mongoose.Promise = Promise
mongoose.connect('mongodb+srv://admin:admin@cluster0.0dfnl.mongodb.net/graphql?retryWrites=true&w=majority&appName=Cluster0')


const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => console.log('status: ', db.states[db._readyState]))


// Schéma GraphQL
const schema = buildSchema(`

   type User {
    id: ID!
    username: String!
    email: String!
    followers: [User]
  }

  type Post {
    id: ID!
    title: String!
    content: String
    author: User
    likes: [User]
  }

  type Query {
    user(id: ID!): User
    users: [User]
    post(id: ID!): Post
    posts: [Post]
    userPosts(userId: ID!): [Post]
  }

  type Mutation {
    addUser(username: String!, email: String!): User
    createPost(title: String!, content: String, authorId: ID): Post
    followUser(userId: ID!, followId: ID!): User
    likePost(userId: ID!, postId: ID!): Post
  }
`);


//Résolveurs
const root = {
  // Route pour chercher un user en particulier grâce à son id
  user: async ({ id }) => {
    const user = await User.findById(id)
    return {
      ...user._doc,
      id: user._id
    }
  },

  // Route pour chercher tous les users
  users: async () => {
    const users = await User.find()
    return users.map(user => ({
      ...user._doc,
      id: user._id
    }))
  },

  // Route pour ajouter un user
  addUser: async ({ username, email }) => {
    const user = new User({
      username,
      email
    }) 
    await user.save()
    return {
      ...user._doc,
      id: user._id
    }
  },

  createPost: async ({ title, content, authorId}) => {
    const post = new Post({
      title, 
      content,
      author: authorId
    })
    await post.save()
    return {
      ...post._doc,
      id: post._id,
      author: async () => {
        return await User.findById(authorId)
      }
    }
  },

  userPosts: async ({userId}) => {
    const posts = await Post.find({ author: userId})
    return posts.map(post => ({
      ...post._doc,
      id: post._id,
      author: async () => {
        return await User.findById(post.author)
      },
      likes: async () => {
        return await User.find({ _id: { $in: post.likes } })
      }
    }))
  },

  post: async ({id}) => {
    const post = await Post.findById(id)
    return {
      ...post._doc,
      id: post._id,
      author: async () => {
        return await User.findById(post.author)
      },
      likes: async () => {
        return await User.find({ _id: { $in: post.likes } })
      }
    }
  },

  posts: async () => {
    const posts = await Post.find()
    return posts.map(post => ({
      ...post._doc,
      id: post._id,
      author: async () => {
        return await User.findById(post.author)
      },
      likes: async () => {
        return await User.find({ _id: { $in: post.likes } })
      }
    }))
  },

  likePost: async ({postId, userId}) => {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: userId } },
      { new: true }
    )
    return {
      ...post._doc,
      id: post._id,
      author: async () => {
        return await User.findById(post.author)
      },
      likes: async () => {
        return await User.find({ _id: { $in: post.likes } })
      }
    }
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

const accountsRouter = require('./routes/accounts')
app.use(express.json())
app.use('/api/accounts', accountsRouter)

// Lancement du serveur
app.listen(4000, () => console.log('Serveur GraphQL lancé sur http://localhost:4000/graphql'));




