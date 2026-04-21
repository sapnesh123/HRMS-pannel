import React, { useState, useEffect } from 'react';
import { dashboardApi, overtimeApi } from '../../features/api/api';

const AdminOvertime = () => {
  const [pendingOtRequests, setPendingOtRequests] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardApi.getAdmin();
      const data = res.data?.data || {};
      setDashboardData(data);
      setPendingOtRequests(data.pendingOtRequests || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await overtimeApi.approve(id);
      fetchData();
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await overtimeApi.reject(id);
      fetchData();
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Overtime Management</h1>
        <p className="page-subtitle">Approve or reject all overtime requests</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="simple-card simple-card-warning">
            <div className="simple-card-title">Pending Requests</div>
            <div className="simple-card-value">{pendingOtRequests.length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="simple-card simple-card-success">
            <div className="simple-card-title">Monthly Overtime</div>
            <div className="simple-card-value">{dashboardData?.monthlySummary?.totalOvertime || 0} hrs</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="simple-card">
            <div className="simple-card-title">Monthly Hours</div>
            <div className="simple-card-value">{dashboardData?.monthlySummary?.totalHours || 0} hrs</div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Pending Overtime Requests</h5>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : pendingOtRequests.length === 0 ? (
            <p className="text-muted text-center py-4">No pending overtime requests</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Employee ID</th>
                    <th>Date</th>
                    <th>Hours</th>
                    <th>Reason</th>
                    <th>Requested</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOtRequests.map((request) => (
                    <tr key={request._id}>
                      <td><strong>{request.userId?.name || 'Unknown'}</strong></td>
                      <td>{request.userId?.employeeId || '-'}</td>
                      <td>{request.date ? new Date(request.date).toLocaleDateString() : '-'}</td>
                      <td>{request.hours} hrs</td>
                      <td>{request.reason || '-'}</td>
                      <td>{request.requestedAt ? new Date(request.requestedAt).toLocaleString() : '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success" onClick={() => handleApprove(request._id)}>
                            Approve
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleReject(request._id)}>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOvertime;