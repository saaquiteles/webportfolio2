# ADR 0015: Privacy guard test

Status: Accepted by the human on 2026-10-26, with the recommended options. Raised by the first content story.

## Gap
ADR 0010 keeps the resume and original photos in the git-ignored `private/` folder, but nothing stops a phone number or a different email from being typed into a published page by mistake. The repo is public, and once something is pushed it stays in history. ADR 0010 listed an automatic check as a possible later hardening.

## Proposal
A test, `src/lib/privacy.test.ts`, that runs with the normal tests and fails if it finds, in the files it scans:
- a phone-number-like string (Philippine mobile patterns such as `09` followed by nine digits, with or without spaces, dots or dashes, and the Philippine country code, with or without a plus sign, followed by `9` and nine digits (the plus-sign form alone also counts));
- any email address other than the approved contact email;
- a `.gitignore` that no longer contains `/private/`.

**It never contains the real values.** Its own fake examples are built at run time, so the test's source never matches its own patterns.

**What it scans** is a decision for the human: the recommendation is every tracked text file (for example from `git ls-files`), because `docs/` and the plans are public too.

## Why
This turns a judgement rule ("never publish the phone number or address") into a tool check, which is what the retro suggests for a mistake that is permanent once made.

## Consequences
- **Limitation:** it cannot detect the home address without writing the address in the test, which would publish it. The address stays a review-only check.
- A false alarm is possible, for example a long number that looks like a phone number. The test should print the file and the match, so it is quick to judge.
- It is a new pattern, so the story's first task is full flow and needs the human's contract in writing, which approving the plan provides.
- **Text only:** it reads text files and skips binary ones, so it cannot see hidden data inside an image (camera or GPS metadata in a photo). Strip image metadata before adding a photo (ADR 0010) and check it by hand; the published photo was checked this way.
