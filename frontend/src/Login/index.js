import React, { useState } from 'react';
import { useLocalState } from '../utils/useLocalStorage';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import "./Login.css";


const Login = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [jwt, setJwt] = useLocalState("", "jwt");
    function sendLoginRequest () {
    
     const reqBody = {"username": username, "password": password};

      fetch("api/auth/login",{"headers": { "Content-Type": "application/json"}, 
      method: "post", body: JSON.stringify(reqBody)}).then((res) => {
        if (res.status === 200) {
            return Promise.all([res, res.headers]);
        } else {
            return Promise.reject("Invalid Login Attempt!");
        }
    })
      .then(([body, headers]) => {
        setJwt(headers.get("authorization"));
        window.location.href = "/dashboard";
      })
      .catch((message) => alert(message));
    }
    return (
        <>
            <Container>
                <h1>Login Page!!!</h1>
                <p>{props.jwt}</p>
                <Row className='d-flex h-100 justify-content-center align-items-center'>
                    <Col md='6' lg='8'>
                        <Form.Group>
                            <Form.Group className="formItem">
                                <Form.Label htmlFor='username' classname='fs-4'>Username</Form.Label>
                                <Form.Control type='email' id='username' placeholder='Enter Your Username here...' value={username} onChange={(e) => setUsername(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="formItem">
                                <Form.Label htmlFor='password'>Password</Form.Label>
                                <Form.Control type='password' id='password' placeholder='Enter Your Password here...' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                        </Form.Group>
                        <Row>
                            <Col className='mt-2 gap-2 d-flex flex-column flex-md-row justify-content-between'>
                            <Button className="formItem" id='submit' type='button' onClick={() => sendLoginRequest()} >
                                    Login
                            </Button>
                            <Button className="formItem" variant='secondary' id='submit' type='button' onClick={() => window.location.href = '/'} >
                                Exit
                            </Button>
                            </Col>
                        </Row> 
                    </Col>
                </Row>

            </Container>
        </>
    )
}

export default Login;