import {http} from './app'

// const PORT = process.env.PORT || 4000
const PORT = 4000
http.listen(PORT, () => {
    console.log(`🚀 GraphQL service ready at http://localhost:${PORT}/graphql`)
})

