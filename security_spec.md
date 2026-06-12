# Security Specification: Face Swap Prompt Gallery

This security specification defines our Attribute-Based Access Control (ABAC) invariants, identifies twelve threat vector payloads ("The Dirty Dozen"), and details our Firestore security validation strategy.

---

## 1. Data Invariants

We enforce strict domain rules for all collection subpaths:

### A. Bookmarks (`/users/{userId}/bookmarks/{bookmarkId}`)
- **Read Invariant**: A bookmark document can ONLY be read by the owner `userId` matches the authenticated `request.auth.uid`.
- **Create/Update Invariant**: A bookmark can ONLY be created/written if `userId` matches `request.auth.uid`, `promptId` is a safe string (size <= 128), and `createdAt` is exactly `request.time`.
- **Delete Invariant**: Bookmarks can be deleted by their owners.

### B. Custom Prompts (`/users/{userId}/custom_prompts/{promptId}`)
- **Read Invariant**: A CustomPrompt document can ONLY be read by its creator (`userId == request.auth.uid`).
- **Create Invariant**: A CustomPrompt can ONLY be written if `userId` is the current user (`request.auth.uid`), `title` is a string (<= 100 chars), `imageUrl` is a string (<= 1000 chars), `generationPrompt` is a string (<= 2000 chars), and `createdAt` is exactly `request.time`.
- **Update Invariant**: Prompt updates must match structural specifications and must verify `userId` remains immutable.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads represent targeted attacks on our Firestore database:

1. **Identity Spoofing**: Attempt to write a bookmark for User B (`user_b_xyz`) using User A's token.
2. **Ghost Creation**: Attempt to bypass parameters by creating a Bookmark without a `promptId` field.
3. **Ghost Inject (Shadow Fields)**: Attempt to inject extra fields (`isAdmin: true`, `verified: true`) into a Bookmark document.
4. **ID Poisoning (Malformed/Recursive)**: Set `bookmarkId` to a 10KB junk string with specialized regex characters.
5. **Denial of Wallet (Huge String)**: Attempt to save a 5MB payload into the `title` or `imageUrl` field.
6. **Time Spoofing (Manipulated Clock)**: Attempting to pass a client-defined timestamp for `createdAt` (e.g., 2030 or 1990) instead of using the mandatory server timestamp.
7. **Privilege Escalation**: Attempting to execute an update that alters the `userId` field to match a different user ID, aiming to steal their items.
8. **Malicious Image Source**: Setting `imageUrl` to an invalid or malformed URL, or a type other than string (such as an array of characters).
9. **Blanket Query Scraping**: Forcing a query without `userId` where-clause filters to bypass owner constraints and scrape other users' lists.
10. **Resource Overload**: Creating thousands of entries in an array field to crash browser queries. We mandate sub-collections rather than fields storing arbitrary lists.
11. **Empty Custom Prompt Entry**: Writing a CustomPrompt with an empty string for `generationPrompt` or `title`, which would pollute the UI.
12. **Malformed UUID**: Injecting invalid ID patterns like slashes or backslashes into path components to query raw internal paths.

---

## 3. Test Runner Design

Below is the conceptual Firestore rule test suite verifying these security boundaries:

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

// Standard security tests to run against our firestore.rules
describe("Firestore Rules Protection Suite", () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "viral-clip-pipeline",
      firestore: {
        host: "localhost",
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it("should prevent unauthorized user from viewing user bookmarks", async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    const badDoc = unauthedDb.doc("users/user_123/bookmarks/b_456");
    await assertFails(badDoc.get());
  });

  it("should prevent User A from reading User B's bookmarks", async () => {
    const userA = testEnv.authenticatedContext("user_A").firestore();
    const badDoc = userA.doc("users/user_B/bookmarks/b_456");
    await assertFails(badDoc.get());
  });

  it("should block User A from creating a bookmark with User B's uid in payload", async () => {
    const userA = testEnv.authenticatedContext("user_A").firestore();
    const badDoc = userA.doc("users/user_A/bookmarks/b_123");
    await assertFails(badDoc.set({
      userId: "user_B",
      promptId: "p_123",
      createdAt: new Date()
    }));
  });

  it("should block bookmark writes with future/past invalid client-side timestamps", async () => {
    const userA = testEnv.authenticatedContext("user_A").firestore();
    const badDoc = userA.doc("users/user_A/bookmarks/b_123");
    await assertFails(badDoc.set({
      userId: "user_A",
      promptId: "p_123",
      createdAt: new Date("2020-01-01T00:00:00Z") // Invalid timestamp (not serverTime)
    }));
  });
});
```
