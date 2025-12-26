#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Component Discovery Script
 * 
 * This simulates what your CMS would do when connected to a customer's GitHub repo.
 * It scans the /app/components directory and extracts component metadata from TypeScript
 * types and JSDoc comments.
 */

function parseComponentMetadata(content, filename) {
  const metadata = {
    name: filename.replace('.vue', ''),
    label: filename.replace('.vue', '').replace(/([A-Z])/g, ' $1').trim(),
    category: 'General',
    description: '',
    props: {}
  }
  
  // Extract JSDoc metadata
  const componentDocMatch = content.match(/\/\*\*\s*\n([\s\S]*?)\*\/\s*\n\s*interface Props/)
  if (componentDocMatch) {
    const docContent = componentDocMatch[1]
    
    // Extract @component name
    const componentMatch = docContent.match(/@component\s+(\w+)/)
    if (componentMatch) metadata.name = componentMatch[1]
    
    // Extract @category
    const categoryMatch = docContent.match(/@category\s+(\w+)/)
    if (categoryMatch) metadata.category = categoryMatch[1]
    
    // Extract @description
    const descMatch = docContent.match(/@description\s+(.+)/)
    if (descMatch) metadata.description = descMatch[1]
  }
  
  // Extract Props interface
  const propsMatch = content.match(/interface Props\s*{([\s\S]*?)^}/m)
  if (propsMatch) {
    const propsContent = propsMatch[1]
    
    // Parse each property with its JSDoc comments
    const propPattern = /\/\*\*\s*\n([\s\S]*?)\*\/\s*\n\s*(\w+)(\?)?:\s*([^;\n]+)/g
    let propMatch
    
    while ((propMatch = propPattern.exec(propsContent)) !== null) {
      const [, docComment, propName, optional, propType] = propMatch
      
      const prop = {
        name: propName,
        type: propType.trim(),
        required: !optional,
        label: propName,
        options: null
      }
      
      // Parse JSDoc annotations
      const labelMatch = docComment.match(/@label\s+(.+)/)
      if (labelMatch) prop.label = labelMatch[1].trim()
      
      const typeMatch = docComment.match(/@type\s+(\w+)/)
      if (typeMatch) prop.type = typeMatch[1]
      
      const optionsMatch = docComment.match(/@options\s+(.+)/)
      if (optionsMatch) {
        prop.options = optionsMatch[1].split(',').map(o => o.trim())
      }
      
      metadata.props[propName] = prop
    }
  }
  
  // Extract default values from withDefaults
  const defaultsMatch = content.match(/withDefaults\(defineProps<Props>\(\),\s*{([\s\S]*?)}\)/)
  if (defaultsMatch) {
    const defaultsContent = defaultsMatch[1]
    const defaultPattern = /(\w+):\s*([^,\n]+)/g
    let defaultMatch
    
    while ((defaultMatch = defaultPattern.exec(defaultsContent)) !== null) {
      const [, propName, defaultValue] = defaultMatch
      if (metadata.props[propName]) {
        metadata.props[propName].default = defaultValue.trim().replace(/['"]/g, '')
      }
    }
  }
  
  return metadata
}

async function discoverComponents() {
  const componentsDir = path.join(__dirname, '../app/components')
  
  try {
    const files = await fs.readdir(componentsDir)
    const vueFiles = files.filter(f => f.endsWith('.vue'))
    
    console.log('🔍 Discovering components from TypeScript definitions...\n')
    console.log(`Found ${vueFiles.length} component(s):\n`)
    
    const components = []
    
    for (const file of vueFiles) {
      const filePath = path.join(componentsDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      
      const metadata = parseComponentMetadata(content, file)
      const propCount = Object.keys(metadata.props).length
      
      console.log(`📦 ${file}`)
      console.log(`   Name: ${metadata.name}`)
      console.log(`   Category: ${metadata.category}`)
      if (metadata.description) {
        console.log(`   Description: ${metadata.description}`)
      }
      console.log(`   Props: ${propCount} defined`)
      
      if (propCount > 0) {
        console.log(`   ├─ ${Object.keys(metadata.props).join(', ')}`)
      }
      
      console.log('')
      
      components.push({
        file,
        ...metadata
      })
    }
    
    console.log('━'.repeat(50))
    console.log(`\n✅ Discovery complete: ${components.length} component(s) found\n`)
    
    // Show detailed schema for first component as example
    if (components.length > 0) {
      console.log('Example metadata (first component):\n')
      console.log(JSON.stringify(components[0], null, 2))
    }
    
    console.log('\n💡 Your CMS would:')
    console.log('   1. Store this metadata in your database')
    console.log('   2. Generate form inputs based on prop types')
    console.log('   3. Use labels for UI display')
    console.log('   4. Validate against required props')
    console.log('   5. Show default values in the editor\n')
    
    return components
  } catch (error) {
    console.error('❌ Error discovering components:', error.message)
    process.exit(1)
  }
}

// Run the discovery
discoverComponents()
