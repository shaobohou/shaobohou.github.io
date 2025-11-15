# Setup

## Overview

Jekyll-based blog on GitHub Pages with automated workflows for publishing, PII scanning, and previews.

## Prerequisites

**Local development:**
- Ruby 3.1+
- Bundler
- Jekyll

**GitHub Actions:** Enable GitHub Pages and Actions in repository settings.

## Repository Structure

```
.github/workflows/     # Automation workflows
_layouts/              # Jekyll templates (default.html, post.html)
_posts/                # Published posts (YYYY-MM-DD-title.md)
_config.yml            # Jekyll config
index.html             # Homepage
```

## Local Development

```bash
# Clone and setup
git clone https://github.com/shaobohou/shaobohou.github.io.git
cd shaobohou.github.io
bundle init && bundle add jekyll && bundle install

# Run local server
bundle exec jekyll serve  # http://localhost:4000

# Build
bundle exec jekyll build
```

## Workflows

### Issue to Post (`issue-to-post.yml`)
- **Trigger:** `/publish` comment on issue by OWNER/MEMBER/COLLABORATOR
- **Action:** Converts issue to post in `_posts/`, commits to main, deploys via GitHub Pages

### Blog Preview (`blog-preview.yml`)
- **Trigger:** PRs modifying posts/layouts/index/config
- **Action:** Builds site, captures screenshot, posts preview comment

### PII Check (`pii-check.yml`)
- **Trigger:** PRs modifying `_posts/` OR issues opened/edited
- **Action:** Scans content with GitHub Models AI, fails if PII detected
- **Purpose:** Prevents publishing sensitive information

## Troubleshooting

**Jekyll not found:** `gem install bundler jekyll && bundle install`

**Port in use:** `bundle exec jekyll serve --port 4001`

**`/publish` not working:** Must have OWNER/MEMBER/COLLABORATOR access

**PII check failing:** Review workflow logs, remove detected PII

**Preview not generating:** Check workflow logs for build errors
