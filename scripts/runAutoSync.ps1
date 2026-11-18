$ErrorActionPreference = "Continue"
$WorkDir = "F:\pubg_sell_id_vn"
Set-Location $WorkDir

$LogDir = Join-Path $WorkDir "logs"
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir | Out-Null
}
$LogFile = Join-Path $LogDir "auto_sync.log"

$Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
Add-Content -Path $LogFile -Value "======================================================="
Add-Content -Path $LogFile -Value "[$Timestamp] Starting China Stock Automated Sync..."

try {
    # 1. Run sync script to pull all active accounts (filtered < 500 THB)
    & node "$WorkDir\scripts\syncChinaStock.js" --all *>> $LogFile

    # 2. Stage updated stock JSON
    & git add "$WorkDir\new-react-app\public\data\china_stock.json" *>> $LogFile

    # 3. Check if there are changes
    & git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
        $CommitMsg = "chore(stock): auto-sync China inventory [" + (Get-Date).ToString("yyyy-MM-dd HH:mm") + "]"
        & git commit -m $CommitMsg *>> $LogFile
        & git push origin main *>> $LogFile
        $EndTimestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Add-Content -Path $LogFile -Value "[$EndTimestamp] Success: New stock committed and pushed to Vercel production."
    } else {
        $EndTimestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Add-Content -Path $LogFile -Value "[$EndTimestamp] Stock up to date. No new inventory changes."
    }
} catch {
    $ErrTimestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Add-Content -Path $LogFile -Value "[$ErrTimestamp] Error: $_"
}
Add-Content -Path $LogFile -Value "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] Sync session finished."
