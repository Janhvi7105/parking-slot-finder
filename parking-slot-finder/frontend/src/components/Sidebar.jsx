import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Parking Slot Finder</h3>

      <nav>
        <ul>
          <li>
            <Link to="/user">User Dashboard</Link>
          </li>
          <li>
            <Link to="/admin">Admin Dashboard</Link>
          </li>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
