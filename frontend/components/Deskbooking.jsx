"use client";
import { useState } from "react";

// 🧑‍💼 People with day-by-day schedule (status + desk)
const people = [
  {
    name: "Venecia",
    schedule: {
      Mon: { status: "NWD", desk: null },
      Tue: { status: "Office", desk: "D9" },
      Wed: { status: "Office", desk: "D10" },
      Thu: { status: "Office", desk: "D5" }, // Shared from Harriet
      Fri: { status: "Remote", desk: null },
    },
  },
  {
    name: "Harriet",
    schedule: {
      Mon: { status: "Office", desk: "D5" },
      Tue: { status: "Office", desk: "D5" },
      Wed: { status: "Office", desk: "D5" },
      Thu: { status: "Remote", desk: null },
      Fri: { status: "Remote", desk: null },
    },
  },
  {
    name: "Nic",
    schedule: {
      Mon: { status: "Remote", desk: null },
      Tue: { status: "Office", desk: "D2" },
      Wed: { status: "Office", desk: "D2" },
      Thu: { status: "Remote", desk: null },
      Fri: { status: "Leave", desk: null },
    },
  },
];

// Desks in office
const deskList = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "SMR", "MMR"];

// Allow bookings
export default function DeskBooking() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const [bookings, setBookings] = useState({
    Mon: {},
    Tue: {},
    Wed: {},
    Thu: {},
    Fri: {},
  });

  // 🔍 Generate assigned desks per day
  const assignedDesks = {};
  for (const day of days) {
    assignedDesks[day] = {};

    for (const person of people) {
      const dayInfo = person.schedule[day];
      if (dayInfo?.status === "Office" && dayInfo.desk) {
        assignedDesks[day][dayInfo.desk] = person.name;
      }
    }
  }

  // 🔘 Book a desk
  const handleBooking = (day, desk) => {
    setBookings((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [desk]: "You", // In real app: current user's name/id
      },
    }));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🪑 Desk Booking Overview</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Desk</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deskList.map((desk) => (
            <tr key={desk}>
              <td><strong>{desk}</strong></td>
              {days.map((day) => {
                const assigned = assignedDesks[day][desk];
                const booked = bookings[day][desk];

                if (assigned) {
                  return <td key={day}>{assigned}</td>;
                } else if (booked) {
                  return <td key={day}>Booked by {booked}</td>;
                } else {
                  return (
                    <td key={day}>
                      <button onClick={() => handleBooking(day, desk)}>
                        Book
                      </button>
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
