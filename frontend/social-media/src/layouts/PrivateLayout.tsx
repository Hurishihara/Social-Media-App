import { Outlet } from 'react-router'

export const PrivateLayout = () => {
    
    return (
        <div>
            <Outlet />
        </div>
    )
}