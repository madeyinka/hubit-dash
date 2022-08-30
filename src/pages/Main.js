import { Outlet } from 'react-router-dom'

const Main = () => {
    return (
        <main className="app">
            <Outlet />
        </main>
    )
}

export default Main