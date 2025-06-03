
import Layout from '../components/Layout';
import DeskMap from '../components/DeskMap';
import DeskBooking from '../components/Deskbooking';
import './dashboard.css';




export default function Dashboard() {
  
  return (
    <Layout>
       <div className="dashboard-flex">
        <div className="map-container">
          <DeskMap />
        </div>
        <div className="booking-container">
          <DeskBooking />
        </div>
      </div>
    
    </Layout>
  );
}
