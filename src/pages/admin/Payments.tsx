import { useState, useEffect } from 'react';
import { CreditCard, Search, Filter, Check, X, Eye, Download, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Interface for payment data
interface Payment {
  id: string;
  order_id: string;
  username: string;
  email: string;
  course_id: number;
  amount: number;
  status: string;
  created_at: string;
  screenshot_path: string;
  course?: {
    name: string;
  };
}

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch payments from the API
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const url = `http://127.0.0.1:8000/api/payments${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`;
      
      console.log('Fetching payments from:', url);
      console.log('Token:', localStorage.getItem('token'));
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch payments: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Payments data:', data);
      
      if (data && data.data) {
        setPayments(data.data);
      } else {
        console.warn('No data or data.data in response:', data);
        setPayments([]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message);
      setPayments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch payments when component mounts or status filter changes
  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);
  
  // Filter payments based on search
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.course?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };

  const handleApprovePayment = async (id: string) => {
    try {
      console.log(`Approving payment with ID: ${id}`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to approve payments",
          variant: "destructive"
        });
        return;
      }
      
      console.log(`Token available: ${token ? 'Yes' : 'No'}`);
      
      const response = await fetch(`http://127.0.0.1:8000/api/payments/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: 'Approved by admin' })
      });
      
      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to approve payment');
      }
      
      // Close the dialog and refresh payments
      setIsDetailsOpen(false);
      toast({
        title: "Payment Approved",
        description: "The payment has been approved successfully.",
      });
      fetchPayments();
    } catch (err: any) {
      console.error('Error approving payment:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to approve payment",
        variant: "destructive"
      });
    }
  };

  const handleRejectPayment = async (id: string) => {
    try {
      console.log(`Rejecting payment with ID: ${id}`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to reject payments",
          variant: "destructive"
        });
        return;
      }
      
      console.log(`Token available: ${token ? 'Yes' : 'No'}`);
      
      const response = await fetch(`http://127.0.0.1:8000/api/payments/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: 'Rejected by admin' })
      });
      
      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to reject payment');
      }
      
      // Close the dialog and refresh payments
      setIsDetailsOpen(false);
      toast({
        title: "Payment Rejected",
        description: "The payment has been rejected.",
      });
      fetchPayments();
    } catch (err: any) {
      console.error('Error rejecting payment:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to reject payment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-white flex items-center">
            <CreditCard className="h-7 w-7 text-neon-green mr-2" />
            <span>Payment <span className="text-neon-green">Verification</span></span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Review and approve payment submissions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-cyber-darker border border-neon-green/20">
          <TabsTrigger 
            value="all" 
            onClick={() => setStatusFilter('all')}
            className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            onClick={() => setStatusFilter('pending')}
            className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            onClick={() => setStatusFilter('approved')}
            className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger 
            value="rejected" 
            onClick={() => setStatusFilter('rejected')}
            className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
          >
            Rejected
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="Search by order ID, username or course..."
            className="pl-10 bg-cyber-light border-neon-green/30 text-white w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px] bg-cyber-light border-neon-green/30 text-white">
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-cyber-dark border-neon-green/30 text-white">
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="amount-high">Highest amount</SelectItem>
              <SelectItem value="amount-low">Lowest amount</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="border-neon-green/30 text-white">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 bg-cyber-dark/50 rounded-lg border border-neon-green/20">
          <CreditCard className="h-12 w-12 text-white/20 mx-auto mb-4 animate-pulse" />
          <p className="text-white/70 mb-2">Loading payment data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 bg-cyber-dark/50 rounded-lg border border-red-500/20">
          <CreditCard className="h-12 w-12 text-red-500/20 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Failed to load payment data</p>
          <p className="text-white/70 mb-4 text-sm">{error}</p>
          <Button 
            variant="outline" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10" 
            onClick={fetchPayments}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Payments Table */}
      {!loading && !error && filteredPayments.length > 0 && (
        <Card className="bg-cyber-light border-neon-green/30">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cyber-dark/50 border-b border-neon-green/20">
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">ORDER ID</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">USERNAME</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">COURSE</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">AMOUNT</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">DATE</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">STATUS</th>
                    <th className="text-left py-3 px-4 text-xs font-mono text-white/70">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-neon-green/10 hover:bg-cyber-dark/30">
                      <td className="py-3 px-4 text-xs font-mono text-white">{payment.order_id}</td>
                      <td className="py-3 px-4 text-xs font-mono text-white">{payment.username}</td>
                      <td className="py-3 px-4 text-xs text-white">{payment.course?.name || 'Unknown Course'}</td>
                      <td className="py-3 px-4 text-xs font-mono text-white">${payment.amount}</td>
                      <td className="py-3 px-4 text-xs font-mono text-white/70">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-mono px-2 py-1 rounded ${
                          payment.status === 'approved' 
                            ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                            : payment.status === 'pending'
                            ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-900/30 text-red-400 border border-red-500/30'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-neon-green hover:bg-neon-green/10"
                            onClick={() => handleViewDetails(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-500 hover:bg-green-500/10"
                                onClick={() => handleApprovePayment(payment.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:bg-red-500/10"
                                onClick={() => handleRejectPayment(payment.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Empty State */}
      {!loading && !error && filteredPayments.length === 0 && (
        <div className="text-center py-12 bg-cyber-dark/50 rounded-lg border border-neon-green/20 mt-4">
          <CreditCard className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/70 mb-2">No payments match your search criteria.</p>
          <Button 
            variant="outline" 
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 mt-2" 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Payment Details Dialog */}
      {selectedPayment && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="bg-cyber-dark border border-neon-green/30 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-mono text-white">
                Payment Details: {selectedPayment.order_id}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-mono text-white/70 mb-1">User Information</h3>
                  <Card className="bg-cyber-darker border-neon-green/20">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70 text-xs">Username:</span>
                        <span className="text-white text-xs font-mono">{selectedPayment.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70 text-xs">Email:</span>
                        <span className="text-white text-xs font-mono">{selectedPayment.email}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-sm font-mono text-white/70 mb-1">Payment Information</h3>
                  <Card className="bg-cyber-darker border-neon-green/20">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70 text-xs">Course:</span>
                        <span className="text-white text-xs">{selectedPayment.course?.name || 'Unknown Course'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70 text-xs">Amount:</span>
                        <span className="text-white text-xs font-mono">${selectedPayment.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70 text-xs">Date:</span>
                        <span className="text-white text-xs font-mono">
                          {new Date(selectedPayment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70 text-xs">Status:</span>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                          selectedPayment.status === 'approved' 
                            ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                            : selectedPayment.status === 'pending'
                            ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-900/30 text-red-400 border border-red-500/30'
                        }`}>
                          {selectedPayment.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {selectedPayment.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprovePayment(selectedPayment.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Payment
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10"
                      onClick={() => handleRejectPayment(selectedPayment.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Payment
                    </Button>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-mono text-white/70 mb-1">Payment Proof</h3>
                <div className="border border-neon-green/20 rounded-md overflow-hidden">
                  <img 
                    src={`http://127.0.0.1:8000/storage/${selectedPayment.screenshot_path}`} 
                    alt="Payment Proof" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
                    onClick={() => window.open(`http://127.0.0.1:8000/storage/${selectedPayment.screenshot_path}`, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download Proof
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPayments; 