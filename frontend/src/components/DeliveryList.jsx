import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const DeliveryList = ({ deliveries, setDeliveries, setEditingDelivery }) => {
  const { user } = useAuth();

  const handleDelete = async (trackingId) => {
    try {
      // If you add a DELETE route in backend later
      await axiosInstance.delete(`/api/deliveries/${trackingId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDeliveries(deliveries.filter(d => d.trackingId !== trackingId));
    } catch (error) {
      alert('Failed to delete delivery.');
    }
  };

  return (
    <div>
      {deliveries.map((delivery) => (
        <div key={delivery.trackingId} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">Tracking ID: {delivery.trackingId}</h2>
          <p><strong>Sender:</strong> {delivery.sender}</p>
          <p><strong>Recipient:</strong> {delivery.recipient}</p>
          <p><strong>Address:</strong> {delivery.address}</p>
          <p className="text-sm text-gray-500">
            Status: {delivery.status} | Location: {delivery.currentLocation}
          </p>
          <div className="mt-2">
            <button
              onClick={() => setEditingDelivery(delivery)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(delivery.trackingId)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryList;
