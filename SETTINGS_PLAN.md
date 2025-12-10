# Settings Screen Plan

## Design Overview
- **Background**: `#FFF4E9` (consistent with app)
- **Primary Color**: `#43274F` (buttons, accents)
- **Text Color**: `#3C2A3E` (headers, labels)
- **Card Colors**: Warm tones matching existing cards
- **Layout**: ScrollView with card-based sections

## Sections

### 1. Profile Header
- User name (large, prominent)
- Profile icon/avatar placeholder
- Member since date

### 2. Quick Stats Card
- Current streak (from activity_logs)
- Current weight vs ideal weight
- Days until goal (calculated)
- Water goal progress

### 3. Personal Information (Editable)
- **Name** - Text input with edit button
- **Age** - Number input with edit button
- **Gender** - Dropdown selector (female/male/other)
- **Height** - Slider or number input (cm/ft toggle)
- **Current Weight** - Slider or number input (kg/lbs toggle)
- **Ideal Weight** - Slider or number input (kg/lbs toggle)

### 4. Goals & Preferences (Editable)
- **Food Goal** - Card selector (lose/healthy/gain)
- **Activity Level** - Card selector (low/moderate/high)
- **Diet Type** - Card selector (clean/mediterranean/keto/lowcarb)
- **Water Goal** - Number input with +/- buttons

### 5. Account Settings
- **Email** - Display only (from auth)
- **Change Password** - Button to password reset flow
- **Logout** - Red button at bottom

## Component Structure

```
SettingsScreen
├── ScrollView
    ├── ProfileHeader
    ├── QuickStatsCard
    ├── PersonalInfoSection
    │   ├── EditableField (Name)
    │   ├── EditableField (Age)
    │   ├── EditableField (Gender)
    │   ├── EditableField (Height)
    │   ├── EditableField (Weight)
    │   └── EditableField (Ideal Weight)
    ├── GoalsSection
    │   ├── GoalSelector (Food Goal)
    │   ├── GoalSelector (Activity Level)
    │   ├── GoalSelector (Diet Type)
    │   └── GoalSelector (Water Goal)
    └── AccountSection
        ├── EmailDisplay
        ├── ChangePasswordButton
        └── LogoutButton
```

## Edit Flow
- Each editable field shows current value
- Tap to open edit modal/sheet
- Save updates Supabase
- Loading states during save
- Success feedback

## Features
- Real-time data fetching from Supabase
- Optimistic UI updates
- Error handling with user feedback
- Loading states
- Form validation






