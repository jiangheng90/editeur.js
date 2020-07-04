export const KebabCaseToCamelCase = (t: string): string => {
  const KebabCase = t.indexOf('-') !== -1
  if (KebabCase) {
    const arr = t.split('-')
    let res = ''
    for (let i = 0; i < arr.length; i++) {
      const s = arr[i]
      if (i === 0) {
        res += s.toLowerCase()
      } else {
        res += s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
      }
    }
    return res
  } else {
    return t
  }
}
