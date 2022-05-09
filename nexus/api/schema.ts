import { makeSchema } from "nexus";
import { join } from 'path'
import * as types from './graphql'

export const schema = makeSchema({
    types : types,
    outputs : {
        typegen : join(__dirname, '..','nexus-typegen.ts'),//스키마선언 아티팩트를 저장할위치
        schema : join(__dirname,'..','schema.graphql'), // typescript 스키마 정의 아티팩트를 저장할 위치 
    },
    contextType : {
        module : join(__dirname,'./context.ts'),
        export : "Context",
    }
})