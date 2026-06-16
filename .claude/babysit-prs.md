# PR Babysitter

## Scheduling model

This prompt is designed for a **Claude Code Desktop Scheduled Task**.

Configure the scheduled task to run:

```txt
every 3 minutes
```

Run while the spell-loop is active. Stop when the loop stops.

Each run does one thing: find open `spell/*` PRs targeting `main`, verify them, and merge the ones that are green. Do nothing else.

## Task

Look for open pull requests from branches matching `spell/*` targeting `main`:

```bash
gh pr list --base main --state open --json number,title,headRefName,url
```

If there are no open `spell/*` PRs, exit silently. Nothing to do.

## For each open spell PR

### 1) Check it out cleanly

```bash
git fetch origin
gh pr checkout <number>
```

### 2) Rebase onto main; auto-resolve registry-only conflicts

Spell PRs are branched off an older `main`, and each one appends its component to the tail of three shared registry files. While a PR waits in the queue, other PRs merge ahead of it, so by merge time it is almost always stale and conflicts on those files. Bring it up to date before verifying:

```bash
git rebase origin/main
```

If the rebase applies cleanly, continue to Verify.

If it stops on conflicts, list the conflicted files:

```bash
git diff --name-only --diff-filter=U
```

**Only auto-resolve when every conflicted file is one of these three:**

```txt
apps/website/src/constants/Categories.js
apps/website/src/constants/Components.js
apps/website/src/constants/Information.js
```

These conflicts are always *additive* — both sides appended a new entry at the same spot. Resolve each file as a **union**: keep every entry already present on `main`, then append this branch's one new entry. Fix the punctuation so the file stays valid JS — the previous last entry gains a trailing comma, and in `Information.js` the final metadata object needs a closing `},` before the appended block. Never delete, reorder, or edit existing entries. Then:

```bash
git add apps/website/src/constants/Categories.js apps/website/src/constants/Components.js apps/website/src/constants/Information.js
git rebase --continue
git push --force-with-lease
```

If **any other file** conflicts, do not guess. Abort and leave the PR for manual review:

```bash
git rebase --abort
```

Note it in the run summary and move on to the next PR.

### 3) Verify

Run the full gate from the repo root:

```bash
pnpm lint
pnpm build
```

Requirements:
* `pnpm lint` must exit 0 with zero warnings
* `pnpm build` must exit 0

If either fails, leave the PR open and note the failure in the run summary. Do not merge a failing PR.

### 4) Merge

If both checks pass, squash-merge and delete the branch:

```bash
gh pr merge <number> --squash --delete-branch --body ""
```

If a branch was rebased and force-pushed in step 2, GitHub may briefly report `Base branch was modified` or an `UNKNOWN` mergeable state while it recomputes. Wait a few seconds and retry the merge once before treating it as a failure.

### 5) Return to main

```bash
git checkout main
git pull origin main
```

## Handling multiple open PRs

Process them one at a time in the order `gh pr list` returns them (oldest first).

If one fails verification, skip it and move on to the next.

## Failure rule

Never merge a PR that did not pass both `pnpm lint` and `pnpm build` in this run.

Do not re-run the build to try to get a different result.

Do not close or abandon the PR — leave it open for the next babysitter run or for Daniel to inspect.

## Final response format

At the end of each run, respond with one compact summary:

```txt
Open spell PRs found: <n>
Merged: <list of PR numbers/titles, or "none">
Skipped: <list with reason, or "none">
```

If there were no open PRs:

```txt
No open spell PRs. Nothing to do.
```
