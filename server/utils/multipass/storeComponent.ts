import type { EventHandlerRequest, H3Event } from 'h3'
import { eq } from 'drizzle-orm'

declare module 'h3' {
  interface NodeIncomingMessage {
    componentGeneratedCode: string
  }
}

export default async (event: H3Event<EventHandlerRequest>, id: string, slug?: string | null) => {
  console.log('> init : store component')
  const componentDesignTask = event.node.req.componentDesignTask
  const componentGeneratedCode = event.node.req.componentGeneratedCode

  const result = await useDB().update(tables.components).set({
    slug,
    code: componentGeneratedCode,
    description: componentDesignTask.description.user,
    metadata: componentDesignTask,
    completed: true,
  }).where(eq(tables.components.id, id)).returning().get()

  console.dir(result)
  return result
}
