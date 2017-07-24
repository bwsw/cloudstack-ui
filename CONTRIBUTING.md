# Contributing to Cloudstack UI
We would be glad if you contribute to our source code and help us to improve Cloudstack UI even more! We propose you to follow these guidelines:


Submitting a Pull request
Documentation fixes

 - [Question or problem?](#question)
 - [Submitting an issue](#issue)
 - [Submitting a Pull request](#submit-pr)
 - [Documentation fixes](#doc)
 - [Commit Message Guidelines](#commit)


## <a name="question"></a> Question or problem
If you have any question about how to use Cloudstack UI, please contact us at info@bw-sw.com
 
## <a name="issue"></a> Submitting an issue
You can help us by [submitting an issue](#submit-issue) to our [GitHub Repository][github] in case you find a bug in the source code, a mistake in the documentation or a proposal. A Pull Request with a fix would be even better. 
Before you submit an issue, search the archive, maybe your question was already answered.

Here are the submission guidelines we would like you to follow:

* **Detailed overview of the Issue** - if an error is being thrown a non-minified stack trace helps
* **A type of the issue (labels)**
* **Related issues** - has a similar issue been reported before?
* **Browsers and Operating System** - is this a problem with all browsers?
* **Reproduce the Error** - A set of steps to reproduce the error (in case of a bug)
* **Screenshots** - Screenshots can help the team triage issues far more quickly than a text description.
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
    causing the problem (line of code or commit)


## <a name="doc"></a> Documentation fixes
If you have any ideas how to help us to improve the documentation, please let others know what you're working on by creating a new issue or comment on a related existing one (please, follow the guidelines contained in Submitting an issue).

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the change log**.

### Commit Message Format
Each commit message consists of a **header** and a **body**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of
the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is
the SHA of the commit being reverted.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **build**: Changes that affect the build system, CI configuration or external dependencies
            (example scopes: gulp, broccoli, npm)
* **chore**: Other changes that don't modify `src` or `test` files

### Scope
The scope could be anything specifying place of the commit change. For example
`vm`, `volume`, etc.

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines.
The rest of the commit message is then used for this.