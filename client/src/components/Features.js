import "./Features.css";

function Features() {
  const features = [
    {
      title: "💰 Expense Tracker",
      description: "Track your daily income and expenses with beautiful charts."
    },
    {
      title: "📅 Calendar",
      description: "Manage events, reminders, and schedules efficiently."
    },
    {
      title: "✅ Habit Tracker",
      description: "Build positive habits and monitor your daily progress."
    },
    {
      title: "📝 Notes",
      description: "Store important notes and organize your ideas."
    },
    {
      title: "❤️ Health Records",
      description: "Maintain your medical history and health information."
    },
    {
      title: "🤖 AI Planner",
      description: "Generate smart daily plans with AI assistance."
    }
  ];

  return (
    <section className="features">

      <h2>Our Features</h2>

      <p className="subtitle">
        Everything you need to manage your life in one place.
      </p>

      <div className="feature-grid">

        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default Features;