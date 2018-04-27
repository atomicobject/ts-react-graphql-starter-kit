import * as React from "react";
import { Link } from "react-router-dom";

require("./styles.scss");
export function AppHeader() {
  return (
    <div className="app-header">
      <h1 className="app-title">Munchit</h1>
      <ul className="app-nav">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add-snack">Add Snack</Link>
        </li>
      </ul>
    </div>
  );
}

export function AppShell(props: { children: JSX.Element }) {
  const { children } = props;
  return (
    <div className="app">
      <AppHeader />
      {children}
    </div>
  );
}
