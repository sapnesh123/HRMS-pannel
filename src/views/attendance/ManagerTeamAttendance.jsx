import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../features/api/api';
import { Link } from 'react-router-dom';

const ManagerTeamAttendance = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [attendances, setAttendances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dashboardApi.getManager()
      .then(res => {
        setDashboardData(res.data?.data || {});
        setAttendances(res.data?.data?.recentAttendance || []);
      })
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredAttendances = attendances.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      case 'incomplete':
        return <span className="badge bg-warning">Incomplete</span>;
      case 'absent':
        return <span className="badge bg-danger">Absent</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Team Attendance</h1>
        <p className="page-subtitle">View your team's attendance</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="simple-card">
            <div className="simple-card-title">Team Size</div>
            <div className="simple-card-value">{dashboardData.teamSize || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="simple-card simple-card-success">
            <div className="simple-card-title">Present</div>
            <div className="simple-card-value">{dashboardData.presentNow || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="simple-card simple-card-warning">
            <div className="simple-card-title">Completed</div>
            <div className="simple-card-value">{dashboardData.completedToday || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="simple-card simple-card-danger">
            <div className="simple-card-title">Incomplete</div>
            <div className="simple-card-value">{dashboardData.incompleteToday || 0}</div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Team Members</h5>
            <div>
              <button
                className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} me-1`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`btn btn-sm ${filter === 'completed' ? 'btn-success' : 'btn-outline-success'} me-1`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`btn btn-sm ${filter === 'incomplete' ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => setFilter('incomplete')}
              >
                Incomplete
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredAttendances.length === 0 ? (
            <p className="text-muted text-center py-4">No attendance records found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Punch In</th>
                    <th>In Selfie</th>
                    <th>Punch Out</th>
                    <th>Out Selfie</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendances.map((attendance) => (
                    <tr key={attendance._id}>
                      <td>
                        <Link to={`/manager/team/${attendance.userId?._id}`} className="text-decoration-none">
                          <strong>{attendance.userId?.name || 'Unknown'}</strong>
                        </Link>
                        <p className="mb-0 text-muted small">{attendance.userId?.employeeId} | {attendance.userId?.departmentName || '-'}</p>
                      </td>
                      <td>
                        <div>{attendance.punchIn?.time ? new Date(attendance.punchIn.time).toLocaleTimeString() : '-'}</div>
                        <div className="small text-muted">{attendance.punchIn?.location?.address || '-'}</div>
                      </td>
                      <td>
                        {attendance.punchIn?.selfie ? (
                          <img
                            src={attendance.punchIn.selfie}
                            alt="In Selfie"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => window.open(attendance.punchIn.selfie, '_blank')}
                          />
                        ) : '-'}
                      </td>
                      <td>
                        <div>{attendance.punchOut?.time ? new Date(attendance.punchOut.time).toLocaleTimeString() : '-'}</div>
                        <div className="small text-muted">{attendance.punchOut?.location?.address || '-'}</div>
                      </td>
                      <td>
                        {attendance.punchOut?.selfie ? (
                          <img
                            src={attendance.punchOut.selfie}
                            alt="Out Selfie"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => window.open(attendance.punchOut.selfie, '_blank')}
                          />
                        ) : '-'}
                      </td>
                      <td>{attendance.workingHours || 0} hrs</td>
                      <td>{getStatusBadge(attendance.status)}</td>
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

export default ManagerTeamAttendance;