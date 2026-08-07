
import { useState, useEffect } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
function CreditDebitNote() {
const [projects, setProjects] = useState([]);  
const [addressData, setAddressData] = useState({});
const [project, setProject] = useState("");
const [noteType, setNoteType] = useState("Credit");
const [invoiceNumber, setInvoiceNumber] = useState("");
const [noteDate, setNoteDate] = useState("");
const [remarks, setRemarks] = useState("");
const [noteId, setNoteId] = useState(null);

useEffect(() => {
    fetchProjects();
}, []);

const fetchProjects = async () => {
    try {
        const response = await api.get("projects/");
        setProjects(response.data);
    } catch (error) {
        console.error(error);
    }
};  
const [items, setItems] = useState([
  {
    description: "",
    hours: "",
    rate: "",
    amount: "",
    cgst: "",
    sgst: "",
    igst: ""
  }
]);

const addRow = () => {
  setItems([
    ...items,
    {
      description: "",
      hours: "",
      rate: "",
      amount: "",
      cgst: "",
      sgst: "",
      igst: ""
    }
  ]);
};

const deleteRow = (index) => {
  if (items.length === 1) return;

  const updatedItems = items.filter((item, i) => i !== index);

  setItems(updatedItems);
};

const handleChange = (index, event) => {
  const { name, value } = event.target;

  const updatedItems = [...items];

  updatedItems[index][name] = value;

  updatedItems[index].amount =
    Number(updatedItems[index].hours || 0) *
    Number(updatedItems[index].rate || 0);

  setItems(updatedItems);
};

const getProjectDetails = async (projectId) => {
  try {
    const response = await api.get(`projects/${projectId}/`);
    setAddressData(response.data);
  } catch (error) {
    console.log(error);
  }
};
const saveCreditDebitNote = async () => {

    if (!project) {
        alert("Please select Project Name.");
        return;
    }

    if (!noteType) {
        alert("Please select Note Type.");
        return;
    }

    if (!invoiceNumber.trim()) {
        alert("Please enter Invoice Number.");
        return;
    }

    if (!noteDate) {
        alert("Please select Date.");
        return;
    }

    if (!remarks.trim()) {
        alert("Please enter Remarks.");
        return;
    }

    for (let i = 0; i < items.length; i++) {

        if (!items[i].description.trim()) {
            alert(`Please enter Description in Row ${i + 1}`);
            return;
        }

        if (!items[i].hours) {
            alert(`Please enter Hours in Row ${i + 1}`);
            return;
        }

        if (!items[i].rate) {
            alert(`Please enter Rate in Row ${i + 1}`);
            return;
        }

        if (!items[i].amount) {
            alert(`Amount is invalid in Row ${i + 1}`);
            return;
        }
    }

    const payload = {
        project,
        note_type: noteType,
        invoice_number: invoiceNumber,
        note_date: noteDate,
        remarks,
        items,
    };

    try {

        const response = await api.post(
            "credit-debit-notes/",
            payload
        );

        alert("Credit/Debit Note Saved Successfully.");

        navigate("/credit-debit-notes");

        console.log(response.data);

    } catch (error) {

        console.log(error);

        alert(JSON.stringify(error.response.data));

    }
};
const updateCreditDebitNote = async () => {

    const payload = {
        project,
        note_type: noteType,
        invoice_number: invoiceNumber,
        note_date: noteDate,
        remarks,
        items
    };

    try {

        const response = await api.put(
            `credit-debit-notes/${noteId}/`,
            payload
        );

        alert("Credit/Debit Note Updated Successfully");

        navigate("/credit-debit-notes");

        console.log(response.data);

    } catch (error) {

        console.log(error);

        alert(JSON.stringify(error.response.data));

    }

};
const { id } = useParams();
const navigate = useNavigate();
useEffect(() => {

    if (id) {
        getCreditDebitNote(id);
    }

}, [id]);
const getCreditDebitNote = async (id) => {

    try {

        const response = await api.get(
            `credit-debit-notes/${id}/`
        );

        const data = response.data;

        setNoteId(data.id);
        setProject(data.project);
        setNoteType(data.note_type);
        setInvoiceNumber(data.invoice_number);
        setNoteDate(data.note_date);
        setRemarks(data.remarks);

        setItems(data.items);

        getProjectDetails(data.project);

    } catch (error) {

        console.log(error);

    }

};
  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Credit / Debit Note
      </h2>

      <div className="card shadow p-4">

        <div className="row mb-3">

          <div className="col-md-6 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "110px" }}>
                Project Name <span className="text-danger">*</span>
            </label>
            <select
                className="form-select"
                value={project}
                onChange={(e) => {
                    setProject(e.target.value);
                    getProjectDetails(e.target.value);
                }}
            >
                <option value="">Select Project</option>

                {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.project_name}
                    </option>
                ))}
            </select>
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "120px" }}>
                Note Type <span className="text-danger">*</span>
            </label>

            <select
                className="form-select"
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
            >
                <option value="Credit">Credit Note</option>
                <option value="Debit">Debit Note</option>
            </select>
          </div>

        </div>

        <div className="row">

          <div className="col-md-6 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "110px" }}>
                Invoice Number <span className="text-danger">*</span>
            </label>

            <input
                type="text"
                className="form-control"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "120px" }}>
                Date <span className="text-danger">*</span>
            </label>

            <input
                type="date"
                className="form-control"
                value={noteDate}
                onChange={(e) => setNoteDate(e.target.value)}
            />
          </div>

        </div>

      </div>
        <hr className="my-4" />

    <h5 className="mb-3">Address Details</h5>

    <div className="row">

    {/* Bill To */}

    <div className="col-md-6">

        <h5 className="text-primary mb-3">Bill To</h5>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                Company
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.bill_to_company || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                Address
            </label>

            <textarea
                className="form-control"
                rows="2"
                value={addressData.bill_to_address || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                City
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.bill_to_city || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                State
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.bill_to_state || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                Country
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.bill_to_country || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                GSTIN
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.bill_to_gstin || ""}
                readOnly
            />
        </div>

    </div>

    {/* Ship To */}

    <div className="col-md-6">

        <h5 className="text-primary mb-3">Ship To</h5>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                Company
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.ship_to_company || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                Address
            </label>

            <textarea
                className="form-control"
                rows="2"
                value={addressData.ship_to_address || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                City
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.ship_to_city || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                State
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.ship_to_state || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                Country
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.ship_to_country || ""}
                readOnly
            />
        </div>

        <div className="mb-3 d-flex align-items-center">
            <label className="me-3 fw-bold" style={{ width: "90px" }}>
                GSTIN
            </label>

            <input
                type="text"
                className="form-control"
                value={addressData.ship_to_gstin || ""}
                readOnly
            />
        </div>

    </div>

   </div>
    
    <hr className="my-4" />

    <h5 className="mb-3">Item Details</h5>

    <div className="table-responsive">

        <table className="table table-bordered table-striped">

            <thead className="table-dark">

                <tr>
                    <th>Description</th>
                    <th>Hours</th>
                    <th>Rate</th>
                    <th>Amount</th>
                    <th>CGST (%)</th>
                    <th>SGST (%)</th>
                    <th>IGST (%)</th>
                    <th>Action</th>
                </tr>

            </thead>

            <tbody>

                {items.map((item, index) => (

                    <tr key={index}>

                    <td>
                        <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={item.description}
                        onChange={(e) => handleChange(index, e)}
                        />
                    </td>

                    <td>
                        <input
                        type="number"
                        className="form-control"
                        name="hours"
                        value={item.hours}
                        onChange={(e) => handleChange(index, e)}
                        />
                    </td>

                    <td>
                        <input
                        type="number"
                        className="form-control"
                        name="rate"
                        value={item.rate}
                        onChange={(e) => handleChange(index, e)}
                        />
                    </td>

                    <td>
                        <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={item.amount}
                        readOnly
                        />
                    </td>

                    <td>
                        <input
                        type="number"
                        className="form-control"
                        name="cgst"
                        value={item.cgst}
                        onChange={(e) => handleChange(index, e)}
                        />
                    </td>

                    <td>
                        <input
                        type="number"
                        className="form-control"
                        name="sgst"
                        value={item.sgst}
                        onChange={(e) => handleChange(index, e)}
                        />
                    </td>

                    <td>
                        <input
                        type="number"
                        className="form-control"
                        name="igst"
                        value={item.igst}
                        onChange={(e) => handleChange(index, e)}
                        />
                    </td>

                    <td className="text-nowrap">

                        <button
                        type="button"
                        className="btn btn-success btn-sm me-2"
                        onClick={addRow}
                        >
                        + Add
                        </button>

                        <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteRow(index)}
                        >
                        Delete
                        </button>

                    </td>

                    </tr>

                ))}

                </tbody>
        </table>
    </div>
    <hr className="my-4" />

        {/* Remarks */}

        <div className="mb-4">

            <label className="form-label fw-bold">
                Remarks <span className="text-danger">*</span>
            </label>
            <textarea
                className="form-control"
                rows="2"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
            />

        </div>

        {/* Buttons */}

        <div className="text-center mb-4">

            <button
                    type="button"
                    className={noteId ? "btn btn-warning me-3" : "btn btn-success me-3"}
                    onClick={noteId ? updateCreditDebitNote : saveCreditDebitNote}
                >
                    {noteId ? "Update" : "Save"}
            </button>
            <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/credit-debit-notes")}
            >
                Cancel
            </button>
        </div>
    </div>
  );
}

export default CreditDebitNote;