import { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PaymentMethod } from '../../types';

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'payment-1',
    userId: 'user-1',
    type: 'credit',
    cardBrand: 'Visa',
    lastFour: '4242',
    expiryDate: '12/25',
    name: 'Default Credit Card',
    isDefault: true
  },
  {
    id: 'payment-2',
    userId: 'user-1',
    type: 'debit',
    cardBrand: 'Mastercard',
    lastFour: '8888',
    expiryDate: '06/24',
    name: 'Business Debit Card',
    isDefault: false
  }
];

const ManagePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleDeletePaymentMethod = (paymentId: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(prev => prev.filter(p => p.id !== paymentId));
    }
  };
  
  const handleSetDefault = (paymentId: string) => {
    setPaymentMethods(prev => prev.map(p => ({
      ...p,
      isDefault: p.id === paymentId
    })));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Payment Methods</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Add Payment Method
        </Button>
      </div>
      
      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-neutral-700" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-900">
                          {method.name}
                          {method.isDefault && (
                            <span className="ml-2 text-sm font-medium text-success-600 bg-success-50 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </h3>
                        <div className="text-sm text-neutral-500 mt-1">
                          {method.cardBrand} •••• {method.lastFour}
                        </div>
                        <div className="text-sm text-neutral-500 mt-1">
                          Expires {method.expiryDate}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!method.isDefault && (
                          <Button 
                            variant="outline"
                            size="sm"
                            leftIcon={<CheckCircle className="h-4 w-4" />}
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button 
                          variant="outline"
                          size="sm"
                          leftIcon={<Edit className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-error-600 hover:bg-error-50"
                          leftIcon={<Trash2 className="h-4 w-4" />}
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <CreditCard className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">No payment methods</h3>
          <p className="text-neutral-600 mb-6">
            Add your first payment method to get started.
          </p>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Add Payment Method
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManagePaymentMethods;