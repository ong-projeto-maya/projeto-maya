# =============================================================================
# Script Auxiliar — Criar Admin via API Supabase
# Execute APÓS `supabase start` e APÓS capturar o service_role_key
# =============================================================================
# IMPORTANTE: Substitua <SERVICE_ROLE_KEY> na linha 18 antes de executar!
# =============================================================================

param(
    [Parameter(Mandatory=$false)]
    [string]$ServiceRoleKey = "<SERVICE_ROLE_KEY>"
)

if ($ServiceRoleKey -eq "<SERVICE_ROLE_KEY>") {
    Write-Host "❌ ERRO: Você precisa substituir <SERVICE_ROLE_KEY> com a chave real!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Obtenha a chave executando:" -ForegroundColor Yellow
    Write-Host "  supabase start" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "E procure pela linha:" -ForegroundColor Yellow
    Write-Host "  service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso correto:" -ForegroundColor Yellow
    Write-Host "  .\create-admin-user.ps1 -ServiceRoleKey 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'" -ForegroundColor Cyan
    exit 1
}

Write-Host "🔧 Criando usuário admin via Supabase Auth API..." -ForegroundColor Cyan

$headers = @{
    "apikey" = $ServiceRoleKey
    "Authorization" = "Bearer $ServiceRoleKey"
    "Content-Type" = "application/json"
}

$body = @{
    email = "admin@admin.projetomaya.br"
    password = "admin123"
    email_confirm = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:54321/auth/v1/admin/users" `
                                   -Method Post `
                                   -Headers $headers `
                                   -Body $body

    Write-Host "✅ Usuário criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "User ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Email: $($response.email)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Agora execute:" -ForegroundColor Yellow
    Write-Host "  supabase db execute --file create-admin.sql" -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERRO ao criar usuário:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique se:" -ForegroundColor Yellow
    Write-Host "  1. Supabase está rodando (supabase status)" -ForegroundColor White
    Write-Host "  2. A service_role_key está correta" -ForegroundColor White
    Write-Host "  3. A porta 54321 está acessível" -ForegroundColor White
    exit 1
}
