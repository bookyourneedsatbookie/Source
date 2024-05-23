import {jwtDecode} from 'jwt-decode'
export const getTokenDetail = () => {
    try {
        const token = localStorage.getItem('token');
        const tokenData = jwtDecode(token);
        localStorage.setItem('userId', tokenData.userId)
        localStorage.setItem('userType', tokenData.userType)
        return tokenData
    }
    catch (err) {
        throw err
    }

}