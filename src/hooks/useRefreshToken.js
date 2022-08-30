import noAuth from './noAuth'
import useAuth from './useAuth'

const useRefreshToken = () => {
    const {setAuth} = useAuth()

    const refresh = async () => {
        const response = await noAuth.get('/auth/refresh', {
            withCredentials: true
        })
        console.log('response:', JSON.stringify(response));
        setAuth(prev => {
            //console.log(JSON.stringify(prev));
            //console.log(response?.data);
            return { ...prev, token:response.data.data.token }
        })
        return response.data.data.token
    }
    return refresh
}

export default useRefreshToken