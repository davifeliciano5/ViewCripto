import {createBrowserRouter} from 'react-router'
import { Layout } from './pages/copoments/layout'
import {Home} from './pages/home'
import { Detail } from './pages/detail'
import { NotFound } from './pages/notFound'

const router = createBrowserRouter([
    {
        element:<Layout/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/detail/:id",
                element:<Detail/>
            },
            {
                path:"*",
                element:<NotFound/>
            }
        ]
    }
])

export {router}