import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../features/api/api';

const AdminAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dashboardData, setDashboardData] = useState({});
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getAdmin()
      .then(res => setDashboardData(res.data?.data || {}))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (date) {
      dashboardApi.getDailyReport()
        .then(res => setReportData(res.data?.data || []))
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [date]);

  const todaySummary = dashboardData?.todaySummary || {};
  const attendances = reportData || [];

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
        <h1>All Attendance</h1>
        <p className="page-subtitle">View system-wide attendance records</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="simple-card simple-card-success">
            <div className="simple-card-title">Present</div>
            <div className="simple-card-value">{todaySummary.present || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="simple-card simple-card-danger">
            <div className="simple-card-title">Absent</div>
            <div className="simple-card-value">{todaySummary.absent || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="simple-card simple-card-warning">
            <div className="simple-card-title">Completed</div>
            <div className="simple-card-value">{todaySummary.completed || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="simple-card">
            <div className="simple-card-title">Incomplete</div>
            <div className="simple-card-value">{todaySummary.incomplete || 0}</div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <div className="d-flex align-items-center gap-3">
            <label className="mb-0">Date:</label>
            <input
              type="date"
              className="form-control"
              style={{ width: 'auto' }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : attendances.length === 0 ? (
            <p className="text-muted text-center py-4">No attendance records for this date</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Employee ID</th>
                    <th>Punch In</th>
                    <th>In Selfie</th>
                    <th>Punch Out</th>
                    <th>Out Selfie</th>
                    <th>Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((attendance) => (
                    <tr key={attendance._id}>
                      <td><strong>{attendance.name || '-'}</strong><div className="small text-muted">{attendance.department || '-'}</div></td>
                      <td>{attendance.employeeId || '-'}</td>
                      <td>
                        <div>{attendance.punchInTime || '-'}</div>
                        <div className="small text-muted">{attendance.punchInLocation || '-'}</div>
                      </td>
                      <td>
                        {attendance.punchInSelfie && attendance.punchInSelfie !== 'N/A' ? (
                          <img
                            src={attendance.punchInSelfie}
                            alt="In Selfie"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => window.open(attendance.punchInSelfie, '_blank')}
                          />
                        ) : '-'}
                      </td>
                      <td>
                        <div>{attendance.punchOutTime || '-'}</div>
                        <div className="small text-muted">{attendance.punchOutLocation || '-'}</div>
                      </td>
                      <td>
                        {attendance.punchOutSelfie && attendance.punchOutSelfie !== 'N/A' ? (
                          <img
                            src={attendance.punchOutSelfie}
                            alt="Out Selfie"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => window.open(attendance.punchOutSelfie, '_blank')}
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

export default AdminAttendance;