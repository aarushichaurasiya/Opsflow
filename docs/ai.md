# OpsFlow — AI-Assisted Workflows

## 1. Role of AI
AI is an additional capability, not the foundation of OpsFlow. Core application behavior must remain correct without the AI layer.

## 2. Example
User asks:
> Show me all overdue tasks assigned to the frontend team.

Flow:
```text
User
 ↓
AI assistant
 ↓
Intent detection
 ↓
Tool selection
 ↓
Application API/tool
 ↓
Authorization check
 ↓
Database
 ↓
Structured result
 ↓
AI response
```

## 3. Tool design
Use narrowly scoped tools such as:
```text
getOverdueTasks
getProjectSummary
getTaskDetails
getUserAssignments
generateProjectSummary
```

Each tool should have a strict input/output schema.

## 4. Authorization
The AI must execute tools in the security context of the requesting user. A prompt cannot grant permissions the user does not have.

Example:
```text
User: Employee
User can see: Project A

AI: getProjectSummary(Project B)
 ↓
Authorization
 ↓
Denied
```

## 5. Natural-language queries
Natural language should translate into structured operations rather than arbitrary SQL.

Bad:
```text
LLM → generated SQL → database
```

Preferred:
```text
LLM → structured tool call → service authorization → database
```

## 6. Summaries
Potential AI capabilities:
- project summaries
- task summaries
- meeting/action-item extraction
- operational natural-language queries
- report generation
- workflow recommendations

## 7. RAG
The README lists RAG/pgvector where required. Treat this as an optional enhancement. Use retrieval when the model needs grounded organizational content that is not appropriate to pass through simple structured tools.

## 8. Prompt injection
Treat task descriptions, comments and uploaded content as untrusted data. Never let text from a user-controlled resource override system/application security rules.

## 9. Data minimization
Send only the information required to answer the request. Do not expose credentials, internal tokens or unnecessary private fields to an LLM provider.

## 10. Evaluation
Track:
- task success rate
- tool-call correctness
- authorization failures
- hallucination/error cases
- latency
- token/usage cost
- user feedback

The README explicitly includes AI evaluation and usage tracking in the intended stack.
