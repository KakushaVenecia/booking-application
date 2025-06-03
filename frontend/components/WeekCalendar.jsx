const WeekCalendar = ({ users, weekDates, availabilities }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Staff Availabilities</th>
          {weekDates.map(date => (
            <th key={date}>{date.toDateString()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.username}</td>
            {weekDates.map(date => {
              const dateKey = date.toISOString().split('T')[0];
              const avail = availabilities.find(a => a.userId === user._id && a.date === dateKey);
              return (
                <td key={dateKey}>
                  {avail ? `${avail.type.toUpperCase()} (${avail.period})` : '✅'}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
