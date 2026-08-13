import "./Statistics.css";

function Statistics() {
  return (
    <section className="statistics">

      <h2>Trusted by Thousands</h2>

      <div className="stats-container">

        <div className="stat-card">
          <h1>10K+</h1>
          <p>Active Users</p>
        </div>

        <div className="stat-card">
          <h1>50K+</h1>
          <p>Tasks Completed</p>
        </div>

        <div className="stat-card">
          <h1>20K+</h1>
          <p>Expenses Managed</p>
        </div>

        <div className="stat-card">
          <h1>99%</h1>
          <p>User Satisfaction</p>
        </div>

      </div>

    </section>
  );
}

export default Statistics;