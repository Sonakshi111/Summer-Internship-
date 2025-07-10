type Student = {
  name: string;
  college: string;
  uniqueId: string;
};

const selectedStudents: Student[] = [
  { name: "Ananya Sharma", college: "XYZ College", uniqueId: "SINT1001" },
  { name: "Ravi Mehta", college: "ABC Institute", uniqueId: "SINT1002" },
  { name: "Priya Patel", college: "LMN University", uniqueId: "SINT1003" },
];

function SelectedList() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Selected Students List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">College</th>
              <th className="border p-2">Unique ID</th>
            </tr>
          </thead>
          <tbody>
            {selectedStudents.map((student, index) => (
              <tr key={index} className="text-center hover:bg-gray-100">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.college}</td>
                <td className="border p-2 font-mono text-sm">{student.uniqueId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SelectedList;
