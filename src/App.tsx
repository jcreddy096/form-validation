
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormBuilder from "./pages/FormPage";
import EditFormPage from "./pages/EditFormPage";
import FormDetailsPage from './pages/FormDetailsPage';
import PathPage from "./pages/PathPage";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
    <Header title="Form Builder"/>
      <Routes>
        
        <Route path="/" element={<FormBuilder />} />
        <Route path="/form-details" element={<FormDetailsPage />} />
    
        <Route path="/edit/:id" element={<EditFormPage />} /> 
        
      
        <Route path="/:path" element={<PathPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;