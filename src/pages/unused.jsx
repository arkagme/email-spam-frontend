          {/* Detailed Breakdown */}
          <div className="card bg-card border border-border">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Delivery Breakdown</h2>
              
              <div className="space-y-4">
                {/* Inbox */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Inbox</span>
                    <span className="font-bold text-success">
                      {statistics.totalInbox || statistics.total_inbox || 0}
                    </span>
                  </div>
                  <progress
                    className="progress progress-success w-full"
                    value={statistics.totalInbox || statistics.total_inbox || 0}
                    max={statistics.totalEmails || statistics.total_emails || 100}
                  ></progress>
                </div>

                {/* Spam */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Spam</span>
                    <span className="font-bold text-error">
                      {statistics.totalSpam || statistics.total_spam || 0}
                    </span>
                  </div>
                  <progress
                    className="progress progress-error w-full"
                    value={statistics.totalSpam || statistics.total_spam || 0}
                    max={statistics.totalEmails || statistics.total_emails || 100}
                  ></progress>
                </div>

                {/* Promotions */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Promotions</span>
                    <span className="font-bold text-warning">
                      {statistics.totalPromotions || statistics.total_promotions || 0}
                    </span>
                  </div>
                  <progress
                    className="progress progress-warning w-full"
                    value={statistics.totalPromotions || statistics.total_promotions || 0}
                    max={statistics.totalEmails || statistics.total_emails || 100}
                  ></progress>
                </div>

                {/* Not Received */}
                {(statistics.totalNotReceived || statistics.total_not_received || 0) > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Not Received</span>
                      <span className="font-bold text-neutral">
                        {statistics.totalNotReceived || statistics.total_not_received || 0}
                      </span>
                    </div>
                    <progress
                      className="progress w-full"
                      value={statistics.totalNotReceived || statistics.total_not_received || 0}
                      max={statistics.totalEmails || statistics.total_emails || 100}
                    ></progress>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Emails Sent</span>
                  <span>{statistics.totalEmails || statistics.total_emails || 0}</span>
                </div>
              </div>
            </div>
          </div>