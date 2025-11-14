# Setup Documentation

## Overview

This is a Jekyll-based personal blog hosted on GitHub Pages, featuring automated workflows for content publishing, PII scanning, and blog previews. The site serves as both a blogging platform and a sandbox for experimenting with LLM agents, vibe engineering, and GitHub automation.

## Prerequisites

### For Local Development
- **Ruby** 3.1 or higher
- **Bundler** (Ruby gem manager)
- **Jekyll** (installed via Bundler)

### For GitHub Actions
All automated workflows run in GitHub Actions and require no local setup. However, ensure:
- GitHub Pages is enabled for this repository
- GitHub Actions are enabled
- Required permissions are configured (see Workflows section)

## Repository Structure

```
shaobohou.github.io/
├── .github/
│   ├── workflows/           # GitHub Actions workflows
│   │   ├── issue-to-post.yml    # Convert issues to posts
│   │   ├── blog-preview.yml     # Generate PR previews
│   │   ├── pii-check.yml        # Scan for PII leaks
│   │   ├── claude.yml           # Claude integration
│   │   └── claude-code-review.yml
│   └── prompts/
│       └── pii-scan.prompt.yml  # PII scanning prompt
├── _layouts/                # Jekyll layout templates
│   ├── default.html         # Base layout with styling
│   └── post.html            # Post-specific layout
├── _posts/                  # Published blog posts
│   └── YYYY-MM-DD-title.md  # Post files (auto-generated)
├── _config.yml              # Jekyll configuration
├── index.html               # Homepage template
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shaobohou/shaobohou.github.io.git
cd shaobohou.github.io
```

### 2. Install Ruby Dependencies

This repository uses GitHub Pages' default Jekyll configuration, so no Gemfile is committed. For local development:

```bash
# Initialize bundler
bundle init

# Add Jekyll
bundle add jekyll

# Install dependencies
bundle install
```

### 3. Run Local Server

```bash
# Build and serve the site
bundle exec jekyll serve

# The site will be available at http://localhost:4000
# Live reload is enabled by default
```

### 4. Build for Production

```bash
# Generate static site in _site/ directory
bundle exec jekyll build
```

## GitHub Actions Workflows

### Issue to Post Workflow (`issue-to-post.yml`)

**Purpose:** Automatically converts GitHub issues into blog posts

**Trigger:** Issue comments containing `/publish`

**Requirements:**
- Comment author must be OWNER, MEMBER, or COLLABORATOR
- Only works on issues (not pull requests)

**Process:**
1. Issue comment with `/publish` triggers the workflow
2. Script generates a filename: `YYYY-MM-DD-{slug}.md`
3. Creates post in `_posts/` with YAML front matter
4. Commits and pushes to main branch
5. Adds confirmation comment to issue

**Permissions Required:**
- `contents: write` (commit files)
- `issues: write` (post comments)

### Blog Preview Workflow (`blog-preview.yml`)

**Purpose:** Generates homepage preview screenshots for pull requests

**Trigger:**
- Pull requests affecting blog content (posts, layouts, index, config)
- Manual dispatch

**Process:**
1. Sets up Ruby and Jekyll
2. Builds the Jekyll site
3. Installs Playwright and captures screenshot
4. Uploads screenshot to `preview-images` branch
5. Posts preview image as PR comment

**Permissions Required:**
- `contents: write` (commit preview images)
- `pull-requests: write` (post comments)
- `issues: write` (post comments)

**Output:**
- Screenshot artifact available in workflow run
- Preview image stored in `preview-images` branch under `pr-{number}/`
- Automated comment with embedded preview image

### PII Leak Check Workflow (`pii-check.yml`)

**Purpose:** Scans blog post content for personally identifiable information

**Trigger:**
- Pull requests modifying files in `_posts/`
- Issues when opened or edited

**Process:**
For pull requests:
1. Collects diff of post changes between base and head commits
2. Sends diff to GitHub Models AI for PII analysis
3. Evaluates response for PII detection
4. Posts summary comment to PR
5. Fails workflow if PII is detected

For issues:
1. Extracts issue body content
2. Sends content to GitHub Models AI for PII analysis
3. Evaluates response for PII detection
4. Posts summary comment to issue
5. Fails workflow if PII is detected (alerts before publishing with `/publish`)

**Permissions Required:**
- `contents: read` (read repository)
- `pull-requests: write` (post comments)
- `models: read` (access GitHub Models)
- `issues: write` (post comments)
- `id-token: write` (authenticate with GitHub Models)

**AI Prompt:** Configured in `.github/prompts/pii-scan.prompt.yml`

## Publishing Workflow

### Creating a Blog Post from an Issue

1. **Create an issue** with your blog post content
   - Issue title becomes post title
   - Issue body becomes post content
   - Markdown formatting is preserved

2. **Comment `/publish`** on the issue
   - Must be done by a repository OWNER, MEMBER, or COLLABORATOR
   - Other users' comments are ignored

3. **Automated processing**
   - Workflow generates filename from title (slugified)
   - Creates `_posts/YYYY-MM-DD-{slug}.md`
   - Adds YAML front matter with title, date, and issue number
   - Commits to main branch

4. **Deployment**
   - GitHub Pages automatically rebuilds on push
   - Post appears on site within minutes
   - Issue receives confirmation comment with file path

### Example Post Structure

```markdown
---
title: "Your Post Title"
date: 2025-01-15
issue_number: 42
---

Your post content goes here. Markdown formatting is fully supported.

## Subheadings work

- Bullet points
- Also work

Code blocks are supported:
```code
example
```
```

## Configuration

### Jekyll Configuration (`_config.yml`)

```yaml
title: LLMs and Github shenanigans
description: A playground for experimenting with LLM agents, vibe engineering, and assorted GitHub shenanigans.
defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: post
```

### Gitignore (`.gitignore`)

The repository ignores:
- `_site/` - Jekyll build output
- `.DS_Store` - macOS system files
- `Gemfile` and `Gemfile.lock` - Ruby dependencies (using GitHub Pages defaults)

## Design and Styling

### Layout System

The site uses two main layouts:

1. **default.html** - Base layout with:
   - Responsive design
   - CSS custom properties for theming
   - Light/dark mode support (via `prefers-color-scheme`)
   - Animated gradient backgrounds
   - Glassmorphic cards with backdrop blur
   - Accessibility features (reduced motion, focus states)

2. **post.html** - Post-specific layout extending default with:
   - Back to home navigation
   - Post metadata (date, read time)
   - Formatted content area
   - Syntax-highlighted code blocks

### Styling Features

- **Responsive:** Mobile-first design with breakpoints at 768px
- **Accessible:** Focus states, semantic HTML, reduced motion support
- **Animated:** Gradient shifts, hover effects, shimmer animations
- **Modern:** CSS Grid, Flexbox, custom properties, backdrop filters

## Troubleshooting

### Local Development Issues

**Jekyll not found:**
```bash
gem install bundler jekyll
bundle install
```

**Port 4000 already in use:**
```bash
bundle exec jekyll serve --port 4001
```

**Changes not showing:**
- Clear browser cache
- Rebuild site: `bundle exec jekyll build --force`
- Check that files are in correct directories

### Workflow Issues

**`/publish` not working:**
- Verify you have OWNER, MEMBER, or COLLABORATOR access
- Check that comment is on an issue (not PR)
- Review workflow run logs in Actions tab

**PII check failing:**
- Review PII findings in workflow logs
- Edit post to remove detected information
- Push changes to trigger re-scan

**Preview not generating:**
- Check workflow logs for build errors
- Verify PR modifies relevant files (posts, layouts, index)
- Ensure Jekyll build completes successfully

## Additional Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Liquid Template Language](https://shopify.github.io/liquid/)

## Contributing

This is a personal blog, but the workflows and setup can be adapted for your own use. Feel free to fork and customize!
