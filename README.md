## MMM-JIRA

## JIRA by Atlassian

It's like you have JIRA tickets in front of you when you're not even awake yet, I know, it sounds horrible and it is,
but that how the life is, cheers!

## What you get

* The tickets for the current sprint so you can suffer more

* Annotated .css file included for coloring text and header.

## Installation

* No dependencies needed! No kidding!

## Config.js entry and options

    {
			module: 'MMM-JIRA',
			position: 'top_left',                 // Best in left, center, or right regions
			config: {
				url: "https://saferidehealth.atlassian.net/rest/api/2/search",
				useHeader: false,
				header: "Tasks in JIRA",
				maxWidth: "300px",
				apiToken: "YOUR API TOKEN",
				username: "YOUR USERNAME",
				assignee: "EMAIL ADDRESS OF THE ASSIGNEE",
				statuses:[
					'STATUSES'
				],
				project: "",
				fields: "summary",
				maxResults: 10
			}
		}
