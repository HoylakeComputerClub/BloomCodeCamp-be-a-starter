import './App.css';
import { useLocalState } from './utils/useLocalStorage';
import { Route, Routes } from 'react-router-dom';
import parseJwt from './utils/jwtUtils';
import Dashboards from './Dashboards';
import HomePage from './HomePage';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import AssignmentView from './AssignmentViews/AssignmentView';
import AdminAssignmentView from './AssignmentViews/AdminAssignmentView';
import CodeReviewerAssignmentView from './AssignmentViews/CodeReviewerAssignmentView';
import LearnerAssignmentView from './AssignmentViews/LearnerAssignmentView';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [jwt, setJwt] = useLocalState("", "jwt");

  return (
    <div className="App">
      <Routes>
    
        <Route path="/dashboard" element={<PrivateRoute><Dashboards jwt={jwt} setJwt={setJwt} /></PrivateRoute>}/>
        <Route path='/assignments/:id' element={<PrivateRoute>{jwt ? parseJwt(jwt)["authorities"][0] === "ROLE_ADMIN" ? <AdminAssignmentView jwt={jwt} setJwt={setJwt} /> : parseJwt(jwt)["authorities"][0] === "ROLE_REVIEWER" ? <CodeReviewerAssignmentView jwt={jwt} setJwt={setJwt} /> : parseJwt(jwt)["authorities"][0] === "ROLE_LEARNER" ? <LearnerAssignmentView jwt={jwt} setJwt={setJwt} /> : <AssignmentView jwt={jwt} setJwt={setJwt} /> : <AssignmentView jwt={jwt} setJwt={setJwt} />}</PrivateRoute>} />
        <Route path="/login" element={<Login jwt={jwt} setJwt={setJwt} />} />
        <Route path="/" element={<HomePage jwt={jwt} setJwt={setJwt} />} />

      </Routes>
      </div>


  );
}

export default App;
