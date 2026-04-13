import { useRef } from 'react'
import { useBrandingStore } from '@/stores/brandingStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'

export function BrandingSettings() {
  const { branding, updateBranding } = useBrandingStore()
  const logoRef = useRef<HTMLInputElement>(null)

  function handleLogoUpload(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      updateBranding({ logo: e.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Company name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-name">Company name</Label>
        <Input
          id="company-name"
          placeholder="e.g. Acme Ltd"
          value={branding.companyName}
          onChange={(e) => updateBranding({ companyName: e.target.value })}
        />
      </div>

      {/* Logo */}
      <div className="flex flex-col gap-1.5">
        <Label>Logo</Label>
        {branding.logo ? (
          <div className="flex items-center gap-3">
            <img
              src={branding.logo}
              alt="Logo"
              className="h-10 object-contain rounded border border-gray-100 px-2"
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500 gap-1"
              onClick={() => updateBranding({ logo: null })}
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </Button>
          </div>
        ) : (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => logoRef.current?.click()}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload logo
            </Button>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleLogoUpload(file)
              }}
            />
          </div>
        )}
      </div>

      {/* Primary colour */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="primary-colour">Accent colour</Label>
        <div className="flex items-center gap-3">
          <input
            id="primary-colour"
            type="color"
            value={branding.primaryColour}
            onChange={(e) => updateBranding({ primaryColour: e.target.value })}
            className="w-10 h-10 rounded border border-gray-200 cursor-pointer p-1"
          />
          <Input
            value={branding.primaryColour}
            onChange={(e) => updateBranding({ primaryColour: e.target.value })}
            className="w-32 font-mono text-sm"
            maxLength={7}
          />
        </div>
      </div>
    </div>
  )
}
