export interface Test {
    id : number
    title : string
    body : string
    published : boolean
}

export interface Db {
    posts : Test[]
}

export const db : Db = {
    posts : [{id:1,title:'Nexus', body : '...' , published : false }]
}