import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Col, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import fetcher from '../../Services/fetchService';
import { useLocalState } from '../../utils/useLocalStorage';


const AssignmentView = (props) => {
    const navigate = useNavigate();
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [assignment, setAssignment] = useState({ "number": "0", "githubUrl": "", "branch": "", "status": null });
    const assignmentId = window.location.href.split("/assignments/")[1];
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [assignmentStatuses, setAssignmentStatuses] = useState([]);
    const previousAssignmentValue = useRef(assignment);

    const [assignmentEnums, setAssignmentEnums] = useState([]);
    
    useEffect(() => {
        fetcher(`/api/assignments/${assignmentId}`, "get", jwt).then(assignmentResponse => {
            let assignmentData = assignmentResponse.assignment;
            if (assignmentData.branch === null) assignmentData.branch = "";
            if (assignmentData.githubUrl === null) assignmentData.githubUrl = "";
            if (assignmentData.number === null) assignmentData.number = '0';
            setAssignment(assignmentData)
            setAssignmentEnums(assignmentResponse.assignmentEnums);
            setAssignmentStatuses(assignmentResponse.assignmentStatusEnums);
        });
    }, [])

    function updateAssignment (prop, val) {
        const newAssignment = {...assignment};
        newAssignment[prop] = val;
        setAssignment(newAssignment);
    }

    useEffect(() => {
        if (previousAssignmentValue.current.status !== assignment.status) {
           persist();
        }
        previousAssignmentValue.current = assignment;
    }, [assignment])

    function saveAssignment() {
        if (assignment.status === assignmentStatuses[0].status) {
            updateAssignment("status", assignmentStatuses[1].status)
        } else {
            persist();
        }
           
    }

    function persist() {
        fetcher(`/api/assignments/${assignmentId}`, "put", jwt, assignment).then((assignmentData) => {setAssignment(assignmentData)});
    }

    return (
        <div><Row className='my-5'>
            <Col>
                <h2>
                    {assignment.number ? `Assignment ${assignment.number}` : <></>}
                </h2>
            </Col>
            <Col>
                <Badge style={{lineHeight: '1.6rem', marginTop: '5px', paddingLeft: '20px', paddingRight: '20px', fontSize: '1rem', fontWeight: '300'}}pill bg='success'>{assignment.status}</Badge>
            </Col>
        </Row>
            {assignment ? (
                <><Form.Group as={Row} className='my-5 justify-content-center'>
                <Col md='10'>
                <Form.Label>
                    Assignment
                </Form.Label>
                
                <DropdownButton id='assignmentNumber' variant='success' onSelect={(e) => {updateAssignment("number", e);}} title={assignment.number ? `Assignment ${assignment.number}` : 'Select an Assignment'}>
                    {assignmentEnums.map(assignmentEnum => <Dropdown.Item key={assignmentEnum.assignmentNumber} eventKey={assignmentEnum.assignmentNumber}>{"Assignment " + assignmentEnum.assignmentName}</Dropdown.Item>)}



                </DropdownButton>

            
                </Col>
                </Form.Group>
                <Form.Group as={Row} className='my-5 justify-content-center'>
                    <Col md='10'>
                    <Form.Label>
                        Github URL
                    </Form.Label>
                        <Form.Control type='url' id='githubUrl' onChange={(e) => {setAssignment({...assignment, "githubUrl": e.target.value});}} value={assignment.githubUrl} />
                    </Col>
                    <Col md='10'>
                    <Form.Label>
                        Branch
                    </Form.Label>
                    <Form.Control type='text' id='branch' onChange={(e) => {setAssignment({...assignment, "branch": e.target.value}); }} value={assignment.branch} />
                    </Col>
                    <Col md='10'>
                    <Button variant='success' onClick={() => {saveAssignment()}} className='m-3'>Submit Assignment</Button>
                    <Button variant='secondary' onClick={() => navigate('/dashboard')} className='m-3'>Back to Dashboard</Button>
                    </Col>
                </Form.Group>
                </> ) : (<></>)}
        </div>
    );
}

export default AssignmentView;