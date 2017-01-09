/*https://github.com/graphql/graphql-relay-js/
 */


import { Resource, Project } from './connectors';
import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} from 'graphql';
import { nodeDefinitions, fromGlobalId, globalIdField } from 'graphql-relay';

var { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        var { type, id } = fromGlobalId(globalId);
        if (type === 'Resource') {
            return new Promise((resolve, reject) => {
                setTimeout(() => reject('MongoDB timeout when fetching field  (timeout is 500ms)'), 500);
                Resource.findOne({ _id: id }).then((res) => resolve(res));
            })
        } else if (type === 'Project') {
            return Project.findOne({ _id: id });
        } else {
            return null;
        }
    },
    (obj) => {
        if (obj instanceof Resource) {
            return ResourceType;
        } else if (obj instanceof Project) {
            return ProjectType;
        } else {
            return null;
        }
    }
);

var ResourceType = new GraphQLObjectType({
    name: 'Resource',
    fields: () => ({
        id: globalIdField('Resource'),
        _dni: {
            type: new GraphQLNonNull(GraphQLID),
            resolve(resource) {
                return resource._dni;
            }
        },
        firstName: {
            type: GraphQLString,
            resolve(resource) {
                return resource.firstName;
            }
        },
        lastName: {
            type: GraphQLString,
            resolve(resource) {
                return resource.lastName;
            }
        }
    }),
    interfaces: [nodeInterface],
});

var ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => {
        return {
            id: {
                type: new GraphQLNonNull(GraphQLID),
                resolve(project) {
                    return project.id;
                }
            },
            title: {
                type: GraphQLString,
                resolve(project) {
                    return project.title;
                }
            },
            budget: {
                type: GraphQLInt,
                resolve(project) {
                    return project.budget;
                }
            },
            resources: {
                type: new GraphQLList(ResourceType),
                resolve(project) {
                    return Resource.find({ id: project.id });
                }
            }
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return {
            node: nodeField,
            resource: {
                type: ResourceType,
                args: {
                    _dni: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLID)
                    }
                },
                resolve: function(_, args) {
                    return Resource.findOne({ _dni: args._dni });
                }
            },
            resources: {
                type: new GraphQLList(ResourceType),
                resolve: function() {
                    return Resource.find({});
                }
            },
            projects: {
                type: new GraphQLList(ProjectType),
                resolve: function() {
                    return Project.find({});
                }
            },
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
            lastName: args.lastName,
            firstName: args.firstName
        })

        return new Promise((resolve, reject) => {
            Resource.findOneAndUpdate({ _dni: newResource._dni }, {
                _dni: args._dni,
                lastName: args.lastName,
                firstName: args.firstName
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
