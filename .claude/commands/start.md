---
description: Start a Linear task, update status, comment, and post a final comment upon completion.
usage: /start [ISSUE-KEY] [EXTRA INSTRUCTIONS...]
---

You are starting work on a new requirement tied to the Linear issue provided in the arguments.

Please perform the following workflow sequentially:

1. **Initialization:**
    - Use the Linear tool to find the issue key specified.
    - Change that issue's status to "In Progress".
    - Post a comment on the issue stating: "Claude Code has initiated a terminal session to implement this requirement."

2. **Analysis:**
    - Read the details/description of that issue.
    - **Crucial:** Read and prioritize the extra instructions provided by the user in this command (e.g., specific files to look at, extra logic constraints).
    - Open and review any specific files mentioned in the user's extra instructions right away.
    - Ask the user for any clarification before you start writing code.

3. **Task Completion Workflow:**
    - Once all code changes, fixes, or requirements for this task are completely finished and verified, do not just stop.
    - Immediately use the Linear tool to post a final comment on the same issue key.
    - Insert a final comment: concise bulleted list summarizing the exact features implemented, files modified, or bugs fixed during this task.
    - Change that issue's status to "QA".
