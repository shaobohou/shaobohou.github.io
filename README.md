# shaobohou.github.io

This repository contains the source code for a personal site hosted on GitHub Pages. The site is built with [Jekyll](https://jekyllrb.com/) and uses the standard GitHub Pages workflow for deployment. These pages double as a sandbox for experimenting with LLM agents, vibe engineering, and general GitHub shenanigans, so expect things to change frequently as new ideas are tested.

## Workflow: turning an issue into a post

Posts are created from GitHub issues via the [`issue-to-post.yml`](.github/workflows/issue-to-post.yml) automation. To publish a post:

1. **Create or update an issue.** Draft the content you want to publish directly in the issue body. The workflow uses the issue title, body, and number for the generated post.
2. **Approve publishing.** When the draft is ready, add a `/publish` comment on the issue from an account authorized to maintain this repository. The workflow only responds when the comment author is associated with the repository as an `OWNER`, `MEMBER`, or `COLLABORATOR`, and ignores other comments.
3. **Let the workflow run.** The action creates a Markdown file in `_posts/` named with the current UTC date and a slugified version of the issue title. It automatically adds front matter with the `title`, `date`, and `issue_number`, then commits the file to the repository.
4. **Review and iterate.** Pull the latest changes if needed, review the generated post once the site rebuilds on GitHub Pages, and open follow-up pull requests for any edits. The original issue receives a confirmation comment with the generated file path.

Using the workflow ensures every published post is traceable back to its source issue and keeps the publication process automated and consistent.
