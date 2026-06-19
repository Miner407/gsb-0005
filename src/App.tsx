import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TicketDetail from "@/pages/TicketDetail";
import NewTicket from "@/pages/NewTicket";
import EditTicket from "@/pages/EditTicket";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tickets/new" element={<NewTicket />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="/tickets/:id/edit" element={<EditTicket />} />
      </Routes>
    </Router>
  );
}
