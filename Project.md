# CodeCraft - Interactive Code Learning Platform

## Table of Contents
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Premium Features](#premium-features)
- [Roadmap](#roadmap)
- [User Roles & Permissions](#user-roles--permissions)
- [Gamification System](#gamification-system)
- [API Documentation](#api-documentation)

## Features

### Code Editor
- **Multi-language Support**: JavaScript (free), Python, Ruby, Java, etc. (Pro)
- **Real-time Execution**: Code runs on secure backend
- **Custom Theme Support**: Multiple editor themes available
- **Auto-save**: Automatically saves code progress
- **Output Panel**: Clear display of execution results and errors

### Streak System
- **Daily Coding Streaks**: Track consecutive days of coding
- **Streak Protection**: 48-hour grace period
- **Visual Indicators**: 
  - 🔥 Active streak
  - ⚠️ Streak at risk
  - Status indicators and countdown timers
- **Milestone Tracking**: Special achievements for streak milestones

### User Profiles
- **Progress Tracking**: XP and level system
- **Achievement Showcase**: Display earned badges and milestones
- **Activity History**: Track coding sessions and achievements
- **Custom Avatars**: Personalized profile images

### Code Snippets
- **Save & Share**: Store and share code snippets
- **Language Categories**: Organize snippets by programming language
- **Public/Private**: Control snippet visibility
- **Social Features**: Like and comment on snippets

## Technical Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - ShadcnUI for component library
  - Custom animations and transitions
- **State Management**: Zustand for local state
- **Code Editor**: Monaco Editor

### Backend
- **Database & Backend**: Convex
  - Real-time data synchronization
  - Serverless functions
  - Built-in caching
- **Authentication**: Clerk
  - Social login providers
  - User management
  - Role-based access control

### Additional Tools
- **Code Execution**: Piston API
- **Image Storage**: DiceBear for avatars
- **Monitoring**: (To be implemented)

## Premium Features

### Current Pro Features
- **Extended Language Support**: Access to all programming languages
- **Streak Freeze**: Protect your streak when you miss a day
- **Priority Support**: Faster response to issues

### Planned Premium Features
- **Advanced Code Analytics**: Insights into coding patterns
- **Interactive Courses**: Structured learning paths
- **Private Snippets**: Unlimited private code storage
- **Team Features**: Collaborate with other developers
- **Custom Themes**: Create and save custom editor themes

## Roadmap

### Short-term Goals
1. **Social Features**
   - User following system
   - Activity feed
   - Social sharing improvements

2. **Learning Features**
   - Daily coding challenges
   - Interactive tutorials
   - Code review system

3. **Collaboration Tools**
   - Real-time collaborative coding
   - Code comments and annotations
   - Share execution results

### Long-term Goals
1. **Integration Features**
   - GitHub/GitLab integration
   - VS Code extension
   - Mobile app development

2. **AI Features**
   - Code suggestions
   - Automated code review
   - Learning path recommendations

3. **Community Features**
   - User-created challenges
   - Mentorship system
   - Community forums

## User Roles & Permissions

### Current System
- **Free Users**: Basic features and JavaScript
- **Pro Users**: All languages and premium features

### Planned Roles
- **Admin**: Full system access and management
- **Moderator**: Content moderation and user management
- **Teacher**: Course creation and student management
- **Student**: Access to learning materials

### Role Capabilities
```typescript
interface UserRoles {
  admin: {
    canManageUsers: true;
    canModerateContent: true;
    canManageSystem: true;
  };
  moderator: {
    canModerateContent: true;
    canManageReports: true;
  };
  pro: {
    allLanguages: true;
    premiumFeatures: true;
  };
  free: {
    basicFeatures: true;
    javascriptOnly: true;
  };
}
```

## Gamification System

### Experience Points (XP)
- **Coding Sessions**: XP for daily coding
- **Challenges**: Bonus XP for completing challenges
- **Streaks**: Additional XP for maintaining streaks
- **Achievements**: Special XP rewards

### Achievements
```typescript
interface Achievement {
  key: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
}
```

### Streak Milestones
- 3 Days: "Getting Started" (100 XP)
- 7 Days: "Weekly Warrior" (250 XP)
- 14 Days: "Fortnight Fighter" (500 XP)
- 30 Days: "Monthly Master" (1000 XP)
- 50 Days: "Coding Champion" (2000 XP)
- 100 Days: "Century Coder" (5000 XP)
- 365 Days: "Year of Code" (20000 XP)

## API Documentation

### Authentication
```typescript
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/user
```

### Code Execution
```typescript
POST /api/code/execute
Body: {
  language: string;
  code: string;
}
```

### Streaks
```typescript
GET /api/streaks/current
POST /api/streaks/check
POST /api/streaks/recover
```

### Snippets
```typescript
GET /api/snippets
POST /api/snippets/create
PUT /api/snippets/:id
DELETE /api/snippets/:id
```

### User Progress
```typescript
GET /api/user/progress
POST /api/user/xp
GET /api/user/achievements
```

### Webhooks
```typescript
POST /api/webhooks/clerk
POST /api/webhooks/stripe
```

### Rate Limits
- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour
- Burst limit: 10 requests/second

---

## Contributing
Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 

[Achievements] [Level] [Streak] [Profile] 