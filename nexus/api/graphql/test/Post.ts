import { objectType , extendType } from "nexus";


export const Post = objectType({
    name : 'Test',//type def 할때 타입 명  즉 type 정의한거임 
    definition(t) {
        t.int('id')
        t.string('title')
        t.string('body')
        t.boolean('published')
    },
})
