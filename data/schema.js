/*const typeDefinitions = `
#type Project {
# _id: Int! # the ! means that every author object _must_ have an id
# title: String
# contractor: String
# budget: Int
# resources: [Resource] # the list of Resources by this project
#}
 ids? CRUD?
*/


import { Resource, Project } from './connectors';
import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} from 'graphql';

var ResourceType = new GraphQLObjectType({
    name: 'Resource',
    fields: {
        _dni: {
            type: new GraphQLNonNull(GraphQLString)
        },
        firstName: {
            type: GraphQLString
        },
        lastName: {
            type: GraphQLString
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return {
            resource: {
                type: ResourceType,
                args: {
                    _dni: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function(_, args) {
                    return Resource.findOne({ _dni: args._dni });
                }
            },
            resources: {
                type: new GraphQLList(ResourceType),
                resolve: function(_, args) {
                    return Resource.find({});
                }
            }
        }
    }
});

var MutationAdd = {
    type: ResourceType,
    description: 'Add a Resource',
    args: {
        _dni: {
            name: 'DNI or any kind of ID',
            type: new GraphQLNonNull(GraphQLString)
        },
        firstName: {
            name: 'First Name',
            type: GraphQLString
        },
        lastName: {
            name: 'Last Name',
            type: GraphQLString
        }
    },
    resolve: (root, args) => {
        var newResource = new Resource({
                _dni: args._dni,
                lastName: args.firstName,
                firstName: args.lastName
            })

        return new Promise((resolve, reject) => {
            Resource.findOneAndUpdate({ _dni: newResource._dni }, {
                _dni: args._dni,
                lastName: args.firstName,
                firstName: args.lastName
            }, { upsert: true }, function(err) {
                if (err) reject(err)
                else resolve(newResource)
            })
        })
    }
}

var MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        add: MutationAdd
    }
});


module.exports = new GraphQLSchema({
    query: queryType,
    mutation: MutationType
});
