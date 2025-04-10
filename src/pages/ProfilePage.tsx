
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we'd make an API call to update the user's profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we'd make an API call to change the password
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Mock order history (would come from backend in a real app)
  const orders = [
    {
      id: "ORD-12345",
      date: "2025-03-15",
      status: "Delivered",
      total: 124.99,
      items: 3,
    },
    {
      id: "ORD-12346",
      date: "2025-02-28",
      status: "Processing",
      total: 89.97,
      items: 2,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                {user?.name[0].toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600 text-sm">{user?.email}</p>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full mb-2"
                onClick={() => navigate("/orders")}
              >
                My Orders
              </Button>
              <Button 
                variant="outline" 
                className="w-full mb-2"
                onClick={() => navigate("/wishlist")}
              >
                Wishlist
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-3/4">
          <Tabs defaultValue="orders">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
              <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
              <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-wrap justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-medium">{order.id}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
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
                            {order.items} {order.items === 1 ? "item" : "items"}
                          </div>
                          <div className="font-medium">
                            ${order.total.toFixed(2)}
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline" size="sm">
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
            </TabsContent>
            
            <TabsContent value="profile">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit">Update Profile</Button>
                  </div>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      required
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit">Change Password</Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
