import { Link } from 'react-router-dom';
import { Mail, Target, FileText, TrendingUp, ArrowRight } from 'lucide-react';
import { TEST_EMAILS } from '../utils/constants';

const Home = () => {
  return (
    <div className="animate-fade-in">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Email Deliverability Testing
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Test where your emails land. Inbox, Spam, or Promotions? Get detailed reports and improve your email deliverability.
        </p>
        <Link
          to="/new-test"
          className="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform"
        >
          Start New Test
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="card bg-card border border-border hover:border-primary transition-all hover:scale-105">
          <div className="card-body">
            <Target className="w-12 h-12 text-primary mb-4" />
            <h3 className="card-title text-xl mb-2">Accurate Detection</h3>
            <p className="text-muted-foreground">
              Precisely detect where your emails land across multiple test inboxes.
            </p>
          </div>
        </div>

        <div className="card bg-card border border-border hover:border-primary transition-all hover:scale-105">
          <div className="card-body">
            <FileText className="w-12 h-12 text-primary mb-4" />
            <h3 className="card-title text-xl mb-2">Detailed Reports</h3>
            <p className="text-muted-foreground">
              Get comprehensive reports with deliverability scores and PDF exports.
            </p>
          </div>
        </div>

        <div className="card bg-card border border-border hover:border-primary transition-all hover:scale-105">
          <div className="card-body">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="card-title text-xl mb-2">Track History</h3>
            <p className="text-muted-foreground">
              Monitor your email performance over time with detailed statistics.
            </p>
          </div>
        </div>
      </section>

      {/* Test Inboxes Section */}
      <section className="card bg-card border border-border">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            Test Inboxes
          </h2>
          <p className="text-muted-foreground mb-6">
            When you start a test, send your email to all of these addresses:
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {TEST_EMAILS.map((inbox) => (
              <div
                key={inbox.id}
                className="card bg-secondary border border-border hover:border-primary transition-all"
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{inbox.icon}</span>
                    <div>
                      <div className="font-semibold text-foreground">{inbox.provider}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {inbox.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-info mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Make sure to include your test code in the email subject or body!</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Generate Code', desc: 'Create a unique test code for your email' },
            { step: '2', title: 'Send Email', desc: 'Send your email to all test inboxes with the code' },
            { step: '3', title: 'Detect', desc: 'We check where your email landed in each inbox' },
            { step: '4', title: 'Review', desc: 'Get detailed reports and improve deliverability' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
