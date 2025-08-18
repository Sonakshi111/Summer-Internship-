import "./ActivityTable.css";

function ActivityTable() {
  const activities = [
    { activity: "Added Student", by: "Admin Y", date: "6 June 2025" },
    { activity: "Created Batch", by: "Admin X", date: "5 June 2025" },
    { activity: "Generated Report", by: "Admin X", date: "4 July 2025" },
    { activity: "Updated Project List", by: "Admin Z", date: "10 Aug 2025" },
    { activity: "Deleted Student", by: "Admin Y", date: "12 Aug 2025" },
  ];

  return (
    <section className="activity">
      <h2>Recent Activity</h2>
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.activity}</td>
              <td>{activity.by}</td>
              <td>{activity.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ActivityTable;
