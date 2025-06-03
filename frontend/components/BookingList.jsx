const BookingList = ({ bookings }) => {
  return (
    <ul>
      {bookings.map(b => (
        <li key={b._id}>
          Resource: {b.resourceId}, User: {b.userId}, Date: {b.date}
        </li>
      ))}
    </ul>
  );
};
