# Awesome prompts

### Reduce hallucinations

You can paste it into the chat window before starting the conversation, or include it as a system prompt or instruction

```no-highlight
Do not present speculation, deduction, or hallucination as fact.
• If unverified, say:
  - “I cannot verify this.”
  - “I do not have access to that information.”
• Label all unverified content clearly:
  - [Inference], [Speculation], [Unverified]
• If any part is unverified, label the full output.
• Ask instead of assuming.
• Never override user facts, labels, or data.
• Do not use these terms unless quoting the user or citing a real source:
  - Prevent, Guarantee, Will never, Fixes, Eliminates, Ensures that
• For LLM behavior claims, include:
  - [Unverified] or [Inference], plus a note that it’s expected behavior, not guaranteed
• If you break this directive, say:
  > Correction: I previously made an unverified or speculative claim without labeling it. That was an error.
```

### Understand code

```no-highlight
Can you explain the following code (select your code/paste your code into chat/refer to your code) in detail:
Specifically:
1. What is the purpose of this section?
2. How does it work step-by-step?
3. Are there any potential issues or limitations with this approach?
```

### Code review

```no-highlight
Review this code as if you were a senior developer with 15+ years of experience. 
Focus on: 
1) Security vulnerabilities, 
2) Performance bottlenecks, 
3) Readability, Maintainability issues, 
4) Potential bugs or edge case, and 
5) Adherence to best practices for [language/framework]. 

Provide specific, actionable feedback with examples of how to improve the code and explain your reasoning for each suggestion
```

### Refactor

```no-highlight
Refactor this code to improve its readability, maintainability, and performance without changing its functionality. 
First explain the problems with the current implementation, then provide the refactored version with comments explaining your changes. 
Finally, summarize the benefits of your refactoring.
```

### Generate unit tests

```no-highlight
Generate unit tests for the following function: (select your code/paste your code into chat/refer to your code)
Include tests for:
1. Normal expected inputs
2. Edge cases
3. Invalid inputs
Use [preferred testing framework] syntax. For each test, briefly explain what aspect of the functionality it's verifying and why it's important.
```

### Archictecture

```no-highlight
Analyze this code's design challenges. Recommend 2-3 appropriate design patterns that could address these issues. For each pattern, explain: 
1) How it would be implemented in this specific context, 
2) What problems it solves, 
3) Potential drawbacks, and 
4) How it affects testability, maintenance, and extensibility.
```

### Scalability

```no-highlight
Evaluate this code for scalability concerns. 
Identify components that might become bottlenecks under high load. 
Suggest architectural improvements that would enhance scalability, and recommend specific modifications prioritized by impact vs. implementation effort. 
Consider both vertical and horizontal scaling approaches.
```

### Memory investigate

```no-highlight
Investigate this code for potential memory leaks, excessive allocations, or inefficient memory usage patterns. 
Explain where and why memory issues might occur, suggest fixes for each problem, and recommend tools or approaches to validate your hypothesis.
```
