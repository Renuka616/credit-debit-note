import { BrowserRouter, Routes, Route } from "react-router-dom";

import CreditDebitNote from "./pages/CreditDebitNote";
import CreditDebitNoteList from "./pages/CreditDebitNoteList";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<CreditDebitNoteList />}
                />

                <Route
                    path="/credit-debit-note"
                    element={<CreditDebitNote />}
                />

                <Route
                    path="/credit-debit-note/:id"
                    element={<CreditDebitNote />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;