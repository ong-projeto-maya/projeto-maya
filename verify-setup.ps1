# =============================================================================
# Verificação Completa — Supabase Local Setup
# Execute APÓS completar todos os passos do SETUP_SUPABASE.md
# =============================================================================

Write-Host "🔍 Iniciando verificação do setup Supabase..." -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# -----------------------------------------------------------------------------
# 1. Verificar Supabase CLI
# -----------------------------------------------------------------------------
Write-Host "1️⃣ Verificando Supabase CLI..." -ForegroundColor Yellow
try {
    $version = supabase --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Supabase CLI instalado: $version" -ForegroundColor Green
    } else {
        $errors += "Supabase CLI não encontrado"
    }
} catch {
    $errors += "Supabase CLI não encontrado no PATH"
}

# -----------------------------------------------------------------------------
# 2. Verificar Docker
# -----------------------------------------------------------------------------
Write-Host "2️⃣ Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Docker instalado: $dockerVersion" -ForegroundColor Green
    } else {
        $errors += "Docker não encontrado"
    }
} catch {
    $errors += "Docker não instalado ou não está no PATH"
}

# -----------------------------------------------------------------------------
# 3. Verificar Supabase rodando
# -----------------------------------------------------------------------------
Write-Host "3️⃣ Verificando status do Supabase..." -ForegroundColor Yellow
try {
    $status = supabase status 2>&1
    if ($status -match "API URL") {
        Write-Host "   ✅ Supabase está rodando" -ForegroundColor Green
        
        # Extrair URLs importantes
        if ($status -match "API URL: (http://[^\s]+)") {
            Write-Host "   📍 API URL: $($matches[1])" -ForegroundColor Cyan
        }
        if ($status -match "Studio URL: (http://[^\s]+)") {
            Write-Host "   📍 Studio URL: $($matches[1])" -ForegroundColor Cyan
        }
    } else {
        $errors += "Supabase não está rodando. Execute: supabase start"
    }
} catch {
    $errors += "Erro ao verificar status do Supabase"
}

# -----------------------------------------------------------------------------
# 4. Verificar .env.local
# -----------------------------------------------------------------------------
Write-Host "4️⃣ Verificando .env.local..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321") {
        Write-Host "   ✅ NEXT_PUBLIC_SUPABASE_URL configurado" -ForegroundColor Green
    } else {
        $warnings += ".env.local: NEXT_PUBLIC_SUPABASE_URL pode estar incorreto"
    }
    
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=<COPIAR") {
        $warnings += ".env.local: NEXT_PUBLIC_SUPABASE_ANON_KEY ainda contém placeholder!"
    } elseif ($envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ") {
        Write-Host "   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurado" -ForegroundColor Green
    } else {
        $warnings += ".env.local: NEXT_PUBLIC_SUPABASE_ANON_KEY pode estar incorreto"
    }
    
    if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY=<COPIAR") {
        $warnings += ".env.local: SUPABASE_SERVICE_ROLE_KEY ainda contém placeholder!"
    } elseif ($envContent -match "SUPABASE_SERVICE_ROLE_KEY=eyJ") {
        Write-Host "   ✅ SUPABASE_SERVICE_ROLE_KEY configurado" -ForegroundColor Green
    } else {
        $warnings += ".env.local: SUPABASE_SERVICE_ROLE_KEY pode estar incorreto"
    }
} else {
    $errors += ".env.local não encontrado na raiz do projeto"
}

# -----------------------------------------------------------------------------
# 5. Verificar arquivos Supabase
# -----------------------------------------------------------------------------
Write-Host "5️⃣ Verificando estrutura de arquivos..." -ForegroundColor Yellow
$requiredFiles = @(
    "supabase\config.toml",
    "supabase\schema.sql",
    "supabase\seed.sql"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        $errors += "Arquivo não encontrado: $file"
    }
}

# -----------------------------------------------------------------------------
# 6. Verificar banco de dados (se Supabase estiver rodando)
# -----------------------------------------------------------------------------
Write-Host "6️⃣ Verificando banco de dados..." -ForegroundColor Yellow
if ($errors -notcontains "Supabase não está rodando. Execute: supabase start") {
    try {
        # Verificar tabelas
        $tables = supabase db execute --sql "SELECT tablename FROM pg_tables WHERE schemaname='public';" 2>&1
        
        $requiredTables = @("doadores", "doacoes", "admin_users", "animais", "site_stats")
        $foundTables = 0
        
        foreach ($table in $requiredTables) {
            if ($tables -match $table) {
                $foundTables++
            }
        }
        
        if ($foundTables -eq $requiredTables.Count) {
            Write-Host "   ✅ Todas as tabelas criadas ($foundTables/$($requiredTables.Count))" -ForegroundColor Green
        } else {
            $warnings += "Apenas $foundTables/$($requiredTables.Count) tabelas encontradas. Execute: supabase db execute --file supabase/schema.sql"
        }
        
        # Verificar usuário admin
        $adminCheck = supabase db execute --sql "SELECT COUNT(*) as count FROM public.admin_users WHERE username='admin';" 2>&1
        if ($adminCheck -match "1") {
            Write-Host "   ✅ Usuário admin criado" -ForegroundColor Green
        } else {
            $warnings += "Usuário admin não encontrado. Execute: create-admin-user.ps1 e create-admin.sql"
        }
    } catch {
        $warnings += "Erro ao verificar banco de dados"
    }
}

# -----------------------------------------------------------------------------
# 7. Verificar conectividade API
# -----------------------------------------------------------------------------
Write-Host "7️⃣ Testando conectividade com API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:54321/rest/v1/" -Method Get -TimeoutSec 5 2>&1
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 401) {
        Write-Host "   ✅ API Supabase acessível" -ForegroundColor Green
    } else {
        $warnings += "API retornou status inesperado: $($response.StatusCode)"
    }
} catch {
    if ($_.Exception.Message -match "401") {
        Write-Host "   ✅ API Supabase acessível (requer auth)" -ForegroundColor Green
    } else {
        $warnings += "Erro ao conectar na API: $($_.Exception.Message)"
    }
}

# -----------------------------------------------------------------------------
# Resumo Final
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 RESUMO DA VERIFICAÇÃO" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host ""
    Write-Host "🎉 SETUP COMPLETO E FUNCIONANDO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Yellow
    Write-Host "  1. Execute: npm run dev" -ForegroundColor Cyan
    Write-Host "  2. Acesse: http://localhost:3002/admin" -ForegroundColor Cyan
    Write-Host "  3. Login com: admin / admin123" -ForegroundColor Cyan
    Write-Host ""
} else {
    if ($errors.Count -gt 0) {
        Write-Host ""
        Write-Host "❌ ERROS CRÍTICOS ($($errors.Count)):" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "   • $error" -ForegroundColor Red
        }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "⚠️  AVISOS ($($warnings.Count)):" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "   • $warning" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "📖 Consulte SETUP_SUPABASE.md para instruções completas" -ForegroundColor Cyan
}

Write-Host ""
