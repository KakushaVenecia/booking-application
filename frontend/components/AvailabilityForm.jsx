import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '../utils/axiosInstance';
import './Availability.css';
import { useAuth } from '../contexts/AuthContext';

const getColor = (type) => {
  switch (type) {
    case 'remote': return '#4caf50';     // green
    case 'al': return '#f44336';         // red
    case 'nwd': return '#9e9e9e';        // grey
    case 'training': return '#2196f3';   // blue
    default: return '#000';              // fallback
  }
};

const AvailabilityForm = () => {
  const { user } = useAuth() || {};
  const userId = user?._id;

  const [date, setDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [formData, setFormData] = useState({ type: 'remote', period: 'full' });
  const [existingEntry, setExistingEntry] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/availability`,{ withCredentials: true });
      setAvailabilities(res.data);
    } catch (error) {
      console.error('Error in fetching availability:', error);
    }
  };

  const getAvailabilityForDate = (selectedDate) => {
    const d = selectedDate.toISOString().split('T')[0];
    return availabilities.find((a) => a.date === d);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const entry = getAvailabilityForDate(date);
    setExistingEntry(entry);
    if (entry) {
      setFormData({ type: entry.type, period: entry.period });
    } else {
      setFormData({ type: 'remote', period: 'full' });
    }
  }, [date, availabilities]);

  if (!userId) return <p>Loading user data...</p>;

  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  const twoWeekEntries = availabilities.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= new Date() && entryDate <= twoWeeksFromNow;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        date: date.toISOString().split('T')[0],
        type: formData.type,
        period: formData.period,
      };

      if (existingEntry) {
        await axios.put(`/availability/${existingEntry._id}`, payload);
      } else {
        await axios.post('/availability', payload);
      }

      await fetchData();
      alert('Availability saved!');
    } catch (err) {
      console.error(err);
      alert('Error saving availability');
    }
  };

  const handleDelete = async () => {
    if (!existingEntry) return;
    try {
      await axios.delete(`/availability/${existingEntry._id}`);
      await fetchData();
      alert('Availability deleted');
    } catch (err) {
      console.error(err);
      alert('Error deleting availability');
    }
  };

  const tileClassName = ({ date: tileDate }) => {
    const d = tileDate.toISOString().split('T')[0];
    const entry = availabilities.find((a) => a.date === d);
    if (entry) {
      return 'react-calendar__tile--highlighted';
    }
    return null;
  };

  return (
    <div className="availability-container">
      <h2>Availability Form</h2>

      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={tileClassName}
      />

      <form onSubmit={handleSubmit} className="availability-form">
        <label>
          Type:
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="remote">Remote</option>
            <option value="al">Annual Leave</option>
            <option value="nwd">Non-Working Day</option>
            <option value="training">Training</option>
          </select>
        </label>

        <label>
          Period:
          <select
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
          >
            <option value="am">Morning</option>
            <option value="pm">Afternoon</option>
            <option value="full">Full Day</option>
          </select>
        </label>

        <button type="submit">Save</button>
        {existingEntry && <button type="button" onClick={handleDelete}>Delete</button>}
      </form>

      <div className="availability-summary">
        <h3>Next 2 Weeks</h3>
        <ul>
          {twoWeekEntries.map((entry) => (
            <li key={entry._id}>
              <span>{entry.date}:</span> {entry.type} ({entry.period})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AvailabilityForm;
