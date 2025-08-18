import { useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "black",
        padding: "0 20px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        height: "70px"
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>STC Summer Training Admin Panel</h1>
      
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontWeight: 500 }}>
            Welcome, {user.name || 'Admin'}
          </span>
          <button 
            onClick={handleLogout}
            style={{
              background: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
