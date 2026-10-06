# OpsFlow — Search Design

## 1. Scope
Users may search organizational resources including:
- projects
- tasks
- comments
- users
- files

## 2. Initial implementation
Use PostgreSQL full-text search for the initial version. Search queries must always be tenant-scoped.

```text
Search request
   ↓
Authenticate
   ↓
Resolve organization
   ↓
Build tenant-scoped search
   ↓
PostgreSQL FTS
   ↓
Rank/filter
   ↓
Return results
```

## 3. Security
Search must not become a data-leak channel. A user must only receive records they are authorized to view.

## 4. Future scaling
OpenSearch is identified as a future scaling option. Introduce it when search requirements justify the operational complexity, such as large datasets, advanced relevance or high search volume.

## 5. Search result model
A result can expose:
```text
resourceType
resourceId
title/snippet
projectId
relevance metadata if appropriate
```

Do not expose private fields merely because the search index contains them.
