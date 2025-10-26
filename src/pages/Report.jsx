import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, Clock, Mail, Inbox, AlertTriangle, Archive } from 'lucide-react';
import { apiService } from '../utils/api';
import { toast } from 'sonner';

const Report = () => {
  const { testCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await apiService.getReport(testCode);
        setReport(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to load report');
        setLoading(false);
      }
    };

    fetchReport();
  }, [testCode]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-muted-foreground">The requested report could not be found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Email Test Report</h1>
        <p className="text-muted-foreground">Test Code: {report.testCode}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-primary to-purple-600 text-white">
          <div className="card-body">
            <h3 className="font-semibold mb-2">Deliverability Score</h3>
            <div className="text-3xl font-bold">{report.deliverabilityScore}%</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-success to-green-600 text-white">
          <div className="card-body">
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="text-3xl font-bold capitalize">{report.overallStatus}</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-info to-blue-600 text-white">
          <div className="card-body">
            <h3 className="font-semibold mb-2">Inbox Placement</h3>
            <div className="text-3xl font-bold">{report.summary.inboxPercentage}%</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-warning to-orange-600 text-white">
          <div className="card-body">
            <h3 className="font-semibold mb-2">Total Inboxes</h3>
            <div className="text-3xl font-bold">{report.summary.totalInboxes}</div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Summary Statistics */}
        <div className="card bg-card border border-border">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Delivery Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-success" />
                  <span>Inbox</span>
                </div>
                <span className="font-bold">{report.summary.inboxCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <span>Spam</span>
                </div>
                <span className="font-bold">{report.summary.spamCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Archive className="w-5 h-5 text-info" />
                  <span>Promotions</span>
                </div>
                <span className="font-bold">{report.summary.promotionsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Information */}
        <div className="card bg-card border border-border">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Test Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started:</span>
                <span>{formatDate(report.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed:</span>
                <span>{formatDate(report.completedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{report.userEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-card border border-border mb-8">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Recommendations</h2>
          <div className="space-y-4">
            {report.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  rec.type === 'success' ? 'bg-success/10' : 'bg-warning/10'
                }`}
              >
                {rec.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-success shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-warning shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold mb-1">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="card bg-card border border-border">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Detailed Results</h2>
          <div className="space-y-4">
            {report.results.map((result) => (
              <div
                key={result.inboxId}
                className="flex flex-wrap justify-between items-center p-4 bg-card-secondary rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{result.inboxName}</h3>
                  <p className="text-sm text-muted-foreground">{result.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${
                    result.folder === 'inbox' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {result.folder}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(result.receivedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export {Report};