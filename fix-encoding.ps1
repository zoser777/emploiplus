$files = @("app\page.tsx","app\apropos\page.tsx","app\admin\dashboard\services\page.tsx","app\admin\dashboard\team\page.tsx","app\admin\dashboard\testimonials\page.tsx")
foreach ($file in $files) {
  if (Test-Path $file) {
    $bytes = [System.IO.File]::ReadAllBytes("$PWD\$file")
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    $text = $text.Replace("Ã©","é").Replace("Ã¨","è").Replace("Ã ","à").Replace("Ã¢","â").Replace("Ã®","î").Replace("Ã´","ô").Replace("Ã»","û").Replace("Ã§","ç").Replace("Ã‰","É").Replace("Ã€","À").Replace("Ãª","ê").Replace("Ã¹","ù").Replace("Ã¯","ï").Replace("Ã«","ë").Replace("Â°","°").Replace("Â«","«").Replace("Â»","»").Replace("â€™","'").Replace("â€˜","'").Replace("â€œ",'"').Replace("â€ ",'"').Replace("â€"","–").Replace("CrÃ©er","Créer").Replace("crÃ©Ã©","créé").Replace("DÃ©crivez","Décrivez").Replace("IcÃ´ne","Icône").Replace("PrÃªt","Prêt").Replace("â€¦","...")
    [System.IO.File]::WriteAllText("$PWD\$file", $text, [System.Text.Encoding]::UTF8)
    Write-Host "OK: $file"
  }
}
