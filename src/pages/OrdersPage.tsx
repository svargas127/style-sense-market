
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Package, ChevronLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// This would typically come from an API
const mockOrders = [
  {
    id: "ORD-12345",
    date: "2025-03-15",
    status: "Delivered",
    total: 124.99,
    items: [
      { id: 1, name: "Black T-Shirt", quantity: 2, price: 29.99 },
      { id: 2, name: "Blue Jeans", quantity: 1, price: 59.99 },
    ],
  },
  {
    id: "ORD-12346",
    date: "2025-02-28",
    status: "Processing",
    total: 89.97,
    items: [
      { id: 3, name: "White Sneakers", quantity: 1, price: 69.99 },
      { id: 4, name: "Baseball Cap", quantity: 1, price: 19.98 },
    ],
  },
];

const OrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orders] = useState(mockOrders);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  // Find the selected order if an orderId is provided
  const selectedOrder = orderId ? orders.find(order => order.id === orderId) : null;

  if (selectedOrder) {
    // Order detail view
    return (
      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center" 
          onClick={() => navigate("/orders")}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Orders
        </Button>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Order {selectedOrder.id}</h1>
              <p className="text-sm text-gray-500">
                Placed on {new Date(selectedOrder.date).toLocaleDateString()}
              </p>
            </div>
            <span className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
              selectedOrder.status === "Delivered" 
                ? "bg-green-100 text-green-800" 
                : "bg-blue-100 text-blue-800"
            }`}>
              {selectedOrder.status}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Order Items</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t pt-4 flex justify-end">
            <div className="text-right">
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span className="mr-8">Subtotal:</span>
                <span>${selectedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span className="mr-8">Shipping:</span>
                <span>$5.00</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="mr-8">Total:</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="max-w-md">
              <img 
                src="/order-confirmation.jpg" 
                alt="Order Confirmation" 
                className="w-full rounded-lg shadow-md" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <p className="text-center text-gray-500 mt-4">
                {selectedOrder.status === "Delivered" 
                  ? "Your order has been delivered. Thank you for shopping with us!" 
                  : "Your order is being processed. We'll notify you once it's on the way!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Orders list view
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap justify-between gap-4 mb-2">
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <h3 className="font-medium">{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.status === "Delivered" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="text-sm text-gray-600">
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </div>
                <div className="font-medium">
                  ${order.total.toFixed(2)}
                </div>
              </div>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Button asChild>
            <a href="/products">Start Shopping</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
