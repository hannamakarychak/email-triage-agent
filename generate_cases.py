import json

cases = []

# Finance templates (6 cases)
finance_prompts = [
    "[FINANCE] Sender: vip@example.com\n\nI was double charged on my invoice #9923.",
    "[FINANCE] Sender: normal@example.com\n\nCan I get a refund for my last month's payment?",
    "[FINANCE] Sender: angry@example.com\n\n[CHURN] If you don't fix this billing error immediately, I am cancelling my subscription!",
    "[FINANCE] Sender: test1@example.com\n\nMy credit card keeps getting rejected on your payment portal.",
    "[FINANCE] Sender: test2@example.com\n\nPlease update my billing address to 123 Main St.",
    "[FINANCE] Sender: vip@example.com\n\n[CHURN] I've been overcharged 3 times. I am leaving for your competitor."
]

# Sales templates (6 cases)
sales_prompts = [
    "[SALES] Sender: lead@example.com\n\nWe need a quote for an Enterprise plan with 500 seats.",
    "[SALES] Sender: normal@example.com\n\nHow much does it cost to add 10 more users to our Silver tier?",
    "[SALES] Sender: bigcorp@example.com\n\nWe are interested in a site license for our entire organization.",
    "[SALES] Sender: test3@example.com\n\nDo you offer discounts for non-profits?",
    "[SALES] Sender: test4@example.com\n\nI want to speak to a sales representative about your new features.",
    "[SALES] Sender: lead2@example.com\n\nCan you send over the pricing sheet for your API?"
]

# Tech Support templates (6 cases)
tech_prompts = [
    "[TECH] Sender: dev@example.com\n\nThe API endpoint /v1/users is returning a 500 error.",
    "[TECH] Sender: normal@example.com\n\nI can't log into my account, it says invalid password.",
    "[TECH] Sender: angry@example.com\n\n[CHURN] Your app keeps crashing every time I open it! Fix this or I cancel.",
    "[TECH] Sender: test5@example.com\n\nHow do I export my data to a CSV file?",
    "[TECH] Sender: vip@example.com\n\n[CHURN] Our production database has been down for 2 hours! Unacceptable, we are churning if this isn't fixed.",
    "[TECH] Sender: test6@example.com\n\nThe UI is completely broken on Safari browser."
]

# Customer Satisfaction templates (12 cases to reach 30 total)
satisfaction_prompts = [
    "[SATISFACTION] Sender: happy@example.com\n\nJust wanted to say your support team is amazing!",
    "[SATISFACTION] Sender: angry@example.com\n\n[CHURN] Your customer service is terrible. I waited 3 weeks for a reply. I want out.",
    "[SATISFACTION] Sender: normal@example.com\n\nI have some feedback about the new dashboard design.",
    "[SATISFACTION] Sender: test7@example.com\n\nPlease forward this compliment to Sarah, she was very helpful.",
    "[SATISFACTION] Sender: test8@example.com\n\nI hate the new update. Please change it back.",
    "[SATISFACTION] Sender: vip@example.com\n\n[CHURN] I am extremely disappointed with the service lately. We are reviewing other vendors.",
    "[SATISFACTION] Sender: test9@example.com\n\nThe onboarding process was very confusing.",
    "[SATISFACTION] Sender: test10@example.com\n\nGreat product! Would recommend to my friends.",
    "[SATISFACTION] Sender: test11@example.com\n\nYour documentation is out of date and caused me hours of headache.",
    "[SATISFACTION] Sender: angry@example.com\n\n[CHURN] I demand to speak to a manager. This software is useless to me now.",
    "[SATISFACTION] Sender: test12@example.com\n\nI love the new dark mode!",
    "[SATISFACTION] Sender: vip@example.com\n\nThank you for the quick resolution to my issue."
]

all_prompts = finance_prompts + sales_prompts + tech_prompts + satisfaction_prompts

for i, prompt in enumerate(all_prompts):
    cases.append({
        "eval_case_id": f"case_{i+1}",
        "prompt": {
            "role": "user",
            "parts": [{"text": prompt}]
        }
    })

dataset = {"eval_cases": cases}

with open("tests/eval/datasets/triage-dataset.json", "w") as f:
    json.dump(dataset, f, indent=2)

print(f"Generated {len(cases)} cases.")
