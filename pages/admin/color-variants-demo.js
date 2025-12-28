import Contentlayout from "@/shared/layout-components/layout/content-layout";
import Badge from '@/shared/components/Badge';
import Button from '@/shared/components/Button';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '@/shared/components/Card';
import Alert from '@/shared/components/Alert';
import { useState } from 'react';

const ColorVariantsDemo = () => {
  const [showAlert, setShowAlert] = useState({ info: true, success: true, warning: true, danger: true });
  const [loadingStates, setLoadingStates] = useState({});

  const handleLoadingDemo = (key) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <Contentlayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Color Variants System Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A comprehensive showcase of all color variants and components for the admin panel
          </p>
        </div>

        {/* Status Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Status Badges</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Automatic color assignment based on status
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* Order Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Order Status
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Badge status="pending">Pending</Badge>
                  <Badge status="paid">Paid</Badge>
                  <Badge status="packed">Packed</Badge>
                  <Badge status="shipped">Shipped</Badge>
                  <Badge status="delivered">Delivered</Badge>
                  <Badge status="cancelled">Cancelled</Badge>
                  <Badge status="refunded">Refunded</Badge>
                </div>
              </div>

              {/* User Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  User Status
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Badge status="active">Active</Badge>
                  <Badge status="inactive">Inactive</Badge>
                  <Badge status="blocked">Blocked</Badge>
                  <Badge status="approved">Approved</Badge>
                  <Badge status="approval-required">Approval Required</Badge>
                </div>
              </div>

              {/* Priority Levels */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Priority Levels
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Badge priority="high">High Priority</Badge>
                  <Badge priority="medium">Medium Priority</Badge>
                  <Badge priority="low">Low Priority</Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Manual Badge Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants (Manual)</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Use specific color variants manually
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="gray">Gray</Badge>
              <Badge variant="purple">Purple</Badge>
              <Badge variant="orange">Orange</Badge>
            </div>
          </CardBody>
        </Card>

        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Different button styles and states
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* Solid Buttons */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Solid Buttons
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="info">Info</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              {/* Outline Buttons */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Outline Buttons
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" outline>Primary</Button>
                  <Button variant="success" outline>Success</Button>
                  <Button variant="danger" outline>Danger</Button>
                  <Button variant="warning" outline>Warning</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Button Sizes
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
              </div>

              {/* Loading States */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Loading States
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="primary" 
                    loading={loadingStates.primary}
                    onClick={() => handleLoadingDemo('primary')}
                  >
                    {loadingStates.primary ? 'Loading...' : 'Load Data'}
                  </Button>
                  <Button 
                    variant="success" 
                    loading={loadingStates.success}
                    onClick={() => handleLoadingDemo('success')}
                  >
                    {loadingStates.success ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>

              {/* Disabled States */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Disabled States
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" disabled>Primary Disabled</Button>
                  <Button variant="success" disabled>Success Disabled</Button>
                  <Button variant="danger" disabled>Danger Disabled</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card Variants */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Card Variants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default">
              <h4 className="font-semibold mb-2">Default Card</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Standard card with white background
              </p>
            </Card>

            <Card variant="primary">
              <h4 className="font-semibold mb-2 text-blue-900">Primary Card</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Used for highlighted information
              </p>
            </Card>

            <Card variant="success">
              <h4 className="font-semibold mb-2 text-green-900">Success Card</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Used for positive outcomes
              </p>
            </Card>

            <Card variant="warning">
              <h4 className="font-semibold mb-2 text-yellow-900">Warning Card</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Used for attention required
              </p>
            </Card>

            <Card variant="danger">
              <h4 className="font-semibold mb-2 text-red-900">Danger Card</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Used for critical information
              </p>
            </Card>

            <Card variant="hover">
              <h4 className="font-semibold mb-2">Hoverable Card</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hover to see the effect
              </p>
            </Card>
          </div>
        </div>

        {/* Structured Card Example */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>Structured Card Example</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Card with header, body, and footer sections
            </p>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700 dark:text-gray-300">
              This is the card body content. You can put any content here including forms,
              tables, lists, or other components.
            </p>
          </CardBody>
          <CardFooter>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Save</Button>
            </div>
          </CardFooter>
        </Card>

        {/* Alert Variants */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Alert Variants
          </h3>
          
          {showAlert.info && (
            <Alert 
              variant="info" 
              title="Information"
              dismissible
              onDismiss={() => setShowAlert(prev => ({ ...prev, info: false }))}
            >
              This is an informational message. Click the × to dismiss.
            </Alert>
          )}

          {showAlert.success && (
            <Alert 
              variant="success" 
              title="Success!"
              dismissible
              onDismiss={() => setShowAlert(prev => ({ ...prev, success: false }))}
            >
              Your changes have been saved successfully.
            </Alert>
          )}

          {showAlert.warning && (
            <Alert 
              variant="warning" 
              title="Warning"
              dismissible
              onDismiss={() => setShowAlert(prev => ({ ...prev, warning: false }))}
            >
              Please review the following before proceeding with this action.
            </Alert>
          )}

          {showAlert.danger && (
            <Alert 
              variant="danger" 
              title="Error"
              dismissible
              onDismiss={() => setShowAlert(prev => ({ ...prev, danger: false }))}
            >
              An error occurred while processing your request. Please try again.
            </Alert>
          )}
        </div>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Real-World Usage Examples</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Common patterns in admin pages
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* Order Status Example */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Order #12345
                  </h4>
                  <Badge status="paid">Paid</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="info">Express Shipping</Badge>
                  <Badge variant="purple">Premium Customer</Badge>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" size="sm">View Details</Button>
                  <Button variant="success" size="sm">Mark as Shipped</Button>
                </div>
              </div>

              {/* Customer Status Example */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    John Doe
                  </h4>
                  <Badge status="active">Active</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge status="approved">Approved</Badge>
                  <Badge variant="success">Email Verified</Badge>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="primary" size="sm">View Profile</Button>
                  <Button variant="danger" size="sm" outline>Block User</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Documentation Link */}
        <Card variant="primary">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                Need More Information?
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Check out the complete documentation for usage guidelines, best practices, and migration guide.
              </p>
              <Button variant="primary" size="sm">
                View Documentation
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Contentlayout>
  );
};

export default ColorVariantsDemo;

