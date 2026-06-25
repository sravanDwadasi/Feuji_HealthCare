import { useEffect, useState } from "react";
import axios from "axios";

function ProviderPage() {

    const [requests, setRequests] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        patientName: "",
        insuranceId: "",
        diagnosisCode: "",
        procedureCode: "",
        clinicalNotes: ""
    });

    const loadRequests = async () => {

        const response =
            await axios.get(
                "http://localhost:8081/provider/requests"
            );

        setRequests(response.data);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const createRequest = async () => {

        await axios.post(
            "http://localhost:8081/provider/requests",
            form
        );

        loadRequests();

        setForm({
            patientName: "",
            insuranceId: "",
            diagnosisCode: "",
            procedureCode: "",
            clinicalNotes: ""
        });
    };

    const updateRequest = async () => {

        await axios.put(
            `http://localhost:8081/provider/requests/${editId}`,
            form
        );

        setEditId(null);

        loadRequests();

        setForm({
            patientName: "",
            insuranceId: "",
            diagnosisCode: "",
            procedureCode: "",
            clinicalNotes: ""
        });
    };

    const reviewRequest = async (id) => {

        await axios.post(
            `http://localhost:8081/provider/requests/${id}/review`
        );

        loadRequests();
    };

    const submitRequest = async (id) => {

        await axios.post(
            `http://localhost:8081/provider/requests/${id}/submit`
        );

        loadRequests();
    };

    return (
        <div className="container mt-4">

            <h2>Provider Dashboard</h2>

            <input
                className="form-control mb-2"
                placeholder="Patient Name"
                value={form.patientName}
                onChange={(e) =>
                    setForm({
                        ...form,
                        patientName: e.target.value
                    })
                }
            />

            <input
                className="form-control mb-2"
                placeholder="Insurance Id"
                value={form.insuranceId}
                onChange={(e) =>
                    setForm({
                        ...form,
                        insuranceId: e.target.value
                    })
                }
            />

            <input
                className="form-control mb-2"
                placeholder="Diagnosis Code"
                value={form.diagnosisCode}
                onChange={(e) =>
                    setForm({
                        ...form,
                        diagnosisCode: e.target.value
                    })
                }
            />

            <input
                className="form-control mb-2"
                placeholder="Procedure Code"
                value={form.procedureCode}
                onChange={(e) =>
                    setForm({
                        ...form,
                        procedureCode: e.target.value
                    })
                }
            />

            <textarea
                className="form-control mb-2"
                placeholder="Clinical Notes"
                rows="4"
                value={form.clinicalNotes}
                onChange={(e) =>
                    setForm({
                        ...form,
                        clinicalNotes: e.target.value
                    })
                }
            />

            <button
                className="btn btn-primary mb-4"
                onClick={() => {

                    if (editId) {

                        updateRequest();

                    } else {

                        createRequest();
                    }
                }}
            >

                {editId
                    ? "Update Request"
                    : "Create Request"}

            </button>

            <table className="table table-bordered align-middle">

                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Status</th>
                        <th style={{ width: "45%" }}>
                            AI Recommendation
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {requests.map((request) => (

                        <tr key={request.id}>

                            <td>{request.id}</td>

                            <td>{request.patientName}</td>

                            <td>
                                <strong>{request.status}</strong>
                            </td>

                            <td style={{ minWidth: "450px" }}>
                                <div
                                    className="border rounded p-2 bg-light"
                                    style={{
                                        whiteSpace: "pre-wrap",
                                        maxHeight: "250px",
                                        overflowY: "auto",
                                        fontSize: "14px"
                                    }}
                                >
                                    {request.aiRecommendation || "No AI Review yet"}
                                </div>
                            </td>

                            <td>

                                <button
                                    className="btn btn-warning btn-sm me-2 mb-1"
                                    disabled={
                                        request.status === "SUBMITTED" ||
                                        request.status === "REJECTED" ||
                                        request.status === "APPROVED"
                                    }
                                    onClick={() =>
                                        reviewRequest(request.id)
                                    }
                                >
                                    AI Review
                                </button>

                                <button
                                    className="btn btn-info btn-sm me-2 mb-1"
                                    disabled={
                                        request.status === "SUBMITTED" ||
                                        request.status === "APPROVED"
                                    }
                                    onClick={() => {

                                        setEditId(request.id);

                                        setForm({

                                            patientName:
                                                request.patientName,

                                            insuranceId:
                                                request.insuranceId,

                                            diagnosisCode:
                                                request.diagnosisCode,

                                            procedureCode:
                                                request.procedureCode,

                                            clinicalNotes:
                                                request.clinicalNotes
                                        });
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-success btn-sm mb-1"
                                    disabled={
                                        request.status === "SUBMITTED" ||
                                        request.status === "REJECTED" ||
                                        request.status === "APPROVED"
                                    }
                                    onClick={() =>
                                        submitRequest(request.id)
                                    }
                                >
                                    Submit
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default ProviderPage;