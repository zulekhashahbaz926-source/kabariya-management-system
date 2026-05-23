# Code Refactoring & Legacy Code Removal Analysis

This folder presents a direct engineering comparison of the core Recommendation Engine of **AI LearnHub**. It contrasts initial "dirty" prototype code with "clean" production-ready code.

---

## 🔍 Code Smell Analysis (Legacy Version)

1. **Callback Hell (Pyramid of Doom)**
   * *Problem*: The legacy code nests queries within callbacks (`Database` -> `enrollments` -> `bookmarks` -> `courses`), leading to deep horizontal indentations.
   * *Consequence*: It is highly unreadable, difficult to debug, and prone to nesting variables scopes.

2. **SQL Injection Vulnerability**
   * *Problem*: The SQL strings are concatenated directly with the variables:
     `"SELECT course_id FROM enrollments WHERE user_id = " + userId`
   * *Consequence*: Open to SQL injection attacks if `userId` is manipulated.

3. **High Cognitive Complexity & Code Duplication**
   * *Problem*: Loops are nested inside loops (`k` -> `x`, `eIndex` -> `z`, etc.) to match categories. It re-reads the full list of courses on every cycle (N+1 query emulation).
   * *Consequence*: $O(N^2)$ algorithm runs slowly on larger datasets.

4. **Resource Management Issues**
   * *Problem*: The database connection is instantiated and closed inside the request flow (`db.close()`), which destroys database connection pooling capabilities in high-traffic APIs.

5. **Poor Array Sorting Implementation**
   * *Problem*: Manual bubble-sort implementation.
   * *Consequence*: Highly inefficient compared to V8's native Timsort (`Array.prototype.sort()`).

---

## 🛠 Refactoring Techniques Applied

1. **Convert to Promises and Async/Await**
   * *Fix*: Replaced nested callbacks with `Promise.all` to fetch inputs concurrently, shrinking database read latency.

2. **Extract Method Pattern**
   * *Fix*: Extracted preference mapping and scoring logic into single-responsibility pure functions:
     * `buildPreferenceMap()`
     * `calculateCourseScore()`
   * *Benefit*: Enables independent unit-testing of these logic components without hitting a database.

3. **Parameterized SQL Queries**
   * *Fix*: Replaced string concatenations with SQL placeholders (`?`), neutralizing SQL Injection risks.

4. **Replace Nested Loops with Hash Map Lookups**
   * *Fix*: Built a key-value category frequency mapping in `buildPreferenceMap`, reducing computation time complexity to $O(N)$.

5. **Functional Array Pipeline**
   * *Fix*: Leveraged clean declarative code: `.filter().map().sort().slice()`.
