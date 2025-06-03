import { useEffect, useState } from 'react';

export default function DeskMap() {
  const [deskData, setDeskData] = useState([]);
  const [bookings, setBookings] = useState({});
  const [selectedDesk, setSelectedDesk] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/resources')
      .then(res => res.json())
      .then(data => setDeskData(data))
      .catch(err => console.error('Error in fetching desks:', err));
  }, []);

  function handleDeskClick(id) {
    setSelectedDesk(id);
  }

  return (
    <div>
      <h2>Desk Layout Map</h2>
      <svg width="600" height="350" style={{ border: '1px solid #ccc' }}>
        {deskData.map((desk) => {
          const isVertical = ["D6", "D4", "D5", "D11", "D1"].includes(desk.id);
          const isBooked = bookings[desk.id];
          const fillColor = isBooked ? "#f87171" : "#4ade80";

          return (
            <g
              key={desk.id}
              onClick={() => handleDeskClick(desk.id)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={Number(desk.x)}
                y={Number(desk.y)}
                width={isVertical ? 40 : 80}
                height={isVertical ? 80 : 40}
                fill={fillColor}
                stroke="black"
              />
              <text
                x={Number(desk.x) + (isVertical ? 20 : 40)}
                y={Number(desk.y) + (isVertical ? 45 : 25)}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="12"
                fill="black"
              >
                {desk.id}
              </text>
            </g>
          );
        })}
      </svg>
      {selectedDesk && (
        <p>
          Desk <strong>{selectedDesk}</strong> is{" "}
          {bookings[selectedDesk] ? "Booked" : "Available"}.
        </p>
      )}
    </div>
  );
}
