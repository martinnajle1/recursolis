const typeDefinitions = `
#type Project {
# _id: Int! # the ! means that every author object _must_ have an id
# title: String
# contractor: String
# budget: Int
# resources: [Resource] # the list of Resources by this project
#}

type Resource {
  _dni: String!
  firstName: String
  lastName: String
}

# the schema allows the following two queries:
type RootQuery {
  resources: [Resource]
  fortuneCookie: String
}

# this schema allows the following two mutations:
#type RootMutation {
#  createAuthor(
#    firstName: String!
#    lastName: String!
#  ): Author
#  createPost(
#    tags: [String!]!
#    title: String!
#    text: String!
#    authorId: Int!
#  ): Post
#}

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: RootQuery
}
`;

export default [typeDefinitions];
