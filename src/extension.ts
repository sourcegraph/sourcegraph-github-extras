import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import * as sourcegraph from 'sourcegraph'

interface Settings {
    ['github.explore.repositories']: string[]
}

interface PullRequest {
    number: number
    title: string
    html_url: string
    updated_at: string
    base: {
        ref: string
        repo: {
            id: string
            full_name: string
            html_url: string
            default_branch: string
        }
    }
    head: {
        ref: string
        repo: { id: string }
    }
    user: {
        login: string
    }
}

export async function activate(): Promise<void> {
    // HACK: work around bug where configuration is not synchronously available
    await new Promise(resolve => setTimeout(resolve, 0))

    // TODO(sqs): does not refresh as you switch repos

    let repos: string[]
    let inFile = false
    if (
        sourcegraph.workspace.textDocuments.length > 0 &&
        sourcegraph.workspace.textDocuments[0].uri.startsWith('git://github.com/')
    ) {
        // Use currently open repository.
        //
        // pathname is not actually the URI path because non-https?: URIs are treated specially.
        const { pathname } = new URL(sourcegraph.workspace.textDocuments[0].uri)
        repos = [pathname.replace('//github.com/', '')] // TODO(sqs): assumes host == 'github.com'
        inFile = true
    } else {
        // Otherwise, assume we are on the Explore page because there is no repository shown.
        repos = sourcegraph.configuration.get<Settings>().get('github.explore.repositories') || [
            'sourcegraph/sourcegraph',
        ]
    }

    const data = await Promise.all(
        repos.map(async repo => {
            const resp = await fetch(`https://api.github.com/repos/${repo}/pulls?status=open`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            if (resp.status !== 200) {
                throw new Error(await resp.text())
            }
            return { repo, pullRequests: (await resp.json()) as PullRequest[] }
        })
    )

    const view = sourcegraph.app.createPanelView('github.pullRequests')
    view.title = 'GitHub'
    view.content = data.map(({ repo, pullRequests }) => renderRepository(repo, pullRequests, inFile)).join('\n\n')
}

function renderRepository(repo: string, pulls: PullRequest[], inFile: boolean): string {
    if (pulls.length === 0) {
        return ''
    }
    // TODO(sqs): un-hardcode github.com
    return (
        (inFile
            ? `[Pull requests in ${repo}](${pulls[0].base.repo.html_url}/pulls):`
            : `### [${repo}](${pulls[0].base.repo.html_url}/pulls)` +
              '\n\n' +
              `[View repository](/github.com/${repo}) — [Search in this repository](/search?q=repo:${repo})`) +
        '\n\n' +
        '| Pull request | Author | Updated | Compare |\n' +
        '| --- | --- | --- | --- |\n' +
        pulls.map(renderPullRequest).join('\n') +
        '\n\n'
    )
}

function renderPullRequest(pull: PullRequest): string {
    // TODO(sqs): un-hardcode github.com
    return `| [#${pull.number} ${truncate(pull.title, 64)}](${pull.html_url}) | @${
        pull.user.login
    } | ${formatDistanceStrict(pull.updated_at, Date.now(), { addSuffix: true })} | [${backtick(
        truncate(
            pull.base.ref === pull.base.repo.default_branch ? pull.head.ref : `${pull.base.ref}...${pull.head.ref}`,
            32
        )
    )}](/github.com/${pull.base.repo.full_name}/-/compare/${pull.base.ref}...${
        pull.head.repo.id === pull.base.repo.id ? pull.head.ref : `refs/pull/${pull.number}/head`
    }) |`
}

function backtick(s: string): string {
    return '`' + s + '`'
}

function truncate(s: string, max: number, omission = '…'): string {
    if (s.length <= max) {
        return s
    }
    return `${s.slice(0, max)}${omission}`
}
