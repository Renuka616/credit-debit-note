import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function CreditDebitNoteList() {

    const [notes, setNotes] = useState([]);

    const navigate = useNavigate();
    const [searchInvoice, setSearchInvoice] = useState("");  
    
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);  
useEffect(() => {
    fetchCreditDebitNotes();
}, [currentPage, searchInvoice]);

    const fetchCreditDebitNotes = async () => {

    try {

        const response = await api.get(
            `credit-debit-notes/list/?page=${currentPage}&invoice=${searchInvoice}`
        );

        setNotes(response.data.results);

        setTotalPages(
            Math.ceil(response.data.count / 5)
        );

    } catch (error) {

        console.log(error);

    }

};

    const handleEdit = (id) => {
        navigate(`/credit-debit-note/${id}`);
    };
    const deleteCreditDebitNote = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) return;

    try {

        await api.delete(
            `credit-debit-notes/${id}/delete/`
        );

        alert("Record Deleted Successfully");

        fetchCreditDebitNotes();

    } catch (error) {

        console.log(error);

        alert("Unable to delete record.");

    }

};

    return (

    <div className="container mt-4">

        <div className="d-flex justify-content-between align-items-center mb-3">

            <h2>Credit / Debit Notes</h2>

            <button
                className="btn btn-primary"
                onClick={() => navigate("/credit-debit-note")}
            >
                New Credit/Debit Note
            </button>

        </div>
        <div className="row mb-3">

        <div className="col-md-4">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Invoice Number..."
                            value={searchInvoice}
                            onChange={(e) => {
                                setSearchInvoice(e.target.value);
                                setCurrentPage(1);
                            }}
                        />

                 </div>

        </div>

        <table className="table table-bordered table-striped">

            <thead className="table-dark">

                <tr>
                    <th>Invoice Number</th>
                    <th>Project</th>
                    <th>Note Type</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>

            </thead>

            <tbody>

                {notes.map((note) => (

                    <tr key={note.id}>

                        <td>{note.invoice_number}</td>
                        <td>{note.project_name}</td>
                        <td>{note.note_type}</td>
                        <td>{note.note_date}</td>

                        <td>

                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleEdit(note.id)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() => deleteCreditDebitNote(note.id)}
                            >
                                Delete
                            </button>
                            

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>
        <div className="d-flex justify-content-center align-items-center mt-3">

            <button
                className="btn btn-secondary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
            >
                Previous
            </button>

            <span className="fw-bold">
                Page {currentPage} of {totalPages}
            </span>

            <button
                className="btn btn-secondary ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
            >
                Next
            </button>

        </div>

    </div>

);
}

export default CreditDebitNoteList;