import { Badge } from "react-bootstrap";

const StatusBadge = (props) => {
    const { badgeSize, text, type } = props;
    // className="mb-2 text-muted" ?? maybe??

    function getBadgeColour() {
        if (text === "Completed")
            return "success";
        else if (text === "Pending Submission")
            return "warning";
        else if (text === "In Review")
            return "secondary";
        else if (text === "Submitted")
            return "primary";
        else if (text === "Resubmitted")
            return "info";
        else if (text === "Needs Update")
            return "danger";
    }

    function getBadgeType() {
        if (type !== "dash")
            return {lineHeight: '1.6rem', marginTop: '5px', marginLeft: '450px', paddingLeft: '20px', paddingRight: '20px', fontSize: '1rem', fontWeight: '300'};
        else
            return { paddingLeft: '20px', paddingRight: '20px', marginBottom: '5px' };
    }

    const badgeColour = getBadgeColour();

    return (

        <Badge bg={badgeColour} style={getBadgeType()} pill size={badgeSize}>{text}</Badge>
    )
} 

export default StatusBadge;