# Splitly - Task Plan

**Generated:** 2025-10-29
**Project:** Expense Splitting Application (Laravel 12 + React 19 + Inertia.js v2)

---

## Executive Summary

Splitly is a well-architected expense-splitting application with solid foundation features. This document outlines completed work and recommended enhancements organized by priority.

---

## ✅ COMPLETED FEATURES

### 1. Authentication & User Management (100%)
- ✅ User registration with email verification (Laravel Fortify)
- ✅ Login/logout with rate limiting (5 attempts/minute)
- ✅ Password reset via email
- ✅ Two-factor authentication (2FA) with QR codes and recovery codes
- ✅ Password confirmation for sensitive operations
- ✅ Profile management (name, email updates)
- ✅ Password change functionality
- ✅ Comprehensive auth tests (Feature tests for all flows)

### 2. Group Management (100%)
- ✅ Create groups with name, description, and optional image
- ✅ List all user's groups
- ✅ View group details with members, expenses, and balances
- ✅ Update group information
- ✅ Delete groups (soft delete via cascade)
- ✅ Add members to groups by email
- ✅ Auto-create user accounts for new members
- ✅ Authorization via GroupPolicy (member-only access)
- ✅ Group image storage and display
- ✅ Feature tests for group CRUD operations

### 3. Expense Management (100%)
- ✅ Create expenses with multiple split types:
  - Equal split (divide evenly)
  - Exact amounts (specify per participant)
  - Percentage-based (distribute by %)
  - Shares-based (weighted distribution)
- ✅ Edit and update expenses with recalculation
- ✅ Delete expenses (payer only)
- ✅ Upload receipt images
- ✅ Track expense metadata: date, category, description, payer
- ✅ Automatic rounding correction in ExpenseSplitCalculator
- ✅ Authorization via ExpensePolicy
- ✅ Paginated expense list (20 per page)
- ✅ Comprehensive unit tests for split calculator
- ✅ Feature tests for expense operations

### 4. Balance & Settlement (100%)
- ✅ Automatic balance calculation per group
- ✅ Intelligent debt simplification algorithm (BalanceCalculator)
- ✅ Record settlements between users
- ✅ Settlement suggestions in group view
- ✅ Balance tracking with floating-point precision handling
- ✅ Feature tests for balance calculations

### 5. Frontend (100%)
- ✅ React 19 + TypeScript + Inertia.js v2
- ✅ Tailwind CSS v4 with dark mode support
- ✅ Radix UI components for accessibility
- ✅ Responsive layouts (mobile, tablet, desktop)
- ✅ App layout with sidebar navigation
- ✅ Settings pages (profile, password, 2FA, appearance)
- ✅ Dialog-based forms (Add Expense, Add Member, Record Settlement)
- ✅ Toast notifications for user feedback
- ✅ Breadcrumb navigation
- ✅ Dynamic group sidebar with expense/member counts

### 6. Database & Architecture (100%)
- ✅ Well-normalized schema (users, groups, expenses, expense_shares, settlements)
- ✅ Eloquent relationships with proper type hints
- ✅ Migrations with foreign keys and cascades
- ✅ Model factories for all entities
- ✅ Realistic database seeder (5 users, 3 groups, multiple expenses)
- ✅ Service layer for business logic (ExpenseSplitCalculator, BalanceCalculator)
- ✅ Form Request validation classes

### 7. Testing & Code Quality (90%)
- ✅ Pest v4 test suite (Feature + Unit tests)
- ✅ Authorization tests (policies)
- ✅ Validation tests
- ✅ Laravel Pint configuration (code formatter)
- ✅ Comprehensive CLAUDE.md guidelines (Laravel Boost + Best Practices)

---

## 🔨 RECOMMENDED IMPROVEMENTS

### Priority 1: Critical Features (High Impact, Should Implement)

#### 1.1 Enhanced Group Management
- [ ] **Remove members from groups**
  - Route: `DELETE /groups/{group}/members/{user}`
  - Policy: Only group members can remove others
  - Business rule: Cannot remove member with unsettled balances
  - Test: Feature test for removal and edge cases

- [ ] **Leave group functionality**
  - Route: `POST /groups/{group}/leave`
  - Business rule: Cannot leave with unsettled debts
  - UI: Add "Leave Group" button in group settings
  - Test: Feature test for leaving with/without debts

- [ ] **Group ownership/admin roles**
  - Migration: Add `role` column to `group_user` pivot (admin, member)
  - Admin permissions: Remove members, delete group, change settings
  - UI: Show admin badge, restrict actions
  - Test: Policy tests for admin-only operations

#### 1.2 Expense Enhancements
- [ ] **Expense categories as enum or config**
  - Currently: Free text field
  - Improvement: Predefined categories (Food, Transport, Utilities, Entertainment, etc.)
  - UI: Select dropdown with custom option
  - Test: Validation tests

- [ ] **Recurring expenses**
  - Fields: `is_recurring`, `frequency` (daily, weekly, monthly), `end_date`
  - Command: `php artisan expenses:create-recurring` (scheduled daily)
  - UI: Toggle for recurring, frequency selector
  - Test: Feature test + scheduled command test

- [ ] **Expense comments/notes**
  - Table: `expense_comments` (expense_id, user_id, comment, created_at)
  - UI: Comment thread in expense detail modal
  - Real-time: Polling or Echo for new comments
  - Test: Feature tests for CRUD operations

- [ ] **Filter and search expenses**
  - Filters: Date range, category, amount range, payer, group
  - Search: Description text search
  - UI: Filter panel on expenses index page
  - Test: Feature tests for all filter combinations

#### 1.3 Settlement Improvements
- [ ] **Settlement history view**
  - Page: `/settlements` or tab in group view
  - Display: Timeline of all settlements with details
  - UI: Filterable by date, group, users
  - Test: Feature test for viewing permissions

- [ ] **Undo settlement (within timeframe)**
  - Business rule: Allow undo within 24 hours
  - Soft delete: Add `deleted_at` to settlements table
  - UI: "Undo" button on recent settlements
  - Test: Time-based feature tests

- [ ] **Settlement attachments/proof**
  - Field: `proof_image` on settlements table
  - Storage: `storage/settlements/`
  - UI: Upload receipt when recording payment
  - Test: File upload tests

#### 1.4 Testing Gaps
- [ ] **Browser tests (Pest v4)**
  - Create group flow (end-to-end)
  - Add expense with different split types
  - Record settlement flow
  - 2FA setup flow
  - Dark mode toggle verification
  - Directory: `tests/Browser/`

- [ ] **API tests (if API is exposed)**
  - Currently: No dedicated API routes
  - If needed: Test JSON responses, API authentication (Sanctum)

---

### Priority 2: User Experience (Medium Impact, Nice to Have)

#### 2.1 Dashboard Enhancements
- [ ] **Actual dashboard page (instead of redirect)**
  - Overview: Total you owe, total owed to you across all groups
  - Recent activity: Last 10 expenses/settlements
  - Charts: Spending by category (monthly/weekly)
  - Quick actions: Create group, add expense
  - Test: Feature test for dashboard data accuracy

- [ ] **Notifications system**
  - Events: New expense, settlement recorded, member added
  - Channels: In-app, email (optional)
  - Table: `notifications` (Laravel built-in)
  - UI: Bell icon with dropdown, mark as read
  - Test: Notification dispatch tests

- [ ] **Activity feed per group**
  - Display: Chronological list of expenses, settlements, member changes
  - UI: Tab in group show page
  - Implementation: Use Laravel's activity log pattern or custom
  - Test: Feature test for feed generation

#### 2.2 Mobile & Responsive
- [ ] **Progressive Web App (PWA)**
  - Manifest: `public/manifest.json`
  - Service worker: Offline capability
  - Icons: Add app icons (192x192, 512x512)
  - Test: Manual testing on mobile devices

- [ ] **Mobile-first expense creation**
  - Camera integration: Take photo directly for receipt
  - Voice input: Describe expense via speech-to-text
  - UI: Optimize form for thumb-friendly tapping
  - Test: Browser tests on mobile viewports

#### 2.3 Data Visualization
- [ ] **Expense charts and analytics**
  - Library: Chart.js or Recharts (React)
  - Views:
    - Spending trends (line chart over time)
    - Category breakdown (pie chart)
    - Per-person spending (bar chart)
  - Page: `/groups/{id}/analytics`
  - Test: Unit tests for data aggregation

- [ ] **Export functionality**
  - Formats: CSV, PDF
  - Scope: Group expenses, settlements, balances
  - Package: `maatwebsite/excel` or `barryvdh/laravel-dompdf`
  - UI: "Export" button on group/expense pages
  - Test: Feature tests for file generation

#### 2.4 User Experience Polish
- [ ] **Onboarding flow for new users**
  - Steps: Create first group → Add members → Create expense
  - UI: Modal wizard or dedicated onboarding page
  - Storage: Track onboarding_completed in users table
  - Test: Feature test for completion tracking

- [ ] **Empty states with helpful CTAs**
  - No groups: "Create your first group" with visual
  - No expenses: "Add your first expense" with example
  - No members: "Invite friends to get started"
  - UI: Replace empty tables with illustrated states

- [ ] **Keyboard shortcuts**
  - Actions: `N` = New expense, `G` = Go to groups, `/` = Search
  - Library: Use React hotkeys library
  - UI: Help modal showing all shortcuts (`?` key)
  - Test: Browser tests for shortcuts

- [ ] **Optimistic UI updates**
  - Use Inertia.js v2 features: Prefetching, optimistic updates
  - Examples: Instant settlement recording, expense creation feedback
  - Implementation: Update local state before server response
  - Test: Manual testing for perceived performance

---

### Priority 3: Advanced Features (Low Priority, Future Enhancements)

#### 3.1 Multi-Currency Support
- [ ] **Currency per expense**
  - Field: `currency` (USD, EUR, GBP, etc.) on expenses
  - Conversion: Real-time API (e.g., exchangerate-api.io)
  - Display: Show original and converted amounts
  - Test: Feature tests with mocked exchange rates

- [ ] **Currency preferences**
  - User setting: Default currency
  - Group setting: Primary currency
  - UI: Currency selector in settings
  - Test: Unit tests for conversion logic

#### 3.2 Integration Features
- [ ] **Payment gateway integration**
  - Provider: Stripe, PayPal, Venmo API
  - Feature: Direct payment within app
  - Flow: Record settlement → Initiate transfer → Confirm
  - Test: Feature tests with mocked payment responses

- [ ] **Import expenses from bank/credit card**
  - Integration: Plaid API or CSV upload
  - Mapping: Auto-categorize based on merchant
  - UI: Import wizard
  - Test: Feature tests for CSV parsing

- [ ] **Share expense link (public view)**
  - Feature: Generate shareable link for expense
  - Use case: Show receipt to non-users
  - Security: UUID-based public URLs, optional password
  - Test: Feature tests for public access

#### 3.3 Social Features
- [ ] **Friend system**
  - Table: `friendships` (user_id, friend_id, status)
  - UI: Friend list, send/accept requests
  - Benefit: Quick member addition to groups
  - Test: Feature tests for friendship lifecycle

- [ ] **Group templates**
  - Examples: "Roommates", "Trip", "Dinner"
  - Pre-configured: Categories, common expenses
  - UI: Select template when creating group
  - Test: Unit tests for template application

#### 3.4 Gamification
- [ ] **Achievements and badges**
  - Examples: "Settled all debts", "10 expenses tracked"
  - Storage: `user_achievements` table
  - UI: Profile page with badge collection
  - Test: Feature tests for achievement unlocks

---

## 🐛 POTENTIAL BUGS & EDGE CASES TO TEST

### Known Edge Cases to Verify
1. **Float precision in settlements**
   - Current: 0.01 threshold in BalanceCalculator
   - Test: Very small amounts (< $0.01), large amounts with rounding

2. **Concurrent expense edits**
   - Scenario: Two users edit same expense simultaneously
   - Current: Last write wins (no optimistic locking)
   - Solution: Add `version` column, implement optimistic locking

3. **User deletion with existing expenses**
   - Current: Foreign keys may prevent deletion
   - Solution: Soft delete users, anonymize instead of hard delete
   - Test: Feature test for user deletion

4. **Group with zero members (after all leave)**
   - Current: Not possible (no leave function yet)
   - Prevention: Auto-delete groups with no members

5. **Expense with zero participants**
   - Current: Validation should prevent this
   - Test: Validation test for minimum participants

6. **Settlement exceeds owed amount**
   - Current: No validation
   - Fix: Add validation in StoreSettlementRequest
   - Test: Feature test for over-settlement

7. **Image upload limits and validation**
   - Current: No explicit size/type limits visible
   - Check: Validation rules in StoreExpenseRequest, StoreGroupRequest
   - Add: Max size (5MB), allowed types (jpg, png, gif)

---

## 🔒 SECURITY ENHANCEMENTS

### Recommended Security Improvements
1. **Rate limiting on expensive operations**
   - Current: Only on login/2FA
   - Add: Group creation, expense creation (prevent abuse)
   - Implementation: Middleware with custom limiters

2. **Content Security Policy (CSP)**
   - Add: CSP headers in middleware
   - Restrict: Script sources, image sources
   - Test: Browser console for violations

3. **Audit log for sensitive operations**
   - Track: Group deletion, member removal, expense edits
   - Table: `audit_logs` (user_id, action, model_type, model_id, changes)
   - UI: Admin view of audit trail

4. **Email verification enforcement**
   - Current: `verified` middleware exists
   - Check: Ensure all protected routes require verification
   - Test: Feature tests for unverified user access

5. **CSRF protection verification**
   - Current: Laravel CSRF enabled by default
   - Test: Ensure all POST/PUT/DELETE requests protected
   - Check: Inertia form submission includes CSRF token

---

## 📊 PERFORMANCE OPTIMIZATIONS

### Database Performance
1. **Add database indexes**
   ```sql
   -- Suggested indexes for common queries
   expenses: index on [group_id, expense_date]
   expense_shares: composite index on [expense_id, user_id]
   settlements: composite index on [group_id, settled_at]
   group_user: index on [user_id, group_id]
   ```

2. **Eager loading optimization**
   - Audit: Check for N+1 queries in GroupController, ExpenseController
   - Tool: Laravel Debugbar or Telescope
   - Fix: Add `with()` for relationships

3. **Query result caching**
   - Cache: Group balances (invalidate on expense/settlement change)
   - Cache: User's groups list (invalidate on membership change)
   - Implementation: Cache facade with tagged caching

4. **Pagination everywhere**
   - Current: Expenses paginated (20 per page)
   - Add: Groups list (if user has many), settlements list

### Frontend Performance
1. **Image optimization**
   - Compress: Receipt and group images on upload
   - Package: `intervention/image`
   - Generate: Thumbnails for list views

2. **Code splitting**
   - Split: Each page as separate chunk (Vite automatic)
   - Lazy load: Heavy components (charts, image modals)

3. **Asset optimization**
   - Minify: CSS and JS in production
   - Current: Vite handles this (verify build config)

---

## 📝 DOCUMENTATION

### Missing Documentation
1. **README.md enhancements**
   - Add: Screenshots of key features
   - Add: Architecture diagram (models, relationships)
   - Add: Deployment guide (Laravel Forge, Docker, etc.)

2. **API documentation (if exposed)**
   - Tool: Laravel Scribe or Swagger
   - Generate: Endpoint docs from controllers

3. **User guide/wiki**
   - How to: Create group, split expenses, settle debts
   - FAQs: Common questions about split types
   - Platform: GitHub Wiki or in-app help section

4. **Developer documentation**
   - Service layer: Explain ExpenseSplitCalculator algorithm
   - Testing guide: How to run tests, write new ones
   - Contributing guide: Code style, PR process

---

## 🚀 DEPLOYMENT & DEVOPS

### Deployment Checklist
1. **Environment configuration**
   - [ ] APP_ENV=production
   - [ ] APP_DEBUG=false
   - [ ] APP_KEY generated
   - [ ] Database credentials
   - [ ] Mail configuration (for Fortify emails)
   - [ ] Storage link: `php artisan storage:link`

2. **CI/CD Pipeline**
   - [ ] GitHub Actions workflow
   - [ ] Run tests on PR
   - [ ] Lint with Pint
   - [ ] Type check with PHPStan (optional)
   - [ ] Deploy on merge to main

3. **Monitoring & Logging**
   - [ ] Error tracking: Sentry or Flare
   - [ ] Application monitoring: Laravel Pulse
   - [ ] Log aggregation: Papertrail or CloudWatch

4. **Backup strategy**
   - [ ] Daily database backups
   - [ ] Storage folder backups (images)
   - [ ] Backup verification routine

---

## 📈 METRICS & KPIs TO TRACK

### Application Metrics
- Active users (daily, monthly)
- Groups created per user
- Expenses tracked per group
- Average settlement time (expense created → settled)
- Split type usage distribution
- Feature adoption (2FA, dark mode, etc.)

### Technical Metrics
- API response times (if exposed)
- Database query performance
- Error rates by endpoint
- Test coverage percentage

---

## 🎯 NEXT STEPS PRIORITY RECOMMENDATION

### Immediate (This Week)
1. ✅ Generate this task plan (DONE)
2. Run full test suite to ensure everything passes
3. Add remove member functionality (Priority 1.1)
4. Add expense categories enum (Priority 1.2)
5. Write browser tests for critical flows (Priority 1.4)

### Short-term (Next 2 Weeks)
1. Implement settlement history view (Priority 1.3)
2. Create actual dashboard page (Priority 2.1)
3. Add expense filtering and search (Priority 1.2)
4. Address float precision edge cases (Potential Bugs #1)
5. Add database indexes (Performance #1)

### Medium-term (Next Month)
1. Notifications system (Priority 2.1)
2. Export functionality (Priority 2.3)
3. PWA conversion (Priority 2.2)
4. Audit logging (Security #3)
5. Documentation improvements (Documentation #1)

### Long-term (Next Quarter)
1. Multi-currency support (Priority 3.1)
2. Payment gateway integration (Priority 3.2)
3. Social features (Priority 3.3)
4. Analytics and charts (Priority 2.3)

---

## 📋 SUMMARY

**Current State:** Solid MVP with core features fully implemented
**Test Coverage:** Good (Feature + Unit tests for critical paths)
**Code Quality:** Excellent (follows Laravel best practices)
**Ready for:** Beta testing with real users

**Top 3 Recommended Additions:**
1. Group member management (remove, leave, roles)
2. Enhanced dashboard with overview and analytics
3. Comprehensive browser test suite

**Estimated Effort:**
- Priority 1 items: ~40 hours
- Priority 2 items: ~60 hours
- Priority 3 items: ~80 hours

---

*Generated by Claude Code - This is a living document and should be updated as features are completed.*
