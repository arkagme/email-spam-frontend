import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Mail, Target, BarChart3 } from 'lucide-react';
import { apiService } from '../utils/api';
import { toast } from 'sonner';

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [searching, setSearching] = useState(false);

const fetchStatistics = async (email) => {
  if (!email) {
    toast.error('Please enter your email address');
    return;
  }

  setSearching(true);
  try {
    const response = await apiService.getTestStatistics(email);
    //console.log('API Response:', response.data); // Debug log
    
    // Access the nested data property
    setStatistics(response.data.data);
    localStorage.setItem('userEmail', email);
    toast.success('Statistics loaded successfully!');
  } catch (error) {
    console.error('Error fetching statistics:', error);
    toast.error('Failed to fetch statistics');
    setStatistics(null);
  } finally {
    setLoading(false);
    setSearching(false);
  }
};

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
      fetchStatistics(savedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStatistics(userEmail);
  };

  if (loading && !userEmail) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Statistics</h1>
        <p className="text-muted-foreground text-lg">
          Track your email deliverability performance over time
        </p>
      </div>

      {/* Search Form */}
      <div className="card bg-card border border-border mb-8">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
            <input
              type="email"
              placeholder="Enter your email to view statistics"
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
                  <BarChart3 className="w-5 h-5" />
                  Load Statistics
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Statistics Display */}
      {!statistics ? (
        <div className="card bg-card border border-border">
          <div className="card-body text-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Statistics Available</h3>
            <p className="text-muted-foreground">
              {userEmail ? "Run some tests to see your statistics." : 'Enter your email to view your statistics.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          { /* Overview Cards */ }
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <Mail className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {statistics?.totalTests || 0}
              </div>
              <div className="text-sm opacity-90">Total Tests</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success to-emerald-600 text-white">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {statistics?.averageScore || 0}%
              </div>
              <div className="text-sm opacity-90">Avg. Score</div>
            </div>
          </div>

          {/* Add Recent Tests Section */}
          <div className="col-span-full mt-6">
            <div className="card bg-card border border-border">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Recent Tests</h2>
                <div className="space-y-4">
                  {statistics?.recentTests?.map((test) => (
                    <div key={test.testCode} className="flex justify-between items-center p-4 bg-card-secondary rounded-lg">
                      <div>
                        <div className="font-medium">{test.testCode}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(test.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-success">
                        {test.deliverabilityScore}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="card bg-gradient-to-br from-info to-blue-600 text-white">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1 capitalize">
                {statistics?.trend || 'neutral'}
              </div>
              <div className="text-sm opacity-90">Current Trend</div>
            </div>
          </div>
        </div>

          {/* Success Rate Card */}
          <div className="card bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
            <div className="card-body text-center">
              <h3 className="text-xl opacity-90 mb-2">Overall Success Rate</h3>
              <div className="text-5xl font-bold mb-2">
                {statistics.averageScore || statistics.average_score || 0}%
              </div>
              <p className="opacity-90">
                Based on {statistics.totalTests || statistics.total_tests || 0} tests
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
