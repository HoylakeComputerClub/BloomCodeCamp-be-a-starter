import React, { useEffect, useState } from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import fetcher from '../../Services/fetchService';
import StatusBadge from '../../StatusBadge';
import parseJwt from '../../utils/jwtUtils';
import { useNavigate } from 'react-router-dom';


const Dashboard = (props) => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState(null);
    useEffect(() => {
        fetcher("/api/assignments", "get", props.jwt).then(assignmentsData => {
        setAssignments(assignmentsData);
       })   
    }, [props.jwt]);

    function createAssignment () {
        fetcher("/api/assignments", "post", props.jwt).then(assignment => {
            navigate(`/assignments/${assignment.id}`);
        });
    }

    function deleteAssignment (id) {
        const fetchData = {
            headers: {
                "Content-Type": "application/json"
            },
            method: "delete"
        }
        fetchData.headers.Authorization = `Bearer ${props.jwt}`
        fetch(`/api/assignments/${id}`, fetchData).then(() => navigate('/dashboard'));
    }
    return (
        <div className='dash'>
            <h1>{props.jwt ? parseJwt(props.jwt)["authorities"][0] === "ROLE_ADMIN" ? "Administration " : parseJwt(props.jwt)["authorities"][0] === "ROLE_REVIEWER" ? "Reviewer" : parseJwt(props.jwt)["authorities"][0] === "ROLE_LEARNER" ? "Learner" : <></> : ""} Dashboard!!!</h1>
            <p>Welcome { props.jwt ? parseJwt(props.jwt)['sub'] : <></> }</p>
            <div style={{margin: "5px"}}>
                <Button onClick={() => createAssignment()}>Submit New Assignment</Button>
                <div className='d-grid gap-5' style={{gridTemplateColumns: 'repeat(auto-fill, 340px)', marginTop: '15px'}}>
                    { assignments ? assignments.map((assignment) => {
                        return( <Card style={{ margin: '5px'}} key={assignment.id}>
                                <Card.Body style={{ display: 'flex', flexDirection: 'column', allignItems: 'center', justifyContent: 'space-between'}}>
                                    <Card.Title>{`Assignment #${assignment.number}`}</Card.Title>
                                    <Card.Subtitle style={{marginTop: '5px', marginBottm: '5px'}} className="mb-2 text-muted"><StatusBadge badgeSize="small" text={assignment.status} type="dash"></StatusBadge></Card.Subtitle>
                                    {/* <Card.Subtitle style={{marginTop: '5px', marginBottm: '5px'}} className="mb-2 text-muted"><Badge bg={assignment.status === "Completed" ? 'success' : assignment.status === "Pending Submission" ? 'warning': assignment.status === "Submitted" ? 'primary' : assignment.status === "Needs Update" ? 'danger' : 'secondary'} size='small'>{assignment.status}</Badge></Card.Subtitle> */}
                                    <Card.Subtitle>Github</Card.Subtitle>
                                    <Card.Text>
                                        {assignment.githubUrl}
                                    </Card.Text>
                                    <Card.Subtitle>Branch</Card.Subtitle>
                                    <Card.Text>
                                        {assignment.branch}
                                    </Card.Text>
                                    
                                    <Button style={{margin: '5px', width: "100%"}} onClick={() => navigate(`/assignments/${assignment.id}`)}>Edit</Button>
                                    <Button style={{margin: '5px', width: "100%"}} variant='danger' onClick={() => deleteAssignment(assignment.id)}>Delete</Button>
                                </Card.Body>
                            </Card>);
                    }): <></> }
                </div>
                <span id='submit' type='button' onClick={() => {
                    props.setJwt(null);
                    navigate('/');
                    }} >
                    Logout
                </span>
            </div>
        </div>
    )
}

export default Dashboard;