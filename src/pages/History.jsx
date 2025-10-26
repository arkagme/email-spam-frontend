import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Calendar, Mail, TrendingUp, Eye } from 'lucide-react';
import { apiService } from '../utils/api';
import { toast } from 'sonner';

const History = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchHistory = async (email) => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setSearching(true);
    try {
      const response = await apiService.getTestHistory(email);
      console.log('History Response:', response.data); // Debug log
      
      // Access the tests array from the nested data structure
      const historyData = response.data.data.tests || [];
      setHistory(historyData);
      localStorage.setItem('userEmail', email);
      toast.success('History loaded successfully!');
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch history');
      setHistory([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
      fetchHistory(savedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchHistory(userEmail);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateScore = (test) => {
    if (!test.results || test.results.length === 0) return 0;
    const inboxCount = test.results.filter(r => r.folder === 'inbox').length;
    return Math.round((inboxCount / test.results.length) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-error';
  };

  if (loading && !userEmail) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Test History</h1>
        <p className="text-muted-foreground text-lg">
          View all your previous email deliverability tests
        </p>
      </div>

      {/* Search Form */}
      <div className="card bg-card border border-border mb-8">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
            <input
              type="email"
              placeholder="Enter your email to view history"
              className="input input-bordered flex-1 min-w-[250px] border-2 dark:border-gray-500 px-4 sm:px-6 py-2"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary gap-2 px-4 sm:px-6 py-2"
              disabled={searching}
            >
              {searching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Load History
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="card bg-card border border-border">
          <div className="card-body text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Tests Found</h3>
            <p className="text-muted-foreground mb-6">
              {userEmail ? "You haven't run any tests yet." : 'Enter your email to view your test history.'}
            </p>
            <Link to="/new-test" className="btn btn-primary">
              Start Your First Test
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((test) => (
            <div
              key={test.testCode}
              className="card bg-card border border-border hover:border-primary transition-colors"
            >
              <div className="card-body">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Test: {test.testCode}
                    </h3>
                    <p className="text-muted-foreground">
                      Created: {formatDate(test.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(test.deliverabilityScore)}`}>
                      {test.deliverabilityScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Status: {test.status}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/results/${test.testCode}`}
                    className="btn btn-info btn-sm"
                  >
                    View Details
                  </Link>
                  {test.status === 'completed' && (
                    <Link
                      to={`/report/${test.testCode}`}
                      className="btn btn-outline btn-sm"
                    >
                      View Report
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
