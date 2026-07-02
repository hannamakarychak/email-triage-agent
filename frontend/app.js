document.addEventListener('DOMContentLoaded', () => {
    const triageBtn = document.getElementById('triage-btn');
    const emailInput = document.getElementById('email-input');
    const resultsPanel = document.getElementById('results-panel');
    const loadingState = document.getElementById('loading-state');
    
    // UI Elements for binding data
    const resDept = document.getElementById('res-dept');
    const resScore = document.getElementById('res-score');
    const resSeverity = document.getElementById('res-severity');
    const resSentiment = document.getElementById('res-sentiment');
    const resAction = document.getElementById('res-action');
    const escalationBadge = document.getElementById('escalation-badge');

    triageBtn.addEventListener('click', async () => {
        const emailContent = emailInput.value.trim();
        
        if (!emailContent) {
            alert('Please paste an email to analyze!');
            return;
        }

        // Hide results, show loading
        resultsPanel.style.display = 'none';
        loadingState.style.display = 'flex';
        triageBtn.disabled = true;
        triageBtn.style.opacity = '0.7';

        // ---------------------------------------------------------
        // TODO: In the next iteration, we will replace this timeout 
        // with a real fetch() to your FastAPI server running locally!
        // e.g. fetch('http://localhost:8000/run_sse', { ... })
        // ---------------------------------------------------------
        setTimeout(() => {
            // Mocking a response for the initial visual showcase
            let mockData = {
                department: 'finance',
                priority_score: 15,
                severity: 'low',
                sentiment: 'neutral',
                is_escalation: false,
                action: 'Routed to finance queue. Priority: 15. Customer Tier: Bronze. Sender: unknown@example.com. Severity: low. Sentiment: neutral.'
            };

            // Dynamic logic just for the demo wow-factor
            const textLower = emailContent.toLowerCase();
            if (textLower.includes('lawyer') || textLower.includes('sue') || textLower.includes('unacceptable')) {
                mockData = {
                    department: 'customer_satisfaction',
                    priority_score: 95,
                    severity: 'high',
                    sentiment: 'angry',
                    is_escalation: true,
                    action: '[ESCALATION] Routed to customer_satisfaction queue. Priority: 95. Customer Tier: Platinum. Sender: angry@example.com. Severity: high. Sentiment: angry.'
                };
            } else if (textLower.includes('broken') || textLower.includes('bug')) {
                mockData.department = 'technical_issues';
                mockData.severity = 'medium';
                mockData.priority_score = 45;
                mockData.action = 'Routed to technical_issues queue. Priority: 45. Customer Tier: Gold. Sender: customer@example.com. Severity: medium. Sentiment: neutral.';
            }

            // Update UI
            resDept.textContent = mockData.department.replace('_', ' ').toUpperCase();
            resScore.textContent = mockData.priority_score;
            resSeverity.textContent = mockData.severity.toUpperCase();
            resSentiment.textContent = mockData.sentiment.toUpperCase();
            resAction.textContent = mockData.action;

            // Handle Escaltion Badge
            if (mockData.is_escalation) {
                escalationBadge.style.display = 'inline-block';
                resScore.className = 'metric-value highlight-rose';
            } else {
                escalationBadge.style.display = 'none';
                resScore.className = 'metric-value highlight-blue';
            }

            // Hide loading, show results
            loadingState.style.display = 'none';
            resultsPanel.style.display = 'block';
            triageBtn.disabled = false;
            triageBtn.style.opacity = '1';

        }, 1500); // Fake 1.5s latency to simulate AI processing
    });
});
