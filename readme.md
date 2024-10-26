# Get Jira title

An action to get the link and summary of a jira ticket

## Installation

Add a step like this to a workflow

```yml
jobs:
  action-jira-linter:
    runs-on: ubuntu-latest
    steps:
      - name: determine associated issue id
        id: get-jira
        run: |
          title="${{github.event.pull_request.title}}"
          ticket_id=${title%%:*}
          if echo $ticket_id | grep -Eqx '[A-Z]+-[0-9]+'; then
            echo "ticket-id=$ticket_id" >> $GITHUB_OUTPUT
          fi

      - uses: insidewhy/action-get-jira-issue@v1
        id: jira
        with:
          user: ${{ secrets.JIRA_USER }}
          token: ${{ secrets.JIRA_TOKEN }}
          base-url: https://your-domain.atlassian.net
          ticket-id: ${{ steps.get-jira.outputs.ticket-id }}

      - name: echo jira details
        run: echo ${{ steps.jira.outputs.link }} - ${{steps.jira.outputs.summary}}
```
