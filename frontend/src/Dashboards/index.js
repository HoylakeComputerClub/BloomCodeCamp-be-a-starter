import React, { useEffect, useState } from 'react';
import fetcher from '../Services/fetchService';
import parseJwt from '../utils/jwtUtils';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import CodeReviewerDashboard from './CodeReviewerDashboard';



const Dashboards = (props) => {
    const [assignments, setAssignments] = useState(null);
    useEffect(() => {
        fetcher("/api/assignments", "get", props.jwt).then(assignmentsData => {
        setAssignments(assignmentsData);
       })   
    }, [props.jwt]);

    return (
        <>
            {props.jwt ? parseJwt(props.jwt)["authorities"][0] === "ROLE_ADMIN" ? <AdminDashboard jwt={props.jwt} setJwt={props.setJwt} /> : parseJwt(props.jwt)["authorities"][0] === "ROLE_REVIEWER" ? <CodeReviewerDashboard jwt={props.jwt} setJwt={props.setJwt} /> : parseJwt(props.jwt)["authorities"][0] === "ROLE_LEARNER" ? <Dashboard jwt={props.jwt} setJwt={props.setJwt} /> : <></> : <></>}
           
        </>
    )
}

export default Dashboards;