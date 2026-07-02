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

        try {
            const response = await fetch('http://localhost:8085/api/triage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailContent })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Update UI with REAL data from Gemini!
            resDept.textContent = (data.department || '').replace('_', ' ').toUpperCase();
            resScore.textContent = data.priority_score;
            resSeverity.textContent = (data.severity || '').toUpperCase();
            resSentiment.textContent = (data.sentiment || '').toUpperCase();
            resAction.textContent = data.action;

            // Handle Escalation Badge
            if (data.is_escalation) {
                escalationBadge.style.display = 'inline-block';
                resScore.className = 'metric-value highlight-rose';
            } else {
                escalationBadge.style.display = 'none';
                resScore.className = 'metric-value highlight-blue';
            }

            // Hide loading, show results
            loadingState.style.display = 'none';
            resultsPanel.style.display = 'block';

        } catch (error) {
            console.error("Error calling AI agent:", error);
            alert("Error connecting to the AI agent. Make sure agents-cli playground is running on port 8085!");
            loadingState.style.display = 'none';
        } finally {
            triageBtn.disabled = false;
            triageBtn.style.opacity = '1';
        }
    });
});
