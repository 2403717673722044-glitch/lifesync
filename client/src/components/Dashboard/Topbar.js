import "./Topbar.css";

function Topbar() {
  return (
    <div className="topbar">

      <div>
        <h2>Dashboard</h2>
      </div>

      <div className="profile">

        <img
          src="https://i.pravatar.cc/150?img=5"
          alt="profile"
        />

        <span>Thanushya</span>

      </div>

    </div>
  );
}

export default Topbar;