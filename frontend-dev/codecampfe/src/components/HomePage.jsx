import { useNavigate } from 'react-router-dom'
import parseJwt from '../utils/jwtUtils'

const HomePage = (props) => {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            <h1>Bloom Code Camp Home Page</h1>
            {props.jwt ? <h2>Welcome {parseJwt(props.jwt)['sub']}</h2> : <></>}
        </div>
    )
}
export default HomePage