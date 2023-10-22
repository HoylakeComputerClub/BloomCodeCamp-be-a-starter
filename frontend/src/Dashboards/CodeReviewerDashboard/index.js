import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import fetcher from '../../Services/fetchService';
import StatusBadge from '../../StatusBadge';
import parseJwt from '../../utils/jwtUtils';
import { useNavigate } from 'react-router-dom';


const CodeReviewerDashboard = (props) => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState(null);
    useEffect(() => {
        fetcher("/api/assignments", "get", props.jwt).then(assignmentsData => {
        setAssignments(assignmentsData);
       })   
    }, [props.jwt]);

    function createAssignment () {
        fetcher("/api/assignments", "post", props.jwt).then(assignment => {
            navigate `/assignments/${assignment.id}`;
        });
    }

    function claimAssignment(assignment) {
        const decodedJwt = parseJwt(props.jwt);
        const user = {
            id: null,
            username: decodedJwt['sub'],
            authorities: decodedJwt['authorities']
        };
        assignment.codeReviewer = user;
        assignment.status = "In Review";
        fetcher(`/api/assignments/${assignment.id}`, "put", props.jwt, assignment).then(updatedAssignment => {
            //TODO: update the view for the assignment that changed
            const assignmentsCopy = [...assignments];
            const i = assignmentsCopy.findIndex(a => a.id === assignment.id);
            assignmentsCopy[i] = updatedAssignment;
            setAssignments(assignmentsCopy);
        })
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

    function editReview (assignment) {
        navigate(`/assignments/${assignment.id}`);
    }
    return (
        <div className='dash'>
            <h1>{props.jwt ? parseJwt(props.jwt)["authorities"][0] === "ROLE_ADMIN" ? "Administration " : parseJwt(props.jwt)["authorities"][0] === "ROLE_REVIEWER" ? "Reviewer" : parseJwt(props.jwt)["authorities"][0] === "ROLE_LEARNER" ? "Learner" : <></> : ""} Dashboard!!!</h1>
            <p>Welcome { props.jwt ? parseJwt(props.jwt)['sub'] : <></> }</p>
            <div style={{margin: "5px"}}>
            <div className='assignment-wrapper in-review'>
                <h2><span>In Review</span></h2>
                <div className='d-grid gap-5' style={{gridTemplateColumns: 'repeat(auto-fill, 340px)', marginTop: '15px'}}>
                    { assignments && assignments.filter(assignment => assignment.status === "In Review").length > 0 ? assignments.filter(assignment => assignment.status === "In Review").map((assignment) => {
                        return( <Card style={{ margin: '5px'}} key={assignment.id}>
                                <Card.Body style={{ display: 'flex', flexDirection: 'column', allignItems: 'center', justifyContent: 'space-between'}}>
                                    <Card.Title>{`Assignment #${assignment.number}`}</Card.Title>
                                    <Card.Subtitle style={{marginTop: '5px', marginBottm: '5px'}} className="mb-2 text-muted"><StatusBadge  badgeSize="small" text={assignment.status} type="dash"></StatusBadge></Card.Subtitle>
                                    <Card.Subtitle>Github</Card.Subtitle>
                                    <Card.Text>
                                        {assignment.githubUrl}
                                    </Card.Text>
                                    <Card.Subtitle>Branch</Card.Subtitle>
                                    <Card.Text>
                                        {assignment.branch}
                                    </Card.Text>
                                    <Button style={{margin: '5px', width: "100%"}} onClick={() => editReview(assignment)}>Review Assignment</Button>
                                    {/* <Button style={{margin: '5px', width: "100%"}} variant='danger' onClick={() => deleteAssignment(assignment.id)}>Flag For Update</Button> */}
                                </Card.Body>
                            </Card>);
                    }): <>No Assignments Found</> }
                </div>
            </div>
            <div className='assignment-wrapper submitted'>
                <h2><span>Awaiting Review</span></h2>
            <div className='d-grid gap-5' style={{gridTemplateColumns: 'repeat(auto-fill, 340px)', marginTop: '15px'}}>
                    { assignments && ((assignments.filter(assignment => assignment.status === "Submitted").length > 0) ||(assignments.filter(assignment => assignment.status === "Resubmitted").length > 0))  ? assignments.filter(assignment => assignment.status === "Submitted" || assignment.status === "Resubmitted").sort((a, b) => {
                        if (a.status === "Resubmitted")
                            return -1;
                        else
                            return 1;
                    }).map((assignment) => {
                        return( <Card style={{ margin: '5px'}} key={assignment.id}>
                                <Card.Body style={{ display: 'flex', flexDirection: 'column', allignItems: 'center', justifyContent: 'space-between'}}>
                                    <Card.Title>{`Assignment #${assignment.number}`}</Card.Title>
                                    <Card.Subtitle style={{marginTop: '5px', marginBottm: '5px'}} className="mb-2 text-muted"><StatusBadge  badgeSize="small" text={assignment.status} type="dash"></StatusBadge></Card.Subtitle>
                                    <Card.Subtitle>Github</Card.Subtitle>
                                    <Card.Text>
                                        {assignment.githubUrl}
                                    </Card.Text>
                                    <Card.Subtitle>Branch</Card.Subtitle>
                                    <Card.Text>
                                        {assignment.branch}
                                    </Card.Text>
                                    <Button style={{margin: '5px', width: "100%"}} onClick={() => claimAssignment(assignment)}>Claim</Button>
                                    {/* <Button style={{margin: '5px', width: "100%"}} variant='danger' onClick={() => deleteAssignment(assignment.id)}>Delete</Button> */}
                                </Card.Body>
                            </Card>);
                    }): <>No Assignments Found</> }
                </div>
            </div>
            <div className='assignment-wrapper needs-update'>
                <h2><span>Needs Update</span></h2>
                <div className='d-grid gap-5' style={{gridTemplateColumns: 'repeat(auto-fill, 340px)', marginTop: '15px'}}>
                    { assignments && assignments.filter(assignment => assignment.status === "Needs Update").length > 0 ? assignments.filter(assignment => assignment.status === "Needs Update").map((assignment) => {
                        return( <Card style={{ margin: '5px'}} key={assignment.id}>
                                <Card.Body style={{ display: 'flex', flexDirection: 'column', allignItems: 'center', justifyContent: 'space-between'}}>
                                    <Card.Title>{`Assignment #${assignment.number}`}</Card.Title>
                                    {/* <Card.Subtitle style={{marginTop: '5px', marginBottm: '5px'}} className="mb-2 text-muted"><Badge bg="danger" size='small'>{assignment.status}</Badge></Card.Subtitle> */}
                                    <Card.Subtitle style={{marginTop: '5px', marginBottm: '5px'}} className="mb-2 text-muted"><StatusBadge  badgeSize="small" text={assignment.status} type="dash"></StatusBadge></Card.Subtitle>
                                    <Card.Subtitle>Github</Card.Subtitle>
                                    <Card.Text>
                                        {assignment.githubUrl}
                                    </Card.Text>
                                    <Card.Subtitle>Branch</Card.Subtitle>
                                    <Card.Text>
                                        {assignment.branch}
                                    </Card.Text>
                                    <Button style={{margin: '5px', width: "100%"}} onClick={() => navigate(`/assignments/${assignment.id}`)}>View</Button>
                                    {/* <Button style={{margin: '5px', width: "100%"}} variant='danger' onClick={() => deleteAssignment(assignment.id)}>Delete</Button> */}
                                </Card.Body>
                            </Card>);
                    }): <>No Assignments Found</> }
                </div>
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

export default CodeReviewerDashboard;