import React, { Fragment, useState } from "react";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Table from "@/shared/components/Table";
import { Badge, Button, Card } from "@/shared/components";

const TableDemo = () => {
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  // Sample data
  const sampleData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", revenue: 12450, views: 1234 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active", revenue: 8900, views: 856 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager", status: "Inactive", revenue: 15600, views: 2103 },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User", status: "Active", revenue: 6780, views: 445 },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Admin", status: "Active", revenue: 19200, views: 3421 }
  ];

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const toggleEmpty = () => {
    setShowEmpty(!showEmpty);
  };

  const dataToDisplay = showEmpty ? [] : sampleData;

  return (
    <Fragment>
      <Contentlayout>
        <Pageheader 
          currentpage="Table Component Demo" 
          activepage="Components" 
          mainpage="Table Demo" 
        />

        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            📊 Professional Table Component
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Modern, responsive tables with multiple variants, sorting, loading states, and more
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={isLoading ? "danger" : "primary"}
                onClick={toggleLoading}
              >
                {isLoading ? "Hide Loading" : "Show Loading"}
              </Button>
              <Button 
                variant={showEmpty ? "warning" : "secondary"}
                onClick={toggleEmpty}
              >
                {showEmpty ? "Show Data" : "Show Empty State"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedRows([])}
              >
                Clear Selection
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Modern Variant */}
        <Card className="mb-6">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Modern Variant (Default)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Professional gradient header with shadows and rounded corners
                </p>
              </div>
              <Badge variant="success">Default</Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <Table variant="modern">
              <Table.Header>
                <Table.Row>
                  <Table.Head>Select</Table.Head>
                  <Table.Head 
                    sortable 
                    sortDirection={sortColumn === 'name' ? sortDirection : null}
                    onSort={() => handleSort('name')}
                  >
                    Name
                  </Table.Head>
                  <Table.Head 
                    sortable 
                    sortDirection={sortColumn === 'email' ? sortDirection : null}
                    onSort={() => handleSort('email')}
                  >
                    Email
                  </Table.Head>
                  <Table.Head>Role</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head align="right">Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {isLoading && <Table.Loading rows={5} columns={6} />}
                {!isLoading && dataToDisplay.length === 0 && (
                  <Table.Empty message="No users found" icon="👥" />
                )}
                {!isLoading && dataToDisplay.length > 0 && dataToDisplay.map(item => (
                  <Table.Row 
                    key={item.id}
                    selected={selectedRows.includes(item.id)}
                  >
                    <Table.Cell>
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(item.id)}
                        onChange={() => toggleRow(item.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </Table.Cell>
                    <Table.Cell className="text-gray-600 dark:text-gray-400">
                      {item.email}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={item.role === 'Admin' ? 'primary' : item.role === 'Manager' ? 'warning' : 'secondary'}>
                        {item.role}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {item.status}
                      </span>
                    </Table.Cell>
                    <Table.Cell align="right">
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                          Delete
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>

        {/* Striped Variant */}
        <Card className="mb-6">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Striped Variant
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Alternating row colors for better readability
                </p>
              </div>
              <Badge variant="info">Striped</Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <Table variant="striped">
              <Table.Header>
                <Table.Row>
                  <Table.Head>Product</Table.Head>
                  <Table.Head>Price</Table.Head>
                  <Table.Head>Revenue</Table.Head>
                  <Table.Head>Views</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sampleData.map(item => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      Product {item.id}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        ${(item.revenue / 10).toFixed(2)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${item.revenue.toLocaleString()}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        <span className="text-purple-600 dark:text-purple-400">👁️</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {item.views.toLocaleString()}
                        </span>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>

        {/* Bordered Variant */}
        <Card className="mb-6">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bordered Variant
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Strong borders for clear cell separation
                </p>
              </div>
              <Badge variant="warning">Bordered</Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <Table variant="bordered">
              <Table.Header>
                <Table.Row>
                  <Table.Head>Order ID</Table.Head>
                  <Table.Head>Customer</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head align="right">Amount</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sampleData.map(item => (
                  <Table.Row key={item.id} hoverable={true}>
                    <Table.Cell className="font-mono font-semibold text-gray-900 dark:text-white">
                      #{item.id.toString().padStart(5, '0')}
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={item.status === 'Active' ? 'success' : 'danger'}>
                        {item.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell align="right">
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${item.revenue.toLocaleString()}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>

        {/* Minimal Variant */}
        <Card className="mb-6">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Minimal Variant
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Clean, minimal design with subtle styling
                </p>
              </div>
              <Badge variant="secondary">Minimal</Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <Table variant="minimal">
              <Table.Header>
                <Table.Row>
                  <Table.Head>Name</Table.Head>
                  <Table.Head>Email</Table.Head>
                  <Table.Head>Role</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sampleData.map(item => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </Table.Cell>
                    <Table.Cell className="text-gray-600 dark:text-gray-400">
                      {item.email}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="secondary">{item.role}</Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>

        {/* Complex Content Example */}
        <Card className="mb-6">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Complex Cell Content
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Rich content with images, multiple lines, and styled elements
                </p>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Table variant="modern">
              <Table.Header>
                <Table.Row>
                  <Table.Head>User</Table.Head>
                  <Table.Head>Activity</Table.Head>
                  <Table.Head>Performance</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sampleData.map(item => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.email}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {item.views.toLocaleString()} views
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">
                          +{Math.floor(Math.random() * 20)}% this week
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {Math.floor((item.revenue / 200))}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.floor((item.revenue / 200))}%` }}
                          ></div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          👁️
                        </button>
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                          ✏️
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          🗑️
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Body>
        </Card>

        {/* Feature Summary */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              ✨ Table Features
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">4 Variants</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Modern, Striped, Bordered, Minimal</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Responsive</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Auto horizontal scroll on mobile</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl mb-2">🔄</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Sortable</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Built-in column sorting support</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Loading States</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Professional skeleton loaders</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl mb-2">📭</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Empty States</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Beautiful no-data displays</p>
              </div>
              <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <div className="text-2xl mb-2">🌙</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Dark Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete dark mode support</p>
              </div>
            </div>
          </Card.Body>
        </Card>

      </Contentlayout>
    </Fragment>
  );
};

TableDemo.layout = "Contentlayout";
export default TableDemo;

