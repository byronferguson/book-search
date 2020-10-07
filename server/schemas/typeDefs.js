const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    me(id: ID, username: String): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth

    # (Look into creating what's known as an input type to handle all of these parameters!)
    saveBook(
      bookId: ID!
      title: String!
      authors: [String]
      description: String!
      image: String
      link: String
    ): User

    removeBook(bookID: ID!): User
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  input BookInput {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
`;

module.exports = typeDefs;
