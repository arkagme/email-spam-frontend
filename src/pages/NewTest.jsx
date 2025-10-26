import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Copy, CheckCircle, Loader2, Send } from 'lucide-react';
import { apiService } from '../utils/api';
import { TEST_EMAILS } from '../utils/constants';
import { toast } from 'sonner';

const NewTest = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [testCode, setTestCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [copied, setCopied] = useState(false);

const handleGenerateTest = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.generateTest(email);
      //console.log('API Response:', response);
      
      // Fix: Access the nested testCode from response.data.data
      const code = response.data.data.testCode;
      
      if (!code) {
        throw new Error('No test code received from API');
      }
      
      setTestCode(code);
      console.log('Test code set to:', code);
      toast.success('Test code generated successfully!');
    } catch (error) {
      console.error('Error generating test:', error);
      toast.error('Failed to generate test code. Please try again.');
      setTestCode(''); // Reset test code on error
    } finally {
      setLoading(false);
    }
};

  const handleCopyCode = () => {
    navigator.clipboard.writeText(testCode);
    setCopied(true);
    toast.success('Test code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

const handleDetect = async () => {
  setDetecting(true);
  try {
    // First start the detection
    await apiService.detectEmails(testCode);
    toast.success('Detection started! Checking inboxes...');
    
    let isCompleted = false;
    while (!isCompleted) {
      // Poll status every 2 seconds
      const statusResponse = await apiService.getTestStatus(testCode);
      //console.log('Status Response:', statusResponse.data); // Debug log
      
      const { status, progress, deliverabilityScore } = statusResponse.data.data;
      
      // Show progress
      if (progress) {
        toast.info(`Checking ${progress.total} inboxes`);
      }
      
      if (status === 'completed') {
        isCompleted = true;
        
        // Get final results to ensure we have all data
        const resultsResponse = await apiService.getTestResults(testCode);
        //console.log('Final Results:', resultsResponse.data); // Debug log
        
        const finalScore = resultsResponse.data.data.deliverabilityScore;
        
        // Show completion toast with score
        toast.success(`Test completed! Deliverability Score: ${finalScore}%`, {
          duration: 5000
        });
        
        // Navigate to results page
        setTimeout(() => {
          navigate(`/results/${testCode}`);
        }, 2000);
      } else {
        // Wait 2 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (error) {
    console.error('Detection error:', error);
    toast.error('Failed to complete detection. Please try again.');
  } finally {
    setDetecting(false);
  }
};

  //console.log('Current testCode:', testCode);
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Start New Test</h1>
        <p className="text-muted-foreground text-lg">
          Generate a unique test code and send your email to our test inboxes
        </p>
      </div>

      {/* Step 1: Generate Test Code */}
      <div className="card bg-card border border-border mb-6">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <div className="badge badge-outline badge-lg">Step 1</div>
            <h2 className="card-title text-2xl">Generate Test Code</h2>
          </div>
          
          <form onSubmit={handleGenerateTest} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Email Address</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered w-full border-2 dark:border-gray-500 px-4 sm:px-6 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!testCode}
              />
              <label className="label">
                <span className="label-text-alt text-muted-foreground">
                  This will be used to track your test history
                </span>
              </label>
            </div>

            {!testCode && (
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto gap-2 px-4 sm:px-6 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Generate Test Code
                  </>
                )}
              </button>
            )}
          </form>

          {testCode && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500 rounded-lg animate-scale-in">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Your Test Code:</div>
                  <div className="text-2xl font-bold font-mono text-green-500">{testCode}</div>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="btn btn-outline gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Send Email */}
      {testCode !== '' && testCode !== undefined && testCode !== null && (
        <div className="card bg-card border border-border mb-6 animate-fade-in">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <div className="badge badge-outline badge-lg">Step 2</div>
              <h2 className="card-title text-2xl">Send Your Email</h2>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Send an email to all test inboxes below. Make sure to include your test code{' '}
              <span className="font-mono font-bold text-green-500">{testCode}</span> in the subject or body.
            </p>

            <div className="space-y-3">
              {TEST_EMAILS.map((inbox) => (
                <div
                  key={inbox.id}
                  className="flex items-center gap-3 p-4 bg-secondary rounded-lg border border-border"
                >
                  <span className="text-2xl">{inbox.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{inbox.provider}</div>
                    <div className="text-sm font-mono text-muted-foreground">{inbox.email}</div>
                  </div>
                  <a
                    href={`mailto:${inbox.email}?subject=Email Test - ${testCode}`}
                    className="btn btn-sm btn-outline gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </a>
                </div>
              ))}
            </div>

            <div className="alert alert-soft mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Important: Include the test code <strong>{testCode}</strong> in your email! and also add the subject as <strong>Email-{testCode}</strong> </span>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Detect */}
      {testCode && (
        <div className="card bg-card border border-border animate-fade-in">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <div className="badge badge-outline badge-lg">Step 3</div>
              <h2 className="card-title text-2xl">Detect & Analyze</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Once you've sent your emails to all test inboxes, click the button below to start detection.
            </p>

            <button
              onClick={handleDetect}
              className="btn btn-primary btn-lg gap-2 w-full sm:w-auto"
              disabled={detecting}
            >
              {detecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Start Detection
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTest;
