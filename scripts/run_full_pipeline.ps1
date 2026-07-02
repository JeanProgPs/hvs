<#
run_full_pipeline.ps1

Executa em sequência:
  1) `rename_assets.ps1` (renomeia arquivos em `assets/` e atualiza referências)
  2) `optimize_images.js` (gera WebP/AVIF a partir de imagens em `assets/`)

O script pede confirmação antes de cada etapa e faz checagens mínimas (Node.js instalado).

Uso:
  Abra PowerShell na raiz do projeto e execute:
    .\scripts\run_full_pipeline.ps1

Aviso: sempre revise os arquivos gerados em `backups/` e `assets/rename-mapping.json` antes de commitar.
#>

function Confirm-Yes([string]$prompt) {
    $answer = Read-Host "$prompt [S/N]"
    if ($null -eq $answer) { return $false }
    return $answer.Trim().ToUpper().StartsWith('S')
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $projectRoot

Write-Host "Projeto: $($projectRoot.Path)"

# Step 1: Rename assets
if (Confirm-Yes 'Executar renomeação de arquivos em assets agora?') {
    $renameScript = Join-Path $PSScriptRoot 'rename_assets.ps1'
    if (-not (Test-Path $renameScript)) {
        Write-Error "rename_assets.ps1 não encontrado: $renameScript"
        exit 1
    }

    Write-Host 'Executando rename_assets.ps1...'
    & powershell -NoProfile -ExecutionPolicy Bypass -File $renameScript -AssetsDir ".\assets"
    if ($LASTEXITCODE -ne 0) { Write-Warning "rename_assets.ps1 retornou código $LASTEXITCODE" }
} else { Write-Host 'Renomeação pulada pelo usuário.' }

# Step 2: Optimize images
if (Confirm-Yes 'Executar otimização de imagens (WebP / AVIF) agora?') {
    $node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $node) {
        Write-Error 'Node.js não encontrado no PATH. Instale Node.js para executar a otimização.'
        exit 1
    }

    # Offer to install sharp
    if (Confirm-Yes "Deseja executar 'npm install sharp' antes de otimizar (recomendado se não estiver instalado)?") {
        npm install sharp
    } else { Write-Host 'Pulando instalação do sharp; assumindo que já está disponível.' }

    $optScript = Join-Path $PSScriptRoot 'optimize_images.js'
    if (-not (Test-Path $optScript)) {
        Write-Error "optimize_images.js não encontrado: $optScript"
        exit 1
    }

    $useAvif = Confirm-Yes 'Gerar AVIF além de WebP?'
    $args = @()
    if ($useAvif) { $args += '--avif' }

    Write-Host 'Executando otimização de imagens...'
    & node $optScript @args
    if ($LASTEXITCODE -ne 0) { Write-Warning "optimize_images.js retornou código $LASTEXITCODE" }
} else { Write-Host 'Otimização pulada pelo usuário.' }

Write-Host 'Pipeline concluído.'
