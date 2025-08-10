# InnovaTende Quick Reference Card

## 🚀 Quick Start
1. Double-click "Tender Platform" shortcut
2. Open `http://localhost:5174` in browser
3. Set role in Settings (gear icon)

## 📋 Common Tasks by Role

### Owner (Client)
```
Create RFQ:
Dashboard → Create RFQ → Fill 5 steps → Submit

Publish RFQ:
RFQs → Select RFQ → Publish

Evaluate Bids:
Bids → Select RFQ → Close Bidding → Evaluate → Award

Manage Project:
Projects → Select RFQ → Approve Milestones → Process Payments
```

### Bidder (Contractor)
```
Submit Bid:
Bids → Find RFQ → Submit Bid → Fill Details → Submit

Track Status:
Dashboard → Recent RFQs → View Status

Submit Milestone:
Projects → Select RFQ → Add Milestone → Upload Evidence
```

### Admin
```
View Reports:
Reports → Load Published RFQs → Select Report Type → Export

Audit Trail:
Reports → Enter RFQ ID → Load Audit Trail → Export PDF

Seed Demo Data:
Reports → Seed 3 Demo Tenders (Admin only)
```

## 🔑 Demo Accounts
```
Owner:
- Username: owner
- Password: owner123

Bidder:
- Username: bidder
- Password: bidder123

Admin:
- Username: admin
- Password: admin123
```

## 📊 Export Options
```
Tables:
- Click column header → Export CSV

Reports:
- Audit Trail → Export PDF
- Financial Summary → Export PDF
- Bid Matrix → Export PDF
```

## ⚠️ Common Issues
```
Page Not Found:
- Ensure URL has '#' (e.g., /#/rfqs/new)
- Check role permissions

Can't Submit:
- Verify all required fields
- Check file size limits
- Confirm deadline hasn't passed

No Data:
- Load Published RFQs first
- Enter correct Tender ID
- Check role permissions
```

## 💡 Tips
1. Use "Load Demo Data" buttons to see examples
2. Green toasts = success, Red = error
3. Recent Tender IDs saved in dashboard
4. Blockchain updates take a few seconds
5. Tables support sort/filter/search
