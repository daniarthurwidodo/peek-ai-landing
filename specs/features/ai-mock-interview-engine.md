# Feature Spec: AI Mock Interview Engine

**Author:** Product Team  
**Date:** 2026-02-14  
**Status:** Approved  
**Priority:** P0

---

## 1. Overview

### 1.1 Summary
Build an AI-powered mock interview engine that simulates realistic interview scenarios, generates contextually relevant questions, and provides an interactive interview experience for users to practice their skills.

### 1.2 Goals
- Enable users to practice interviews with AI
- Generate industry and role-specific questions
- Provide natural conversation flow
- Support both text and voice input
- Create realistic interview scenarios

### 1.3 Non-Goals
- Video-based interviews (Phase 3)
- Body language analysis (Phase 3)
- Multi-interviewer scenarios (Phase 3)
- Live human interviewer matching (separate feature)

---

## 2. Background

### 2.1 Problem Statement
Job seekers struggle to practice interviews effectively due to:
- Limited access to practice partners
- Expensive interview coaching ($100-300/session)
- Lack of immediate feedback
- Difficulty simulating realistic scenarios
- No way to practice at their own pace

### 2.2 User Research
- 87% of users want AI-powered practice
- Average user willing to pay $5-10/month
- Users prefer text input initially (voice as enhancement)
- Most common request: technical and behavioral questions
- Users want 15-30 minute practice sessions

### 2.3 Competitive Analysis
- **InterviewBuddy:** Human coaches, expensive ($50/session)
- **Pramp:** Peer-to-peer, scheduling friction
- **LeetCode:** Code-only, no behavioral practice
- **Gap:** Affordable AI with comprehensive question types

---

## 3. User Stories

### 3.1 Primary User Story
**As a** job seeker  
**I want** to practice interviews with an AI assistant  
**So that** I can improve my interview skills without expensive coaching

### 3.2 Additional User Stories

**As a** software engineer  
**I want** technical coding questions  
**So that** I can prepare for technical interviews

**As a** career switcher  
**I want** industry-specific questions  
**So that** I can learn new industry norms

**As a** recent graduate  
**I want** behavioral questions  
**So that** I can practice answering common interview questions

---

## 4. Requirements

### 4.1 Functional Requirements
- [ ] User can start a new interview session
- [ ] User can select industry (tech, finance, healthcare, etc.)
- [ ] User can select role level (entry, mid, senior)
- [ ] User can select interview type (technical, behavioral, case study)
- [ ] AI generates contextually relevant questions
- [ ] User can answer via text input
- [ ] AI provides follow-up questions based on answers
- [ ] Session includes 5-10 questions
- [ ] User can pause and resume sessions
- [ ] User can end session early
- [ ] Session history is saved

### 4.2 Non-Functional Requirements
- **Performance:** Question generation <3 seconds
- **Performance:** Response analysis <5 seconds
- **Reliability:** 99.5% uptime
- **Security:** User data encrypted
- **Accessibility:** WCAG AA compliant
- **Scalability:** Support 1000 concurrent sessions

### 4.3 Acceptance Criteria
- [ ] User can complete full interview session
- [ ] Questions are relevant to selected industry/role
- [ ] AI maintains conversation context
- [ ] Session data persists correctly
- [ ] Error handling for API failures
- [ ] Loading states for all async operations
- [ ] Mobile responsive interface

---

## 5. Design

### 5.1 User Flow

```
1. User clicks "Start Interview"
2. User selects:
   - Industry (dropdown)
   - Role level (dropdown)
   - Interview type (radio buttons)
3. User clicks "Begin"
4. Loading screen (2-3 seconds)
5. Interview interface appears
6. AI asks first question
7. User types answer
8. User clicks "Submit Answer"
9. Loading indicator (3-5 seconds)
10. AI provides brief feedback
11. AI asks follow-up or next question
12. Repeat steps 7-11 for 5-10 questions
13. Session complete screen
14. View detailed feedback (separate feature)
```

### 5.2 Wireframes

**Interview Setup Screen**
```
┌─────────────────────────────────────┐
│  Start Your Mock Interview          │
│                                      │
│  Industry: [Dropdown ▼]             │
│  Role Level: [Dropdown ▼]           │
│  Interview Type:                     │
│    ○ Technical                       │
│    ○ Behavioral                      │
│    ○ Case Study                      │
│                                      │
│  [Begin Interview]                   │
└─────────────────────────────────────┘
```

**Interview Interface**
```
┌─────────────────────────────────────┐
│  Question 3 of 8          [End] [⏸] │
├─────────────────────────────────────┤
│                                      │
│  AI: Tell me about a time when you  │
│  had to work with a difficult team  │
│  member. How did you handle it?     │
│                                      │
├─────────────────────────────────────┤
│  Your Answer:                        │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │  [Type your answer here...]     ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                      │
│  [Submit Answer]                     │
└─────────────────────────────────────┘
```

### 5.3 Visual Design
- Clean, distraction-free interface
- Large text area for answers
- Clear question display
- Progress indicator
- Calming color scheme (blues, whites)

---

## 6. Technical Approach

### 6.1 Architecture

```
┌──────────────┐
│   Frontend   │
│  (Next.js)   │
└──────┬───────┘
       │
┌──────▼───────────────────┐
│  Interview Service       │
│  (Business Logic)        │
└──────┬───────────────────┘
       │
       ├─────────────┬──────────────┐
       │             │              │
┌──────▼──────┐ ┌───▼────────┐ ┌──▼──────────┐
│  Interview  │ │   OpenAI   │ │  Question   │
│  Repository │ │   Client   │ │  Repository │
└─────────────┘ └────────────┘ └─────────────┘
```

### 6.2 API Design

**Start Interview**
```typescript
POST /api/interviews
Request:
{
  "industry": "technology",
  "roleLevel": "mid",
  "interviewType": "behavioral"
}

Response:
{
  "id": "interview_123",
  "status": "in_progress",
  "currentQuestion": {
    "id": "q_1",
    "text": "Tell me about yourself",
    "number": 1,
    "totalQuestions": 8
  }
}
```

**Submit Answer**
```typescript
POST /api/interviews/:id/answer
Request:
{
  "questionId": "q_1",
  "answer": "I am a software engineer with 5 years..."
}

Response:
{
  "feedback": "Good start. Can you elaborate on...",
  "nextQuestion": {
    "id": "q_2",
    "text": "What are your strengths?",
    "number": 2,
    "totalQuestions": 8
  }
}
```

**End Interview**
```typescript
POST /api/interviews/:id/end
Response:
{
  "id": "interview_123",
  "status": "completed",
  "summary": {
    "questionsAnswered": 8,
    "duration": "25 minutes",
    "overallScore": 7.5
  }
}
```

### 6.3 Database Changes

**New Tables:**

```typescript
// interviews table
{
  id: string (PK)
  userId: string (FK)
  industry: string
  roleLevel: string
  interviewType: string
  status: enum ('pending', 'in_progress', 'completed', 'abandoned')
  startedAt: timestamp
  completedAt: timestamp
  duration: number (seconds)
  createdAt: timestamp
  updatedAt: timestamp
}

// interview_questions table
{
  id: string (PK)
  interviewId: string (FK)
  questionNumber: number
  questionText: text
  answer: text
  feedback: text
  score: number (1-10)
  createdAt: timestamp
}

// question_bank table
{
  id: string (PK)
  industry: string
  roleLevel: string
  interviewType: string
  questionText: text
  category: string
  difficulty: enum ('easy', 'medium', 'hard')
  createdAt: timestamp
}
```

### 6.4 Third-Party Integrations

**OpenAI API**
- Model: GPT-4
- Purpose: Question generation, answer analysis
- Cost: ~$0.03 per interview session
- Rate limit: 10,000 requests/day

**Prompt Engineering:**
```typescript
const systemPrompt = `You are an experienced interviewer conducting a ${interviewType} interview for a ${roleLevel} ${industry} position. 

Ask relevant, thoughtful questions and provide constructive feedback. Maintain a professional yet friendly tone.

Current question number: ${questionNumber} of ${totalQuestions}
Previous context: ${previousAnswers}

Generate the next question based on the candidate's previous answers.`;
```

---

## 7. Implementation Plan

### 7.1 Phases

**Phase 1: Core Engine (Week 1-2)**
- Interview session management
- Question generation
- Answer submission
- Basic feedback

**Phase 2: Enhanced Features (Week 3)**
- Question bank integration
- Improved feedback quality
- Session pause/resume
- Progress tracking

**Phase 3: Polish (Week 4)**
- UI refinements
- Performance optimization
- Error handling
- Testing

### 7.2 Tasks

**Backend:**
- [ ] Create database schema (1 day)
- [ ] Implement InterviewService (2 days)
- [ ] Integrate OpenAI API (2 days)
- [ ] Build question bank (2 days)
- [ ] Create API endpoints (2 days)
- [ ] Add error handling (1 day)
- [ ] Write tests (2 days)

**Frontend:**
- [ ] Design interview UI (1 day)
- [ ] Build setup screen (1 day)
- [ ] Build interview interface (2 days)
- [ ] Implement state management (1 day)
- [ ] Add loading states (1 day)
- [ ] Error handling (1 day)
- [ ] Write tests (2 days)

**Total Estimate:** 20 days (4 weeks)

### 7.3 Dependencies
- OpenAI API access
- Database migrations
- User authentication (Clerk)
- Subscription validation

---

## 8. Testing Strategy

### 8.1 Unit Tests
- InterviewService methods
- Question generation logic
- Answer validation
- Feedback generation

### 8.2 Integration Tests
- API endpoint flows
- Database operations
- OpenAI integration
- Session state management

### 8.3 E2E Tests
- Complete interview flow
- Pause and resume
- Early termination
- Error scenarios

### 8.4 Manual Testing
- Different industries/roles
- Various answer lengths
- Edge cases (empty answers, very long answers)
- Mobile responsiveness

---

## 9. Rollout Plan

### 9.1 Feature Flags
- `ai_interview_enabled`: Master toggle
- `ai_interview_voice`: Voice input (Phase 2)
- `ai_interview_advanced`: Advanced features

### 9.2 Gradual Rollout
- Week 1: Internal testing (team only)
- Week 2: Beta users (10% of users)
- Week 3: Expand to 50% of users
- Week 4: Full rollout (100%)

### 9.3 Monitoring
- Interview completion rate
- Average session duration
- Question generation latency
- OpenAI API costs
- Error rates
- User satisfaction scores

### 9.4 Rollback Plan
- Disable feature flag
- Redirect to coming soon page
- Preserve user data
- Communicate with affected users

---

## 10. Success Metrics

### 10.1 Key Metrics
- **Completion Rate:** >70% of started interviews completed
- **Session Duration:** 15-30 minutes average
- **User Satisfaction:** >4.0/5.0 rating
- **Daily Active Users:** 100+ within first month
- **Cost per Interview:** <$0.05

### 10.2 Measurement Plan
- Track via analytics dashboard
- Weekly review of metrics
- User surveys after sessions
- A/B testing for improvements

---

## 11. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| High OpenAI costs | High | Medium | Implement caching, optimize prompts, set usage limits |
| Poor question quality | High | Medium | Curate question bank, fine-tune prompts, user feedback |
| API rate limits | Medium | Low | Implement queuing, upgrade plan, cache responses |
| Low completion rates | High | Medium | Improve UX, shorter sessions, better onboarding |
| Technical failures | Medium | Low | Error handling, fallback questions, monitoring |

---

## 12. Timeline

| Milestone | Date | Owner |
|-----------|------|-------|
| Spec Approval | 2026-02-14 | Product Team |
| Development Start | 2026-02-17 | Engineering |
| Backend Complete | 2026-03-03 | Backend Team |
| Frontend Complete | 2026-03-10 | Frontend Team |
| Testing Complete | 2026-03-14 | QA Team |
| Beta Launch | 2026-03-17 | Product Team |
| Full Launch | 2026-03-31 | Product Team |

---

## 13. Open Questions

- [x] Which OpenAI model to use? → GPT-4 for quality
- [x] How many questions per session? → 5-10 questions
- [ ] Should we support multiple languages?
- [ ] How to handle inappropriate user responses?
- [ ] What's the fallback if OpenAI is down?

---

## 14. Appendix

### 14.1 References
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Interview Best Practices Research](internal-link)
- [Competitor Analysis](internal-link)
- [User Research Findings](internal-link)

### 14.2 Change Log
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-14 | 1.0 | Initial draft | Product Team |
| 2026-02-14 | 1.1 | Added technical details | Engineering |
| 2026-02-14 | 1.2 | Approved for implementation | Tech Lead |
