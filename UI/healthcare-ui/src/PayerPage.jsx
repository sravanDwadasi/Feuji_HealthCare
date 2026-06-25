import { useEffect, useState } from "react";
import axios from "axios";

function PayerPage() {

    const [requests, setRequests] = useState([]);

    const loadRequests = async () => {

        const response =
            await axios.get(
                "http://localhost:8083/payer/requests"
            );

        setRequests(response.data);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const approveRequest = async (id) => {

        await axios.put(
            `http://localhost:8083/payer/requests/${id}/approve`
        );

        loadRequests();
    };

    const rejectRequest = async (id) => {

        const comments =
            prompt("Enter rejection reason");

        if (!comments) return;

        await axios.put(
            `http://localhost:8083/payer/requests/${id}/reject`,
            {
                comments: comments
            }
        );

        loadRequests();
    };

    return (
        <div className="container mt-4">

            <h2>Payer Dashboard</h2>

            <table className="table table-bordered">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Provider Request</th>
                        <th>Patient</th>
                        <th>Status</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {requests.map((request) => (

                        <tr key={request.id}>

                            <td>{request.id}</td>

                            <td>
                                {request.providerRequestId}
                            </td>

                            <td>
                                {request.patientName}
                            </td>

                            <td>
                                {request.status}
                            </td>

                            <td>
                                {request.comments}
                            </td>

                            <td>

                                <button
                                    className="btn btn-success btn-sm me-2"
                                    disabled={
                                        request.status === "APPROVED" ||
                                        request.status === "REJECTED"
                                    }
                                    onClick={() =>
                                        approveRequest(request.id)
                                    }
                                >
                                    Approve
                                </button>

                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    disabled={
                                        request.status === "APPROVED" ||
                                        request.status === "REJECTED"
                                    }
                                    onClick={() =>
                                        rejectRequest(request.id)
                                    }
                                >
                                    Reject
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default PayerPage;