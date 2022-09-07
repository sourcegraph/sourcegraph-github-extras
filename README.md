# sourcegraph-github-extras

## ⚠️ Deprecation notice

**Sourcegraph extensions have been deprecated with the September 2022 Sourcegraph
release. [Learn more](https://docs.sourcegraph.com/extensions/deprecation).**

The repo and the docs below are kept to support older Sourcegraph versions.

## Description

[![build](https://travis-ci.org/sourcegraph/sourcegraph-github-extras.svg?branch=master)](https://travis-ci.org/sourcegraph/sourcegraph-github-extras)
[![codecov](https://codecov.io/gh/sourcegraph/sourcegraph-github-extras/branch/master/graph/badge.svg?token=c3KpMf1MaY)](https://codecov.io/gh/sourcegraph/sourcegraph-github-extras)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A [Sourcegraph extension](https://docs.sourcegraph.com/extensions) that adds more GitHub integration features to [Sourcegraph](https://sourcegraph.com).

- **GitHub: Pull requests**: see a table of GitHub pull requests for the current repository

[**🗃️ Source code**](https://github.com/sourcegraph/sourcegraph-github-extras)

[**➕ Add to Sourcegraph**](https://sourcegraph.com/extensions/sourcegraph/github-extras)

## Known issues

This extension is experimental.

- The GitHub API request is sent each time the page loads. This is likely to cause you to hit the GitHub API rate limit (for unauthenticated users, it's 60 requests per minute).
- When you navigate to a different repository, the pull requests panel still shows the list from the first repository you viewed. Reload your browser to refresh the list.
