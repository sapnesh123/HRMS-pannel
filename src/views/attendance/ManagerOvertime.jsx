import React, { useState, useEffect } from 'react';
import { dashboardApi, overtimeApi } from '../../features/api/api';
import { Link } from 'react-router-dom';

const ManagerOvertime = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [pendingOtRequests, setPendingOtRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getManager()
      .then(res => {
        setDashboardData(res.data?.data || {});
        setPendingOtRequests(res.data?.data?.pendingOtRequests || []);
      })
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await overtimeApi.approve(id);
      dashboardApi.getManager().then(res => setPendingOtRequests(res.data?.data?.pendingOtRequests || []));
    } catch (err) {
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await overtimeApi.reject(id);
      dashboardApi.getManager().then(res => setPendingOtRequests(res.data?.data?.pendingOtRequests || []));
    } catch (err) {
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Overtime Management</h1>
        <p className="page-subtitle">Approve or reject overtime requests</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="simple-card simple-card-warning">
            <div className="simple-card-header">
              <span className="simple-card-title">Pending Requests</span>
              <div className="simple-card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
              </div>
            </div>
            <div className="simple-card-value">{pendingOtRequests.length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="simple-card simple-card-success">
            <div className="simple-card-title">Team Overtime Hours</div>
            <div className="simple-card-value">{dashboardData.totalOvertime || 0} hrs</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="simple-card">
            <div className="simple-card-title">Total Hours Today</div>
            <div className="simple-card-value">{dashboardData.totalHours || 0} hrs</div>
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
                    <th>Date</th>
                    <th>Hours</th>
                    <th>Reason</th>
                    <th>Requested At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOtRequests.map((request) => (
                    <tr key={request._id}>
                      <td>
                        <Link to={`/manager/team/${request.userId?._id}`} className="text-decoration-none">
                          <strong>{request.userId?.name || 'Unknown'}</strong>
                        </Link>
                        <p className="mb-0 text-muted small">{request.userId?.employeeId}</p>
                      </td>
                      <td>
                        {request.date
                          ? new Date(request.date).toLocaleDateString()
                          : '-'}
                      </td>
                      <td>{request.hours} hrs</td>
                      <td>{request.reason || '-'}</td>
                      <td>
                        {request.requestedAt
                          ? new Date(request.requestedAt).toLocaleString()
                          : '-'}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprove(request._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReject(request._id)}
                          >
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

export default ManagerOvertime;