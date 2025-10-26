import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, RefreshCw, Download, Mail, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { apiService } from '../utils/api';
import { FOLDER_LABELS, FOLDER_COLORS } from '../utils/constants';
import { toast } from 'sonner';

const Results = () => {
  const { testCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState(null);
  const [emailForReport, setEmailForReport] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

const fetchResults = async (showToast = false) => {
  try {
    setRefreshing(showToast);
    const [statusRes, resultsRes] = await Promise.all([
      apiService.getTestStatus(testCode),
      apiService.getTestResults(testCode),
    ]);
    
    // Access the nested data correctly
    setStatus(statusRes.data.data);
    setResults(resultsRes.data.data);
    
    if (showToast) {
      toast.success('Results refreshed!');
    }
  } catch (error) {
    console.error('Error fetching results:', error);
    toast.error('Failed to fetch results');
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    if (testCode) {
      fetchResults();
    }
  }, [testCode]);

  const handleDownloadPDF = async () => {
    try {
      const response = await apiService.getReportPdf(testCode);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `email-test-report-${testCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!emailForReport) {
      toast.error('Please enter an email address');
      return;
    }

    setSendingReport(true);
    try {
      await apiService.sendReportEmail(testCode, emailForReport);
      toast.success('Report sent successfully!');
      setEmailForReport('');
    } catch (error) {
      console.error('Error sending report:', error);
      toast.error('Failed to send report');
    } finally {
      setSendingReport(false);
    }
  };

const calculateScore = () => {
  // Use the deliverabilityScore from the API directly
  if (results?.deliverabilityScore !== undefined) {
    return results.deliverabilityScore;
  }
  
  // Fallback to manual calculation if needed
  if (!results?.results) return 0;
  const inboxCount = results.results.filter(r => r.folder === 'inbox').length;
  const total = results.results.length;
  return Math.round((inboxCount / total) * 100);
};

  const getFolderIcon = (folder) => {
    switch (folder) {
      case 'inbox':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'spam':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'promotions':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      default:
        return <XCircle className="w-5 h-5 text-neutral" />;
    }
  };

  const getFolderBadgeClass = (folder) => {
    const colors = {
      inbox: 'badge-success',
      spam: 'badge-error',
      promotions: 'badge-warning',
      not_received: 'badge-ghost',
    };
    return colors[folder] || 'badge-ghost';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
        <p className="text-muted-foreground mb-6">Test code not found or no results available yet.</p>
        <Link to="/new-test" className="btn btn-primary">
          Start New Test
        </Link>
      </div>
    );
  }

  const score = calculateScore();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link to="/history" className="btn btn-ghost gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Link>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Test Results</h1>
            <p className="text-muted-foreground">
              Test Code: <span className="font-mono font-bold text-primary">{testCode}</span>
            </p>
          </div>
          <button
            onClick={() => fetchResults(true)}
            className="btn btn-outline gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Score Card */}
      <div className="card bg-gradient-to-br from-primary to-purple-600 text-primary-foreground mb-6">
        <div className="card-body text-center">
          <h2 className="text-lg opacity-90 mb-2">Deliverability Score</h2>
          <div className="text-6xl font-bold mb-2">{score}%</div>
          <p className="opacity-90">
            {results.results?.filter(r => r.folder === 'inbox').length} of {results.results?.length} emails reached inbox
          </p>
        </div>
      </div>

      {/* Status */}
{status && (
  <div className="alert mb-6">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <div>
      <div className="font-semibold">Status: {status.status}</div>
      {status.progress && (
        <div className="text-sm">
          Processed: {status.progress.completed} / {status.progress.total}
        </div>
      )}
    </div>
  </div>
)}

      {/* Results List */}
      <div className="card bg-card border border-border mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Individual Results</h2>
          
          <div className="space-y-4">
            {results.results?.map((result, index) => (
              <div
                key={index}
                className="card bg-secondary border border-border hover:border-primary transition-all"
              >
                <div className="card-body p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-8 h-8 text-primary" />
                      <div>
                        <div className="font-semibold text-lg">{result.email}</div>
                        <div className="text-sm text-muted-foreground">{result.provider || 'Gmail'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getFolderIcon(result.folder)}
                      <span className={`badge ${getFolderBadgeClass(result.folder)} badge-lg`}>
                        {FOLDER_LABELS[result.folder] || result.folder}
                      </span>
                    </div>
                  </div>

                  {result.subject && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-sm text-muted-foreground">Subject:</div>
                      <div className="text-sm font-medium">{result.subject}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Download PDF */}
        <div className="card bg-card border border-border">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4">Download Report</h3>
            <p className="text-muted-foreground mb-4">
              Get a detailed PDF report of your email test results.
            </p>
            <button
              onClick={handleDownloadPDF}
              className="btn btn-primary gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Email Report */}
        <div className="card bg-card border border-border">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4">Email Report</h3>
            <form onSubmit={handleSendReport} className="space-y-4">
              <input
                type="email"
                placeholder="recipient@email.com"
                className="input input-bordered w-full"
                value={emailForReport}
                onChange={(e) => setEmailForReport(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary gap-2 w-full"
                disabled={sendingReport}
              >
                {sendingReport ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Report
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
