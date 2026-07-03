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
    const approveDiscountBtn = document.getElementById('approve-discount-btn');

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
            const response = await fetch('http://127.0.0.1:8000/api/triage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailContent })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error ${response.status}: ${errorText}`);
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

            // Populate Support Agent Toolkit
            const actionItemsList = document.getElementById('res-action-items');
            actionItemsList.innerHTML = ''; // Clear previous
            if (data.action_items && data.action_items.length > 0) {
                data.action_items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    actionItemsList.appendChild(li);
                });
            } else {
                actionItemsList.innerHTML = '<li>No specific actions required.</li>';
            }

            document.getElementById('res-draft').value = data.suggested_draft_response || "No draft generated.";
            
            // Handle Discount Button
            if (data.churn_risk) {
                approveDiscountBtn.style.display = 'block';
                approveDiscountBtn.textContent = 'Approve 20% Discount';
                approveDiscountBtn.disabled = false;
                approveDiscountBtn.style.opacity = '1';
                
                approveDiscountBtn.onclick = () => {
                    const draftEl = document.getElementById('res-draft');
                    draftEl.value += '\n\nAs a courtesy for this inconvenience, we have applied a 20% discount to your next billing cycle. We hope to keep you as a valued customer!';
                    approveDiscountBtn.textContent = 'Discount Applied ✓';
                    approveDiscountBtn.disabled = true;
                    approveDiscountBtn.style.opacity = '0.5';
                    approveDiscountBtn.onclick = null;
                };
            } else {
                approveDiscountBtn.style.display = 'none';
            }
            
            // Handle Escalation & Churn Badges
            if (data.is_escalation) {
                escalationBadge.style.display = 'inline-block';
                resScore.className = 'metric-value highlight-rose';
            } else {
                escalationBadge.style.display = 'none';
                resScore.className = 'metric-value highlight-blue';
            }
            
            // Webhook Simulation (Alerts Feed)
            if (data.severity === 'high' && data.priority_score > 90) {
                const alertsContainer = document.getElementById('alerts-container');
                const emptyMsg = alertsContainer.querySelector('.empty-alerts');
                if (emptyMsg) emptyMsg.remove();
                
                const alertCard = document.createElement('div');
                alertCard.className = 'alert-card';
                alertCard.innerHTML = `
                    <div class="alert-title">🚨 URGENT TICKET</div>
                    <div class="alert-detail"><strong>Sender:</strong> ${data.sender}</div>
                    <div class="alert-detail"><strong>Dept:</strong> ${data.department}</div>
                    <div class="alert-detail"><strong>Priority Score:</strong> ${data.priority_score}</div>
                `;
                alertsContainer.prepend(alertCard);
            }

            // Hide loading, show results
            loadingState.style.display = 'none';
            resultsPanel.style.display = 'block';

        } catch (error) {
            console.error("Error calling AI agent:", error);
            alert(`Error: ${error.message || "Error connecting to the AI agent. Make sure you are running 'uv run python app/fast_api_app.py'!"}`);
            loadingState.style.display = 'none';
        } finally {
            triageBtn.disabled = false;
            triageBtn.style.opacity = '1';
        }
    });
});
