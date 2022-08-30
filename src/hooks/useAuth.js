import { useContext } from 'react'
import { GlobalContext } from '../context/Provider'

const useAuth = () => {
    return useContext(GlobalContext)
}

export default useAuth