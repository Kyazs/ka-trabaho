# Phase 01: AI Job Matching Feature - Context

**Gathered:** 2026-06-14
**Status:** Ready for planning
**Source:** Codebase analysis + existing implementation plan

## Phase Boundary

This phase implements and completes the AI Job Matching feature, which includes:
- Backend API endpoint for job recommendations
- Frontend Job Market tab UI
- Integration between course matching and job matching
- Cross-tab navigation (jobs → courses → chat)
- Testing and validation of the full flow

## Implementation Decisions

### Locked Decisions
- D-01: Use existing `/api/job-recommendation` endpoint structure (already implemented in server.ts)
- D-02: Use existing `JobRole` data from `SECTORS_DATA` for enrichment
- D-03: Keep bilingual Taglish/English support throughout
- D-04: Use existing color scheme (emerald/teal for jobs, blue/indigo for courses)
- D-05: Mobile-first responsive design using Tailwind CSS
- D-06: Use existing `Briefcase`, `GraduationCap`, `Info` icons from lucide-react

### the agent's Discretion
- Exact wording of Taglish translations
- Specific animation timing and easing curves
- Loading state spinner design details
- Badge placement and sizing on job cards

## Specific Ideas

### Integration Points Needed
1. Add "View Matching Jobs" button in course matching results (currently missing)
2. Add job count badge on Jobs tab in Navbar (currently missing)
3. Add "View Courses" button in job results to navigate to Explorer (currently missing)

### Testing Requirements
- API endpoint returns valid JSON with all required fields
- Frontend renders job cards with correct data mapping
- Cross-tab navigation works correctly
- Error states display properly in Taglish/English
- Loading states work correctly
- Disabled button states when no interests/goals selected

## Deferred Ideas

- Advanced job filtering (by salary range, demand level)
- Job bookmarking/saving functionality
- Job application tracking
- Integration with external job boards
- Email notifications for new matching jobs

