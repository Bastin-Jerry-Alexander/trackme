import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const DeliveryPage = () => {
  const { user } = useAuth();

  // State for all deliveries
  const [deliveries, setDeliveries] = useState([]);
  const [editingDelivery, setEditingDelivery] = useState(null);

  // Form state for create/update
  const [formData, setFormData] = useState({
    trackingId: '',
    sender: '',
    recipient: '',
    address: ''
  });

  // State for tracking search
  const [trackingId, setTrackingId] = useState('');
  const [trackedDelivery, setTrackedDelivery] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  // Load all deliveries when component mounts (optional)
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axiosInstance.get('/api/deliveries', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setDeliveries(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDeliveries();
  }, [user]);

  // Update form data when editingDelivery changes
  useEffect(() => {
    if (editingDelivery) {
      setFormData({
        trackingId: editingDelivery.trackingId,
        sender: editingDelivery.sender,
        recipient: editingDelivery.recipient,
        address: editingDelivery.address
      });
    } else {
      setFormData({ trackingId: '', sender: '', recipient: '', address: '' });
    }
  }, [editingDelivery]);

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or update delivery
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDelivery) {
        const response = await axiosInstance.patch(
          `/api/deliveries/${editingDelivery.trackingId}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setDeliveries(deliveries.map(d =>
          d.trackingId === response.data.trackingId ? response.data : d
        ));
        setEditingDelivery(null);
      } else {
        const response = await axiosInstance.post('/api/deliveries', formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setDeliveries([...deliveries, response.data]);
      }
      setFormData({ trackingId: '', sender: '', recipient: '', address: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to save delivery.');
    }
  };

  // Delete delivery
  const handleDelete = async (trackingId) => {
    try {
      await axiosInstance.delete(`/api/deliveries/${trackingId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDeliveries(deliveries.filter(d => d.trackingId !== trackingId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete delivery.');
    }
  };

  // Search delivery by tracking ID
  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    setTrackedDelivery(null);
    setTrackingError('');
    try {
      const response = await axiosInstance.get(`/api/deliveries/${trackingId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTrackedDelivery(response.data);
    } catch (err) {
      console.error(err);
      setTrackingError('Delivery not found. Please check the Tracking ID.');
    }
  };

  return (
    <div className="container mx-auto p-6">

      {/* Create/Edit Delivery Form */}
      <h1 className="text-2xl font-bold mb-4">
        {editingDelivery ? 'Edit Delivery' : 'Create Delivery'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-6">
        <input
          type="text"
          name="trackingId"
          placeholder="Tracking ID"
          value={formData.trackingId}
          onChange={handleFormChange}
          className="w-full mb-4 p-2 border rounded"
          disabled={!!editingDelivery} // prevent editing tracking ID
          required
        />
        <input
          type="text"
          name="sender"
          placeholder="Sender Name"
          value={formData.sender}
          onChange={handleFormChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="recipient"
          placeholder="Recipient Name"
          value={formData.recipient}
          onChange={handleFormChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleFormChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {editingDelivery ? 'Update Delivery' : 'Create Delivery'}
        </button>
      </form>

      {/* List of all deliveries with Edit/Delete */}
      <h2 className="text-xl font-bold mb-2">All Deliveries</h2>
      {deliveries.map(d => (
        <div key={d.trackingId} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <p><strong>Tracking ID:</strong> {d.trackingId}</p>
          <p><strong>Sender:</strong> {d.sender}</p>
          <p><strong>Recipient:</strong> {d.recipient}</p>
          <p><strong>Address:</strong> {d.address}</p>
          <p><strong>Status:</strong> {d.status}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingDelivery(d)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(d.trackingId)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Track Delivery by ID */}
      <h2 className="text-xl font-bold mt-6 mb-2">Track Delivery</h2>
      <form onSubmit={handleTrackSubmit} className="flex mb-4">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="border p-2 rounded flex-grow mr-2"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Track
        </button>
      </form>
      {trackingError && <p className="text-red-600 mb-4">{trackingError}</p>}
      {trackedDelivery && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <p><strong>Tracking ID:</strong> {trackedDelivery.trackingId}</p>
          <p><strong>Sender:</strong> {trackedDelivery.sender}</p>
          <p><strong>Recipient:</strong> {trackedDelivery.recipient}</p>
          <p><strong>Address:</strong> {trackedDelivery.address}</p>
          <p><strong>Status:</strong> {trackedDelivery.status}</p>
          <p><strong>Current Location:</strong> {trackedDelivery.currentLocation || 'N/A'}</p>
          <p><strong>Created At:</strong> {new Date(trackedDelivery.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;
