import React, { useState } from "react";
import NotelogNavbar from "../Header/NotelogNavbar/NotelogNavbar";
const courses = [
  { id: 1, title: "Sample", date: "2025-09-01", desc: "Learn fundamentals of React." },
  { id: 2, title: "Cards", date: "2025-09-10", desc: "Dive deeper into hooks & context." },
  { id: 3, title: "For", date: "2025-08-20", desc: "Style apps faster with Tailwind." },
  { id: 4, title: "Notelogs", date: "2025-09-05", desc: "Backend development basics." },
];

export default function Dashboard() {
  const [filterDate, setFilterDate] = useState("");

  // Filter courses by date
  const filtered = filterDate
    ? courses.filter((c) => c.date >= filterDate)
    : courses;

  return (
    <>
    <NotelogNavbar />
    <div className="min-h-screen bg-[#0d1117] text-white pt-20 px-12">
      {/* Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Previous Notes</h1>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 rounded-md bg-[#171717] text-white border border-gray-600 cursor-pointer"
        />
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((course) => (
            <div
              key={course.id}
              className="bg-[#171717] border border-gray-600 rounded-xl p-5 shadow-md hover:shadow-lg hover:border-gray-100 transition"
            >
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-400 text-sm">{course.date}</p>
              <p className="mt-2 text-gray-300">{course.desc}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full">No courses found for this date.</p>
        )}
      </div>
    </div>
    </>
  );
}
