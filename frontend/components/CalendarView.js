

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import useSWR from 'swr';
import axios from '@/utils/axiosInstance';


function fetcher(url) {
  return axios.get(url).then(res => res.data);
}

const typeColors = {
  remote: 'green',
  al: 'red',
  nwd: 'gray',
  training: 'orange',
  meeting: 'blue',
  court: 'purple',
  talk: 'teal',
  conference: 'pink'
};

export default function CalendarView() {
  const { data, error } = useSWR('/availability', fetcher);

  if (error) return <div>Error loading availability</div>;
  if (!data) return <div>Loading...</div>;

  const calendarData = Array.isArray(data) ? data : data?.results || [];

  const events = calendarData.map(entry => ({
    title: `${entry.type.toUpperCase()} (${entry.period})`,
    start: entry.date,
    allDay: entry.period === 'full',
    backgroundColor: typeColors[entry.type.toLowerCase()] || 'lightblue',
    borderColor: typeColors[entry.type.toLowerCase()] || 'lightblue'
  }));

  return (
    <div>
      <h2>Team Availability Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
          <div className="legend">
      {Object.entries(typeColors).map(([type, color]) => (
        <div key={type} style={{ display: 'inline-block', marginRight: 10 }}>
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              backgroundColor: color,
              marginRight: 5,
              borderRadius: '50%'
            }}
          ></span>
          {type.toUpperCase()}
        </div>
      ))}
    </div>

    </div>
  );
}
