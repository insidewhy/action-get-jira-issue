import { getInput, setOutput } from '@actions/core'

async function run(): Promise<void> {
  const user = getInput('user', { required: true })
  const baseUrl = getInput('base-url', { required: true })
  const token = getInput('token', { required: true })
  const ticketId = getInput('ticket-id', { required: true })

  interface JiraIssue {
    key: string
    fields: {
      summary: string
    }
  }

  const credentials = `${user}:${token}`
  const authorization = Buffer.from(credentials).toString('base64')
  const response = await fetch(`${baseUrl}/rest/api/3/issue/${ticketId}?fields=summary`, {
    headers: { authorization: `Basic ${authorization}` },
  })
  if (!response.ok) {
    console.warn('Could not find jira ticket')
    return
  }

  const body = (await response.json()) as JiraIssue

  setOutput('link', `${baseUrl}/browse/${body.key}`)
  setOutput('summary', body.fields.summary)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
