const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Connexion à la base de données
const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connect('mongodb+srv://admin:admin@cluster0.0dfnl.mongodb.net/graphql?retryWrites=true&w=majority&appName=Cluster0')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => console.log('status: ', db.states[db._readyState]))


// Schéma GraphQL
const schema = buildSchema(`
  type Query {
    user(id: ID!): User
    usersByName(name: String!): [User]
    post(id: ID!): Post
    posts: [Post]
  }

  type Mutation {
    addPost(
      title: String!, 
      content: String!, 
      authorId: ID!
    ): Post
    addUser(
      name: String!,
      email: String!,
      posts: [PostInput]
    ): User
    addComment( 
      content: String!, 
      authorId: ID!
    ): Comment
  }

  input PostInput {
    title: String!
    content: String!
    authorId: ID!
  }

  type User {
    id: ID!
    name: String
    email: String
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String
    content: String
    author: User
    comments: [Comment]
  }

  type Comment {
    id: ID!
    content: String
    author: User
  }
`);

//Données simulées
const users = [
  { id: "0", name: 'Alice', email: 'alice@example.com' },
  { id: "1", name: 'Bob', email: 'bob@example.com' }
];

const posts = [
  { id: "0", title: 'Alice', content: 'contenu pour alice', author: "0" },
];

const comments = [
  { id: "0", content: 'très joli !', author: "1" },
];

//Résolveurs

const root = {
  // Route pour chercher un user en particulier grâce à son id
  user: ({ id }) => {
    const user = users.find(user => user.id === id);
    if (user) {
      user.posts = posts.filter(post => post.author === user.id);
    }
    return user;
  },

  // Route pour trouver un user en particulier grâce à son nom
  usersByName: ({ name }) => {
    return users.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
  },

  // Route pour trouver un poste en particulier grâce à son id
  post: ({ id }) => {
    const post = posts.find(post => post.id === id);
    if (post) {
      post.author = users.find(user => user.id === post.author);
    }
    return post;
  },

  // Route pour récupérer tous les postes d'un utilisateur en particulier grâce à son id
  posts: () => {
    return posts.map(post => {
      return {
        ...post,
        author: users.find(user => user.id === post.author)
      };
    });
  },

  // Route pour ajouter un user
  addUser: ({ name, email }) => {
    const newUser = { id: String(users.length + 1), name, email };
    users.push(newUser);
    return newUser;
  },

   // Route pour ajouter un post
  addPost: ({ title, content, authorId }) => {
    const newPost = { id: String(posts.length + 1), title, content, author: authorId };
    posts.push(newPost);
    return newPost;
  },
   // Route pour ajouter un comment
  addComment: ({ content, authorId }) => {
    const newComment = { id: String(posts.length + 1), content, author: authorId };
    comments.push(newComment);
    return newComment;
  }
};

// Création du serveur Express
const app = express();
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




