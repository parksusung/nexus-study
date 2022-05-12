import { extendType, nonNull,list } from "nexus";


export const testQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('drafts',{
            type: nonNull(list('Test')),// 타입 위에 정의한걸 get하는 것
        resolve : (_root,_args,ctx) => {
            return ctx.db.posts.filter(p => p.published === false)
        }
        });
        t.field('getTruePublish',{
            type:list('Test'),
            resolve : (_root,_args,ctx) => {
                return ctx.db.posts.filter(p => p.published === true)
            }
        })
    },
})
