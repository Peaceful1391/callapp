import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'

import App from './App'
import Chart from './Chart'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/chart",
    element: <Chart/>
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RouterProvider router={router} />
)
