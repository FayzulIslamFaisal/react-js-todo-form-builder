import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import TodoList from './pages/TodoList/TodoList';
import FormBuilder from './pages/FormBuilder/FormBuilder';
import FormPreview from './pages/FormPreview/FormPreview';
import FormsList from './pages/FormsList/FormsList';
import Home from './pages/Home/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/todos"        element={<TodoList />} />
        <Route path="/forms"        element={<FormsList />} />
        <Route path="/form-builder" element={<FormBuilder />} />
        <Route path="/form-preview" element={<FormPreview />} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
