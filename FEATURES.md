# Splitly - Feature Roadmap

This document tracks potential features that can be added to Splitly, organized by priority and complexity.

---

## Quick Wins (Easy to implement, high value)

### Expense Management Enhancements
- [ ] **Expense comments/notes** - Let members discuss expenses
- [ ] **Expense categories with icons** - Visual categorization (food, transport, utilities, etc.)
- [ ] **Recurring expenses** - Auto-create monthly bills
- [ ] **Expense search/filtering** - Filter by date range, category, amount, member
- [ ] **Bulk expense operations** - Select and delete multiple expenses
- [ ] **Expense attachments** - Support multiple receipt images per expense

### Notification System
- [ ] **Email notifications** - New expenses, settlements, being added to groups
- [ ] **In-app notifications** - Real-time updates for group activities
- [ ] **Notification preferences** - Control what alerts you receive

### Group Features
- [ ] **Group activity feed** - Timeline of all group activities
- [ ] **Group statistics** - Total spent, average per member, charts
- [ ] **Group templates** - Pre-configured groups (roommates, trip, etc.)
- [ ] **Group leave functionality** - Exit groups (if balance is zero)
- [ ] **Group archive** - Archive completed/old groups

### Settlement Improvements
- [ ] **Settlement reminders** - Remind members about pending payments
- [ ] **Settlement confirmation** - Require recipient to confirm payment received
- [ ] **Payment method tracking** - Record how payment was made (Venmo, cash, etc.)
- [ ] **Settlement history export** - Download settlement records

---

## Medium Complexity (Good value, moderate effort)

### Financial Features
- [ ] **Multi-currency support** - Handle expenses in different currencies with conversion
- [ ] **Tax & tip calculator** - Built-in calculator for restaurant bills
- [ ] **Budget limits** - Set spending limits per group/category
- [ ] **Expense splitting by item** - Itemized bill splitting (who ordered what)
- [ ] **Unequal splits with custom logic** - Complex split scenarios

### Dashboard & Analytics
- [ ] **Personal dashboard** - Overview of all balances, recent activity
- [ ] **Spending analytics** - Charts showing spending patterns over time
- [ ] **Category breakdown** - Pie charts of expenses by category
- [ ] **Monthly/yearly reports** - Detailed spending summaries
- [ ] **Export to CSV/PDF** - Download expense reports

### Social Features
- [ ] **User profiles** - Profile pictures, bio, payment details
- [ ] **Friend system** - Add friends for easier group creation
- [ ] **Activity sharing** - Share group summaries externally
- [ ] **Group chat** - Built-in messaging per group

### Mobile Experience
- [ ] **Progressive Web App (PWA)** - Install on mobile devices
- [ ] **Offline mode** - Create expenses offline, sync later
- [ ] **Push notifications** - Mobile alerts
- [ ] **Camera integration** - Take receipt photos directly

---

## Advanced Features (Higher complexity, major additions)

### Payment Integration
- [ ] **Direct payment links** - Venmo/PayPal integration for settlements
- [ ] **Payment processing** - Accept payments through the app (Stripe/Square)
- [ ] **Automatic settlement** - Auto-settle via connected payment methods
- [ ] **Payment request links** - Share payment links with non-members

### Advanced Group Management
- [ ] **Sub-groups** - Nested groups (e.g., "Europe Trip" → "Paris Week")
- [ ] **Group roles** - Admin, moderator, member with different permissions
- [ ] **Private expenses** - Expenses visible only to involved members
- [ ] **Group invitations** - Invite via email/link with acceptance flow
- [ ] **Group joining requests** - Request to join existing groups

### Smart Features
- [ ] **Receipt OCR** - Auto-extract amount/date from receipt images
- [ ] **Smart categorization** - AI-powered expense categorization
- [ ] **Spending predictions** - Predict future expenses based on patterns
- [ ] **Debt simplification algorithms** - Advanced optimization for settlements
- [ ] **Fairness score** - Track who pays more often

### Enterprise/Advanced
- [ ] **API access** - REST/GraphQL API for third-party integrations
- [ ] **Webhooks** - Trigger external actions on events
- [ ] **IFTTT/Zapier integration** - Automation with other services
- [ ] **Accounting software export** - QuickBooks/Xero integration
- [ ] **Multi-tenant SaaS** - Host for multiple organizations
- [ ] **White-label solution** - Customizable branding

---

## UI/UX Improvements

- [ ] **Dark mode** - Theme switching
- [ ] **Accessibility improvements** - ARIA labels, keyboard navigation
- [ ] **Onboarding tutorial** - Guide new users through features
- [ ] **Keyboard shortcuts** - Power user features
- [ ] **Drag & drop** - Reorder expenses, upload images
- [ ] **Mobile-optimized layouts** - Better responsive design
- [ ] **Skeleton loaders** - Better loading states
- [ ] **Empty states** - Helpful messages when no data exists

---

## Top Priority Recommendations

Based on user value and implementation effort, these are the recommended starting points:

1. **Expense search/filtering** - Very useful for growing expense lists
2. **Email notifications** - Keep users engaged when they're not in the app
3. **Personal dashboard** - Better overview of all group balances
4. **Spending analytics with charts** - Visual insights are highly valuable
5. **Expense comments** - Enable collaboration and clarity

---

## Completed Features

Track implemented features here by moving them from the sections above:

- [x] User authentication with 2FA
- [x] Group management
- [x] Expense tracking with 4 split types
- [x] Balance calculation and settlement tracking
- [x] Receipt image uploads

---

## Notes

- Check existing Laravel conventions before implementing new features
- Write tests for all new features
- Update this file as features are completed or priorities change
- Consider user feedback when prioritizing features
