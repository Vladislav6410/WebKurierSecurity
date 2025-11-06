---

# 2) Workflow под Windows: `.github/workflows/replace_readme_ps1_pr.yml`

```yaml
name: 🪟 Replace README via PowerShell and Create PR

on:
  workflow_dispatch:
    inputs:
      dry_run:
        description: "Dry-run (no file changes committed)?"
        required: false
        default: "false"

jobs:
  replace-readme-windows:
    runs-on: windows-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          persist-credentials: false
          fetch-depth: 0

      - name: Verify script presence
        shell: pwsh
        run: |
          if (-not (Test-Path ".\replace_readme.ps1")) {
            Write-Error "replace_readme.ps1 not found in repository root."
          }

      - name: Run PowerShell script (Dry-run or Apply)
        shell: pwsh
        run: |
          if ("${{ github.event.inputs.dry_run }}" -eq "true") {
            pwsh -File .\replace_readme.ps1 -DryRun
          } else {
            pwsh -File .\replace_readme.ps1
          }

      - name: Configure Git
        shell: pwsh
        run: |
          git config user.name  "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

      - name: Create timestamped branch
        id: branch
        shell: pwsh
        run: |
          $branch = "auto/readme-update-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
          git checkout -b $branch
          echo "branch=$branch" | Out-File -FilePath $env:GITHUB_OUTPUT -Append -Encoding utf8

      - name: Commit changes (if any)
        shell: pwsh
        run: |
          git add README.md README_public.md README_tech.md LICENSE.txt 2>$null
          git diff --cached --quiet
          if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ No changes to commit."
            exit 0
          }
          git commit -m "📝 Update README and LICENSE via PowerShell (automated)"
          git push origin "${{ steps.branch.outputs.branch }}"

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          branch: ${{ steps.branch.outputs.branch }}
          title: "🪟 Auto: Replace README and LICENSE (PowerShell)"
          commit-message: "📝 Update README and LICENSE via PowerShell (auto)"
          body: |
            This PR was created by the Windows workflow running `replace_readme.ps1`.
            **Triggered by**: ${{ github.actor }}
            **Mode**: ${{ github.event.inputs.dry_run == 'true' && 'Dry Run' || 'Full Replace' }}
          labels: ["automation", "readme", "security", "windows"]
          draft: false