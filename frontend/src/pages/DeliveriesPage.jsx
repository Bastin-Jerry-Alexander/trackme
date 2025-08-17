import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import DeliveryForm from '../components/DeliveryForm';
import DeliveryList from '../components/DeliveryList';

const DeliveriesPage = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [editingDelivery, setEditingDelivery] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axiosInstance.get('/api/deliveries', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setDeliveries(response.data);
      } catch (error) {
        console.error('Failed to fetch deliveries', error);
      }
    };
    fetchDeliveries();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <DeliveryForm
        deliveries={deliveries}
        setDeliveries={setDeliveries}
        editingDelivery={editingDelivery}
        setEditingDelivery={setEditingDelivery}
      />
      <DeliveryList
        deliveries={deliveries}
        setDeliveries={setDeliveries}
        setEditingDelivery={setEditingDelivery}
      />
    </div>
  );
};

export default DeliveriesPage;
