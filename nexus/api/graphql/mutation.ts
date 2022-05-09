import { extendType, intArg, nonNull, stringArg } from "nexus";

export const PostMutation = extendType({
    type : 'Mutation',
    definition(t){
        t.field('createDraft',{
            type : nonNull('Test'),
            args: {
                title: nonNull(stringArg()),
                body: nonNull(stringArg()),
            },
            resolve : (_root,args,ctx) => {
                const draft = {
                    id : ctx.db.posts.length + 1 , 
                    title : args.title,
                    body : args.body,
                    published:false,
                }
                ctx.db.posts.push(draft)
                return draft;
            }
        });
        t.field('publish',{
            type : 'Test',
            args : {
                draftId : nonNull(intArg())
            },
            resolve : (_root,args,ctx) =>{
                let draftToPublish = ctx.db.posts.find(p => p.id === args.draftId)

                if(!draftToPublish){
                    throw new Error(args.draftId)
                }

                draftToPublish.published = true

                return draftToPublish
            }
        })
    }
})