<#
rename_assets.ps1

Descrição:
 - Renomeia arquivos dentro da pasta `assets/` para lowercase e substitui espaços por '-'.
 - Gera um mapeamento `rename-mapping.json` com pares original->novo.
 - Atualiza referências em arquivos `.html`, `.js` e `.css` no repositório.
 - Cria backups dos arquivos modificados na pasta `backups/`.

USO (Windows PowerShell):
  PS> .\scripts\rename_assets.ps1 -AssetsDir ".\assets"

Observação: revise `rename-mapping.json` antes de commitar.
#>

param(
    [string]$AssetsDir = ".\assets"
)

if (-not (Test-Path $AssetsDir)) {
    Write-Error "Assets directory not found: $AssetsDir"
    exit 1
}

$mappings = @()

$files = Get-ChildItem -Path $AssetsDir -File -Recurse

foreach ($f in $files) {
    $origName = $f.Name
    $dir = $f.DirectoryName
    $ext = [System.IO.Path]::GetExtension($origName)
    $base = [System.IO.Path]::GetFileNameWithoutExtension($origName)

    $normalizedBase = $base.ToLower() -replace '\s+', '-' -replace '[^a-z0-9\-._]+',''
    $newName = ($normalizedBase + $ext.ToLower())

    if ($origName -ne $newName) {
        $oldPath = $f.FullName
        $newPath = Join-Path $dir $newName

        if (Test-Path $newPath) {
            Write-Warning "Skipping rename: target exists -> $newName"
            continue
        }

        Write-Host "Renaming: $origName -> $newName"
        Rename-Item -LiteralPath $oldPath -NewName $newName

        $mappings += [PSCustomObject]@{ orig = $origName; new = $newName }
    }
}

if ($mappings.Count -eq 0) {
    Write-Host "Nenhuma renomeação necessária. Saindo."
    exit 0
}

$mappingPath = Join-Path $AssetsDir 'rename-mapping.json'
$mappings | ConvertTo-Json -Depth 3 | Out-File -FilePath $mappingPath -Encoding utf8
Write-Host "Mapping salvo em: $mappingPath"

$backupDir = Join-Path (Get-Location) "backups\rename_$(Get-Date -Format yyyyMMdd_HHmmss)"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$targetFiles = Get-ChildItem -Path . -Include *.html,*.js,*.css -Recurse

foreach ($tf in $targetFiles) {
    $content = Get-Content -Raw -LiteralPath $tf.FullName -ErrorAction SilentlyContinue
    if ($null -eq $content) { continue }

    $newContent = $content
    $changed = $false

    foreach ($pair in $mappings) {
        $orig = [regex]::Escape($pair.orig)
        $new = $pair.new
        if ($newContent -match $orig) {
            $newContent = $newContent -replace $orig, $new
            $changed = $true
        }
    }

    if ($changed) {
        $relPath = $tf.FullName.Substring((Get-Location).Path.Length).TrimStart('\')
        $bakPath = Join-Path $backupDir ($relPath -replace '[\\/:]','_')
        Copy-Item -LiteralPath $tf.FullName -Destination $bakPath -Force

        Set-Content -LiteralPath $tf.FullName -Value $newContent -Encoding utf8
        Write-Host "Updated references in: $($tf.FullName)"
    }
}

Write-Host "Renomeação concluída. Verifique $mappingPath e backups em $backupDir antes de commitar."
