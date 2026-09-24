# CycleCare — Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** CycleCare

CycleCare is a private, simple web application that helps users track menstrual cycles, understand upcoming period dates, follow practical precautions, and access general diet and self-care guidance during different stages of the menstrual cycle.

The application should make cycle tracking easy for beginners: the user records when a period starts and when it ends, and the application uses previous cycle information to estimate the next expected period.

> **Important:** CycleCare provides general wellness and educational information. It is not a diagnostic or emergency medical service. The application should clearly advise users to consult a qualified healthcare professional for concerning, unusual, or persistent symptoms.

---

## 2. Problem Statement

Many users manually remember their period dates or use general calendar apps that do not provide menstrual-cycle-specific guidance.

CycleCare should provide one simple place to:

- Record period start and end dates.
- View previous cycles.
- Estimate the next expected period.
- See cycle history on a calendar.
- Understand common precautions and self-care practices.
- Get general nutrition and hydration guidance.
- Understand what information is general guidance versus when professional medical advice may be appropriate.

---

## 3. Goals

### Primary Goals

1. Make period tracking quick and simple.
2. Calculate an estimated next period using recorded cycle history.
3. Display cycle information in a clear calendar.
4. Provide useful general diet and hydration guidance.
5. Provide practical precautions and self-care information.
6. Keep the experience private, calm, and easy to understand.
7. Work well on both desktop and mobile screens.

### Non-Goals

The first version should **not**:

- Diagnose medical conditions.
- Replace a doctor or gynecologist.
- Guarantee an exact future period date.
- Provide prescription medication recommendations.
- Attempt to identify pregnancy or other medical conditions.
- Add unnecessary social/community features.

---

## 4. Target Users

### Primary User

A person who wants a simple private tool for menstrual-cycle tracking and general wellness guidance.

### Experience Level

The application should be understandable even for someone who has never used a period-tracking application before.

---

# 5. Core Features

## 5.1 Dashboard

The dashboard should provide a quick overview of the user's current cycle.

Display:

- Current cycle status.
- Current period day, when applicable.
- Last recorded period start date.
- Last recorded period end date.
- Estimated next period date.
- Estimated days until the next period.
- Average cycle length.
- Recent cycle history.
- Quick access to:
  - Add Period
  - Calendar
  - Diet & Nutrition
  - Precautions & Self-Care

Example:

```text
Your Cycle

Last period:
September 10 – September 14

Estimated next period:
October 8

Estimated cycle length:
28 days

Current status:
Cycle Day 15
```

The UI must clearly label future dates as **estimated**, not guaranteed.

---

## 5.2 Add Period

Users should be able to record a period.

Required fields:

- Period start date
- Period end date

Optional fields:

- Flow: Light / Medium / Heavy
- Symptoms
- Notes

Validation:

- End date cannot be before start date.
- Start date cannot be an invalid date.
- The application should handle incomplete entries gracefully.
- Users should be able to edit or delete an existing period record.

The primary action should be simple:

**Save Period**

---

## 5.3 Cycle Calculation

The application should calculate cycle information from recorded period history.

### Basic calculation

Cycle length should be calculated as:

```text
Current period start date
-
Previous period start date
=
Cycle length
```

Example:

```text
Previous start: August 13
Current start: September 10

Cycle length = 28 days
```

### Next Period Estimate

The application should use the user's historical cycle data to estimate the next period.

For the first version:

- If only one cycle is recorded, use a configurable default cycle length.
- If multiple cycles are recorded, calculate the average cycle length from available historical cycles.
- Use the most recent reliable cycle data.
- Clearly label the result as an estimate.

Example:

```text
Average cycle length: 28 days

Last period started:
September 10

Estimated next period:
October 8
```

The calculation should be designed so it can later be improved without rewriting the entire application.

---

## 5.4 Calendar

Provide a monthly calendar view.

The calendar should visually distinguish:

- Recorded period days.
- Estimated upcoming period days.
- Today's date.
- Other cycle-related information.

Users should be able to:

- Move between months.
- Click a period day to view details.
- Add or edit period information.
- See estimated future period dates.

Do not imply that estimated dates are medically certain.

---

## 5.5 Cycle History

Provide a history page containing previous periods.

Each record should show:

- Start date
- End date
- Period duration
- Cycle length, when available
- Flow, if recorded
- Symptoms, if recorded
- Notes, if recorded

Example:

```text
September 10 – September 14
Duration: 5 days
Cycle length: 28 days
Flow: Medium
```

Users should be able to edit and delete records.

---

# 6. Diet & Nutrition

Create a dedicated **Diet & Nutrition** section.

The content should focus on general healthy eating and hydration during menstruation.

Possible sections:

### During Your Period

General guidance may include:

- Stay hydrated.
- Eat balanced meals.
- Include iron-containing foods.
- Include protein-rich foods.
- Include fruits and vegetables.
- Include fiber-rich foods.
- Choose nutritious sources of calcium and other essential nutrients.
- Eat regular meals according to personal needs.

### Foods to Include

Examples:

- Leafy green vegetables
- Lentils and beans
- Eggs
- Fish or other protein sources
- Yogurt or other calcium-containing foods
- Fruits
- Nuts and seeds
- Whole grains
- Iron-containing foods

### Foods to Limit

Present this carefully as general wellness guidance rather than strict medical rules.

Examples may include:

- Excessively salty foods if they worsen bloating.
- Excessive caffeine if it worsens symptoms.
- Highly processed foods when they replace balanced meals.
- Excessive sugary foods.

The application should avoid presenting any food as universally forbidden.

---

# 7. Precautions & Self-Care

Create a dedicated **Precautions & Self-Care** section.

Topics can include:

- Staying hydrated.
- Getting adequate rest.
- Gentle physical activity when comfortable.
- Maintaining personal hygiene.
- Using suitable menstrual hygiene products.
- Changing menstrual products according to the manufacturer's instructions and normal hygiene practices.
- Using warmth for comfort if helpful.
- Monitoring symptoms.

### When to Seek Medical Advice

The application should include a clear section explaining that professional medical advice may be appropriate for symptoms such as:

- Very heavy or unusual bleeding.
- Severe or worsening pain.
- Fainting or significant weakness.
- Fever or signs of infection.
- Bleeding between periods that is unusual for the individual.
- A significant change from the user's normal cycle.
- Symptoms that persist or interfere substantially with daily activities.

The wording should encourage professional evaluation rather than attempting to diagnose the cause.

---

# 8. Symptom Tracking

Allow users to optionally record symptoms for each period.

Possible symptoms:

- Cramps
- Headache
- Back pain
- Bloating
- Fatigue
- Mood changes
- Breast tenderness
- Nausea
- Other

Users should be able to select multiple symptoms and optionally add notes.

This information should be presented as personal tracking data, not as a diagnosis.

---

# 9. Privacy

Period and symptom information is sensitive personal information.

The application should prioritize privacy.

Requirements:

- Do not expose personal cycle information publicly.
- Do not include cycle data in public URLs.
- Do not display personal information unnecessarily.
- Use secure authentication if accounts are implemented.
- Restrict users to their own records.
- Protect database access with appropriate authorization policies.
- Avoid collecting unnecessary personal information.

If analytics are implemented, sensitive cycle data should not be included in analytics events.

---

# 10. User Authentication

Authentication is optional for the initial prototype but recommended if data needs to persist across devices.

If authentication is implemented:

- Sign up
- Sign in
- Sign out
- Password reset
- User-specific data access

A user must only be able to access their own cycle records.

---

# 11. Suggested Data Model

If a database is used, the initial model can include:

## users

- id
- email
- created_at

## periods

- id
- user_id
- start_date
- end_date
- flow
- notes
- created_at
- updated_at

## symptoms

- id
- period_id
- symptom_type
- notes
- created_at

## cycle_settings

- id
- user_id
- default_cycle_length
- created_at
- updated_at

The schema should remain simple and extensible.

---

# 12. UI/UX Requirements

The design should feel:

- Calm
- Private
- Clean
- Modern
- Friendly
- Easy to understand

Avoid making the interface overly decorative or childish.

### Suggested Visual Direction

Use a soft wellness-oriented design with:

- Clear typography.
- Good spacing.
- Accessible contrast.
- Simple cards.
- Clear calendar states.
- Subtle accent colors.
- Responsive layouts.

The application should not rely on color alone to communicate important information.

For example, period days should have both a visual treatment and a label/state that remains understandable to users with color-vision deficiencies.

---

# 13. Main Pages

### 1. Dashboard

Route example:

```text
/
```

Contains:

- Cycle summary
- Next period estimate
- Recent history
- Quick actions

### 2. Calendar

```text
/calendar
```

Contains:

- Monthly calendar
- Recorded periods
- Estimated periods
- Date details

### 3. Add Period

```text
/periods/new
```

Contains:

- Start date
- End date
- Flow
- Symptoms
- Notes

### 4. History

```text
/history
```

Contains:

- Previous cycles
- Cycle duration
- Period duration
- Edit/delete actions

### 5. Diet & Nutrition

```text
/diet
```

Contains:

- Nutrition guidance
- Hydration
- Foods to include
- Foods to limit

### 6. Precautions

```text
/precautions
```

Contains:

- Self-care
- Hygiene
- Comfort measures
- When to seek medical advice

### 7. Settings

```text
/settings
```

Contains:

- Cycle settings
- Default cycle length
- Account settings
- Privacy information

---

# 14. Responsive Design

The application must work well on:

- Desktop
- Laptop
- Tablet
- Mobile

Mobile should be treated as a first-class experience because users may primarily access the application from their phones.

The calendar, date inputs, forms, cards, and navigation must remain usable on small screens.

---

# 15. Accessibility

The application should:

- Use semantic HTML.
- Provide accessible labels for form controls.
- Support keyboard navigation.
- Maintain readable text contrast.
- Provide meaningful focus states.
- Avoid color-only indicators.
- Use clear error messages.
- Make date fields accessible.

---

# 16. Error Handling

Examples:

### Invalid date range

```text
End date cannot be earlier than the start date.
```

### Missing start date

```text
Please enter the date your period started.
```

### No history

```text
No periods recorded yet.

Add your first period to start tracking your cycle.
```

### Insufficient history

```text
Your next period date is an estimate based on limited cycle history.
Record more cycles to improve the estimate.
```

---

# 17. Medical Safety & Content Rules

The application must use cautious wording.

Do:

- Use phrases such as "may," "can," and "general guidance."
- Explain that cycles naturally vary.
- Encourage professional medical advice when symptoms are concerning.
- Clearly distinguish tracking estimates from medical predictions.

Do not:

- Diagnose diseases.
- Claim that a specific food cures menstrual symptoms.
- Guarantee an exact period date.
- Tell users to stop prescribed medication.
- Provide prescription medication dosing.
- Present general wellness advice as medical treatment.

---

# 18. Containerization & CI/CD

Terraform infrastructure will be created separately by the project owner and is **out of scope for this PRD**.

The application itself should be prepared for containerized deployment and CI/CD.

## Docker Requirements

The project must include:

```text
Dockerfile
.dockerignore
```

### Dockerfile Requirements

The Dockerfile should:

- Use an appropriate production-ready base image.
- Install only required dependencies.
- Build the application in a reproducible way.
- Run the application in production mode.
- Avoid unnecessary development dependencies in the final runtime image.
- Follow the existing framework's recommended production container pattern.
- Expose the application's required port.
- Use environment variables for runtime configuration.
- Avoid hardcoding secrets or credentials.

### .dockerignore

The `.dockerignore` should exclude unnecessary files such as:

```text
node_modules
.next
.git
.env*
npm-debug.log*
Dockerfile
.dockerignore
```

Adjust the list according to the actual project structure.

## GitHub Actions Workflow

The project must include a GitHub Actions workflow:

```text
.github/
└── workflows/
    └── ci.yml
```

The workflow should:

1. Trigger on pushes to the main branch.
2. Trigger on pull requests.
3. Install dependencies.
4. Run linting.
5. Run available tests.
6. Build the application.
7. Build the Docker image.
8. Fail the workflow if any required validation step fails.

The workflow should not require Terraform because Terraform infrastructure is maintained separately.

If container publishing is configured later, image pushing should use GitHub Secrets or another secure credential mechanism. Never hardcode registry credentials.

## CI/CD Principles

- Keep the workflow simple and maintainable.
- Do not add deployment steps that depend on Terraform.
- Do not hardcode secrets.
- Use the existing package manager and project scripts.
- Reuse existing lint/test/build commands when available.
- Do not introduce unnecessary CI services.

---

# 19. Technical Direction

The implementation technology can be selected based on the existing project architecture.

A suitable modern stack could be:

- Frontend: Next.js + TypeScript
- UI: Tailwind CSS + accessible component library
- Backend/data: Supabase if persistent user data is required
- Database: PostgreSQL
- Authentication: Supabase Auth if authentication is required
- Deployment: Vercel or another container-compatible platform
- Infrastructure as Code: Terraform, maintained separately by the project owner

The technology should not be introduced unnecessarily if the project already has an established architecture.

---

# 20. MVP Scope

The first working version should include:

- [x] Dashboard
- [x] Add period
- [x] Edit period
- [x] Delete period
- [x] Period start/end dates
- [x] Cycle-length calculation
- [x] Estimated next period
- [x] Calendar
- [x] Cycle history
- [x] Basic symptom tracking
- [x] Diet & nutrition guidance
- [x] Precautions & self-care guidance
- [x] Responsive UI
- [x] Basic privacy notice
- [x] Medical disclaimer
- [x] Production Dockerfile
- [x] .dockerignore
- [x] GitHub Actions CI workflow

---

# 21. Future Enhancements

These should not be required for the MVP:

- Notifications/reminders
- Period prediction improvements using more historical data
- Export personal cycle data
- PDF reports
- Multiple language support
- Advanced symptom analytics
- PWA/offline support
- Optional pregnancy-related tracking
- Personalized educational content

Future features should only be added after the core tracking experience is stable.

---

# 22. Success Criteria

The MVP is successful when a user can:

1. Open the application.
2. Add the date their period started.
3. Add the date their period ended.
4. See the recorded period on the calendar.
5. See the calculated cycle information.
6. See an estimated next period date.
7. Add symptoms if desired.
8. Review previous periods.
9. Read diet and hydration guidance.
10. Read precautions and self-care information.
11. Understand that predictions are estimates rather than guarantees.
12. Use the application comfortably on a mobile device.

---

# 23. Development Principles

When implementing the application:

1. Investigate the existing project structure before making changes.
2. Follow the existing architecture and conventions.
3. Do not unnecessarily rewrite working functionality.
4. Keep the initial implementation focused on the MVP.
5. Keep medical content conservative and clearly educational.
6. Protect sensitive user data.
7. Validate date calculations carefully.
8. Test calculations with multiple cycle lengths and edge cases.
9. Test the complete user flow from adding a period to displaying the next estimate.
10. Test responsive layouts before considering the MVP complete.
