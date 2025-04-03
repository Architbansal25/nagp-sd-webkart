import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import EmptyWishlist from './EmptyWishlist';
import LoadBubbleEffect from '../Effects/LoadBubbleEffect';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem("username");
  const backendUrl = "ae7b879491443483190312829691524e-767193481.ap-south-1.elb.amazonaws.com" // Can make this dynamic later

  const navigate = useNavigate();
  // Fetch wishlist from API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
          `http://${backendUrl}/wishlist/user/${userEmail}`,
          {},
          { headers: { 'Content-Type': 'application/json' } }
        );
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeItem = async (wishlishId) => {
    try {
      await axios.delete(
        `http://${backendUrl}/wishlist/delete/${wishlishId}`,
        {},
        { headers: { 'Content-Type': 'application/json' } }
      );
      setWishlist(prev => prev.filter(item => item.wishlishId !== wishlishId));
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
    }
  };
  const handleProductClick = (productId) => {
    console.log('Product ID:', productId);
    navigate(`/product/${productId}`);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadBubbleEffect />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({wishlist.length})</h1>
      <div className="space-y-4">
        {wishlist.map(item => (
          <div
            key={item.wishlishId}
            className="flex items-center justify-between border rounded-xl p-4 shadow-sm cursor-pointer"
            onClick={() => handleProductClick(item.productId)}
          >
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <div className="text-sm text-gray-500">{item.brand}</div>
                {!item.available && (
                  <div className="text-sm text-pink-600 mt-1">Currently unavailable</div>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-lg font-bold">₹{item.price.toLocaleString()}</span>
                  <span className="text-sm line-through text-gray-500">₹{item.originalPrice.toLocaleString()}</span>
                  <span className="text-sm text-green-600">{item.discount}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">Color: {item.specification.color}</div>
              </div>
            </div>
            <button onClick={() => removeItem(item.wishlishId)} className="text-gray-500 hover:text-red-600">
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
