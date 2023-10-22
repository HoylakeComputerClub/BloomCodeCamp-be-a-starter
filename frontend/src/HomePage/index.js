import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import parseJwt from '../utils/jwtUtils';


const HomePage = (props) => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Home Page!!!</h1>
            <p>Welcome {props.jwt ? parseJwt(props.jwt)['sub'] : <></>}</p>
            {props.jwt ? <Button onClick={() => navigate('/dashboard')}>Go To your Dashboard</Button> : <Button onClick={() => navigate('/login')}>Login</Button>}
        </div>
    )
}

export default HomePage;