# Fix Infinite Rendering (Token Deletion Loop)

## Plan Breakdown
- [x] Step 1: Edit AuthContext.tsx - Remove auto-fetch useEffect
- [x] Step 2: Edit apiClient.ts - Fix interceptor retry logic (prevent retry after refresh failure)
- [ ] Step 3: Test - Delete tokens/cookies → should redirect cleanly without infinite renders
- [ ] Step 4: Verify Profile page loads once without looping
- [ ] Step 5: Complete task ✅

