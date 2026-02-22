import type { MDCParserResult } from '@nuxtjs/mdc'

let nodeIdCounter = 0

export interface EditableMetadata {
  id: string
  path: string
  type: 'component' | 'text' | 'element'
  tag?: string
  props?: Record<string, {
    path: string
    type: 'text' | 'link' | 'color' | 'number'
  }>
}

export interface EnrichedNode {
  type: string
  tag?: string
  props?: any
  children?: EnrichedNode[]
  value?: string
}

interface EnrichedRoot extends EnrichedNode {
  type: 'root'
}

/**
 * Enriches an AST with stable IDs and editable paths
 * This allows tracking nodes through re-renders and mutations
 */
export function enrichAst(ast: MDCParserResult, basePath = 'body'): MDCParserResult {
  const enriched = {
    ...ast,
    body: enrichNode(ast.body, `${basePath}`) as EnrichedRoot
  }

  return enriched as MDCParserResult
}

function enrichNode(node: any, path: string): EnrichedNode {
  if (!node) return node

  const enriched: EnrichedNode = { ...node }

  // Add editable metadata for elements and components
  if (node.type === 'element') {
    const nodeId = `node-${node.tag}-${nodeIdCounter++}`

    // Add data attributes directly to props for DOM rendering
    enriched.props = {
      ...node.props,
      'data-node-id': nodeId,
      'data-node-path': path,
      'data-node-type': node.type,
      'data-node-tag': node.tag
    }
  }

  // Recursively enrich children
  if (node.children && Array.isArray(node.children)) {
    enriched.children = node.children.map((child: any, index: number) =>
      enrichNode(child, `${path}.children[${index}]`)
    )
  }

  return enriched
}
/**
 * Update a value in the AST by path
 */
export function updateByPath(obj: any, path: string, value: any): any {
  const parts = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)

  const cloned = JSON.parse(JSON.stringify(obj))
  let current = cloned

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!part) continue;
    if (!(part in current)) {
      current[part] = {}
    }
    current = current[part]
  }

  const lastPart = parts[parts.length - 1]
  current[lastPart as keyof typeof current] = value

  return cloned
}