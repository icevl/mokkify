import { v4 as uuidv4 } from "uuid"

enum PayloadKeySource {
  Request = "request",
  Response = "response"
}

export const getBodyPayload = async (request: Request) => {
  try {
    return await request.json()
  } catch {
    return null
  }
}

// field1.field2.field3
export const getValueFromBodyByNestedKey = (nestedKeys: string, body: any) => {
  const keys = nestedKeys.split(".")
  let currentObj = body

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]

    if (currentObj && typeof currentObj === "object" && key in currentObj) {
      currentObj = currentObj[key]
    } else {
      return null
    }
  }

  return {
    value: currentObj,
    type: typeof currentObj
  }
}

export const parseResponseBody = (
  responseString: string | null,
  requestBody?: unknown,
  responseBody?: unknown
): string | null => {
  if (!responseString) return null
  let result = responseString

  const regex = /@([a-zA-Z0-9_.]+)([^a-zA-Z0-9_.]|$)/g
  const matches = Array.from(responseString.matchAll(regex))

  if (matches.length) {
    for (const [, key] of matches) {
      let value = null

      if (key.includes(".")) {
        const [source, ...nestedKeyArray] = key.split(".")
        const nestedKey = nestedKeyArray.join(".")

        const body = source === PayloadKeySource.Request ? requestBody : responseBody
        const response = getValueFromBodyByNestedKey(nestedKey, body)
        if (!response) value = null
        value = response?.value === undefined ? null : response?.value
        if (response?.type === "string") value = `"${response.value}"`
      } else {
        value = parseVar(key)
      }

      result = result.replace(`@${key}`, value as any)
    }
  }

  return result
}

const parseVar = (key: string): string | number | null => {
  switch (key) {
    case "uuid":
      return `"${uuidv4()}"`
    case "date":
      return `"${new Date().toISOString()}"`
    default:
      return null
  }
}