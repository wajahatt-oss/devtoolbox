import { format } from 'sql-formatter'

export function formatSQL(
  input: string,
  indentSize: number,
  keywordCase: 'upper' | 'lower',
): string {
  if (!input.trim()) throw new Error('Enter SQL to format.')
  return format(input, {
    language: 'sql',
    tabWidth: indentSize,
    keywordCase,
  })
}
