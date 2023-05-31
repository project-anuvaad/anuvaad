
import { HashRouter, Switch, Route, Routes } from "react-router-dom";
// import history from "./web.history";
import Layout from "./Layout";
import AnuvaadPortal from "./ui/pages/component/AnuvaadPortal";
import Thanks from "../src/ui/pages/container/Thanks";
import UseCases from "./ui/pages/container/UseCases";

export default function App() {
  return (
  
    <HashRouter>
        
      <Routes>
       
        <Route path="/" element={<Layout component={<AnuvaadPortal />} />} />
        <Route path="/Thanks" element={<Layout component={<Thanks />} />} />
        <Route path="/useCases" element={<Layout component={<UseCases />} />} />
        
       
      </Routes>
    
    </HashRouter>
  
  );
}

