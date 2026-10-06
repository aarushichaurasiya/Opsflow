import { Injectable } from '@nestjs/common';
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

@Injectable()
export class AiService {
  /**
   * Processes a natural language query with restricted tool calling.
   * Authorization context (user, organization) is strictly passed to tools.
   */
  async processQuery(prompt: string, userId: string, organizationId: string) {
    const result = await generateText({
      model: openai('gpt-4-turbo'),
      system: 'You are an operations assistant for OpsFlow. Use the provided tools to answer queries about projects and tasks. Never guess information.',
      prompt,
      tools: {
        getProjectStatus: tool({
          description: 'Get the status and tasks of a specific project by name.',
          parameters: z.object({
            projectName: z.string().describe('The name of the project to look up.'),
          }),
          execute: async ({ projectName }) => {
            // Simulated RBAC and DB fetch bounded by organizationId
            // In a real implementation: return this.projectsService.findByNameScoped(projectName, organizationId)
            console.log(`[RBAC Check] Authorizing user ${userId} for org ${organizationId}`);
            
            return {
              project: projectName,
              status: 'ON_TRACK',
              tasksCompleted: 12,
              tasksPending: 3,
            };
          },
        }),
      },
      maxSteps: 3, // Allow model to chain tool calls
    });

    return {
      text: result.text,
      toolCalls: result.toolCalls,
    };
  }
}
