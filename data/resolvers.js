/*import { Resource, Project } from './connectors';
/*
const resolveFunctions = {
  RootQuery: {
    /*project(_, { title }){
      return Project.find({ title });
    },*/
    /*fortuneCookie(){
      return FortuneCookie.getOne();
    },
    resources: () => {
      return Resource.find({});
    }

  },
  RootMutation: {
    createAuthor: (root, args) => { return Author.create(args); },
    craetePost: (root, { authorId, tags, title, text }) => {
      return Author.findOne({ where: { id: authorId } }).then( (author) => {
        console.log('found', author);
        return author.createPost( { tags: tags.join(','), title, text });
      });
    },
  },*/
  /*Resource: {
    projects(resource){
      return Resource.find({_id: resource._id});
    },
  },
  Project: {
    resources(project){
      return Project.find({_id: project._id});
    },
  },
}*/

export default resolveFunctions;
