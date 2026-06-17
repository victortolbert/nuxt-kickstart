import type { GeneratedFile } from './shared'
import { NUMERIC_PREFIX_RE, unwrapHelium } from './shared'

/**
 * iOS Swift — nested structs of UIColor / CGFloat constants.
 */
export function generateIOSSwift(tokens: Record<string, any>, options: Record<string, any>): GeneratedFile {
  const prefix = options.prefix || 'Token'
  const lines: string[] = [
    '// Auto-generated Design Tokens',
    'import UIKit',
    '',
    `public struct ${prefix} {`,
  ]

  const innerTokens = unwrapHelium(tokens)

  function processTokens(obj: Record<string, any>, path: string[] = [], indent: string = '    ') {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$extensions')
        continue

      const swiftName = key.replaceAll(' ', '').replaceAll('-', '')

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenType = value.$type
        const tokenValue = value.$value

        switch (tokenType) {
          case 'color':
            if (typeof tokenValue === 'string' && tokenValue.startsWith('#')) {
              const hex = tokenValue.slice(1)
              const r = Number.parseInt(hex.slice(0, 2), 16) / 255
              const g = Number.parseInt(hex.slice(2, 4), 16) / 255
              const b = Number.parseInt(hex.slice(4, 6), 16) / 255
              const a = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1
              lines.push(`${indent}public static let ${swiftName} = UIColor(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}, alpha: ${a.toFixed(3)})`)
            }
            break
          case 'dimension':
          case 'spacing':
          case 'width':
          case 'height': {
            const numMatch = String(tokenValue).match(NUMERIC_PREFIX_RE)
            if (numMatch) {
              lines.push(`${indent}public static let ${swiftName}: CGFloat = ${numMatch[1]}`)
            }
            break
          }
          default:
            if (typeof tokenValue === 'string') {
              lines.push(`${indent}public static let ${swiftName} = "${tokenValue}"`)
            }
            else if (typeof tokenValue === 'number') {
              lines.push(`${indent}public static let ${swiftName}: CGFloat = ${tokenValue}`)
            }
        }
      }
      else if (value && typeof value === 'object') {
        lines.push(`${indent}public struct ${swiftName} {`)
        processTokens(value, [...path, key], `${indent}    `)
        lines.push(`${indent}}`)
      }
    }
  }

  if (innerTokens.primitives && Object.keys(innerTokens.primitives).length > 0) {
    lines.push('    public struct Primitives {')
    processTokens(innerTokens.primitives, ['primitives'], '        ')
    lines.push('    }')
  }

  if (innerTokens.rte && Object.keys(innerTokens.rte).length > 0) {
    lines.push('    public struct Typography {')
    processTokens(innerTokens.rte, ['rte'], '        ')
    lines.push('    }')
  }

  if (innerTokens.components) {
    lines.push('    public struct Components {')
    processTokens(innerTokens.components, [], '        ')
    lines.push('    }')
  }

  lines.push('}')

  return { ext: 'swift', content: lines.join('\n') }
}

/**
 * Android XML resources (`<color>`, `<dimen>`, `<string>`, `<integer>`).
 */
export function generateAndroidXML(tokens: Record<string, any>, _options: Record<string, any>): GeneratedFile {
  const lines: string[] = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!-- Auto-generated Design Tokens -->',
    '<resources>',
  ]

  const innerTokens = unwrapHelium(tokens)

  function processTokens(obj: Record<string, any>, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$extensions')
        continue

      const xmlName = [...path, key].map(s => s.replaceAll(' ', '_').toLowerCase()).join('_')

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenType = value.$type
        const tokenValue = value.$value

        switch (tokenType) {
          case 'color':
            if (typeof tokenValue === 'string' && tokenValue.startsWith('#')) {
              let androidColor = tokenValue
              // Convert #RRGGBBAA to #AARRGGBB for Android
              if (tokenValue.length === 9) {
                androidColor = `#${tokenValue.slice(7)}${tokenValue.slice(1, 7)}`
              }
              lines.push(`    <color name="${xmlName}">${androidColor}</color>`)
            }
            break
          case 'dimension':
          case 'spacing':
          case 'width':
          case 'height':
            lines.push(`    <dimen name="${xmlName}">${tokenValue}</dimen>`)
            break
          case 'typography':
            break
          default:
            if (typeof tokenValue === 'string') {
              lines.push(`    <string name="${xmlName}">${tokenValue}</string>`)
            }
            else if (typeof tokenValue === 'number') {
              lines.push(`    <integer name="${xmlName}">${tokenValue}</integer>`)
            }
        }
      }
      else if (value && typeof value === 'object') {
        processTokens(value, [...path, key])
      }
    }
  }

  if (innerTokens.primitives)
    processTokens(innerTokens.primitives, ['primitives'])
  if (innerTokens.rte)
    processTokens(innerTokens.rte, ['rte'])
  if (innerTokens.components)
    processTokens(innerTokens.components)

  lines.push('</resources>')

  return { ext: 'xml', content: lines.join('\n') }
}

/**
 * Android Jetpack Compose — nested objects of Color / dp / sp constants.
 */
export function generateAndroidCompose(tokens: Record<string, any>, options: Record<string, any>): GeneratedFile {
  const prefix = options.prefix || 'Token'
  const lines: string[] = [
    '// Auto-generated Design Tokens',
    'package com.example.tokens',
    '',
    'import androidx.compose.ui.graphics.Color',
    'import androidx.compose.ui.unit.dp',
    'import androidx.compose.ui.unit.sp',
    '',
    `object ${prefix} {`,
  ]

  const innerTokens = unwrapHelium(tokens)

  function processTokens(obj: Record<string, any>, path: string[] = [], indent: string = '    ') {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '$extensions')
        continue

      const kotlinName = key.replaceAll(' ', '').replaceAll('-', '')

      if (value && typeof value === 'object' && '$value' in value) {
        const tokenType = value.$type
        const tokenValue = value.$value

        switch (tokenType) {
          case 'color':
            if (typeof tokenValue === 'string' && tokenValue.startsWith('#')) {
              const hex = tokenValue.slice(1).toUpperCase()
              if (hex.length === 6) {
                lines.push(`${indent}val ${kotlinName} = Color(0xFF${hex})`)
              }
              else if (hex.length === 8) {
                lines.push(`${indent}val ${kotlinName} = Color(0x${hex.slice(6)}${hex.slice(0, 6)})`)
              }
            }
            break
          case 'dimension':
          case 'spacing':
          case 'width':
          case 'height': {
            const numMatch = String(tokenValue).match(NUMERIC_PREFIX_RE)
            const unit = String(tokenValue).includes('px') || String(tokenValue).includes('dp') ? 'dp' : 'sp'
            if (numMatch) {
              lines.push(`${indent}val ${kotlinName} = ${numMatch[1]}.${unit}`)
            }
            break
          }
          default:
            if (typeof tokenValue === 'string') {
              lines.push(`${indent}val ${kotlinName} = "${tokenValue}"`)
            }
            else if (typeof tokenValue === 'number') {
              lines.push(`${indent}val ${kotlinName} = ${tokenValue}`)
            }
        }
      }
      else if (value && typeof value === 'object') {
        lines.push(`${indent}object ${kotlinName} {`)
        processTokens(value, [...path, key], `${indent}    `)
        lines.push(`${indent}}`)
      }
    }
  }

  if (innerTokens.primitives && Object.keys(innerTokens.primitives).length > 0) {
    lines.push('    object Primitives {')
    processTokens(innerTokens.primitives, ['primitives'], '        ')
    lines.push('    }')
  }

  if (innerTokens.rte && Object.keys(innerTokens.rte).length > 0) {
    lines.push('    object Typography {')
    processTokens(innerTokens.rte, ['rte'], '        ')
    lines.push('    }')
  }

  if (innerTokens.components) {
    lines.push('    object Components {')
    processTokens(innerTokens.components, [], '        ')
    lines.push('    }')
  }

  lines.push('}')

  return { ext: 'kt', content: lines.join('\n') }
}
