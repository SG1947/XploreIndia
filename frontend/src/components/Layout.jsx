import Header from "./Header.jsx";
import {Outlet} from "react-router-dom";
import { useState } from "react";
export default function Layout() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main>
      <Header setSearchTerm={setSearchTerm} />
      <Outlet context={{ setSearchTerm,searchTerm }} />
    </main>
  );
}
